import { compareText, encryptText } from "../utils/encrypter";
import { generateConfirmCode } from "../utils/userMisc";
import { sendConfirmEmail } from "../utils/emailer";
import { EntryList } from "../entity/EntryList";
import { AppDataSource } from "../data-source";
import { getUser } from "../utils/serverUtils";
import { createJWT } from "../utils/jwt";
import { User } from "../entity/User";

// imports for file upload and manipulation
const sharp = require('sharp')

export async function userRoutes (fastify, options) {
	fastify.options('/api/user/confirm-email', async (req, resp) => {})
	fastify.options('/api/user/getOwnAccount', async (req, resp) => {})
	fastify.options('/api/user/verify', async (req, resp) => {})

	fastify.post('/api/user/create', async (req, resp) => {
		const info = JSON.parse(req.body)
		const newUser = new User()

		try {
			if (!info.password || !info.name || !info.email)
				throw 'error'

			newUser.name = info.name
			newUser.email = info.email
			newUser.password = await encryptText(info.password)
			newUser.join_date = new Date().toISOString().substring(0, 10)
			newUser.confirm_code = generateConfirmCode(8)
		}
		catch (err) {
			console.log(err)
			return { success: false, message: 'missing information in request body'}
		}
		
		const existing = await AppDataSource.manager.findOneBy(User, { email: info.email })
		if (existing)
			return { success: false, message: 'email already exists' }

		await AppDataSource.manager.save(newUser)

		return { success: true }
	}) 

	fastify.post('/api/user/confirm-email', async (req, resp) => {
		const { success, user } = await getUser(req)
		if (!success) {
			return user
		}

		const info = JSON.parse(req.body)
		try {
			if (info.confirm_code !== user.confirm_code)
				return { success: false, message: 'wrong code' }
		}
		catch (err) {
			return { success: false, message: 'missing confirm_code in body' }
		}

		user.confirmed_email = true
		user.confirm_code = ''

		await AppDataSource.manager.save(user)

		return { success: true }
	})

	fastify.post('/api/user/login', async (req, resp) => {
		const info = JSON.parse(req.body)
		const user = await AppDataSource.manager.findOneBy(User, { email: info.email })
		if (!user)
			return { success: false, message: 'user not found' }

		if (!await compareText(info.password, user.password))
			return { success: false, message: 'wrong password' }

		const jwt = await createJWT(user)

		if (!user.confirmed_email) {
			user.confirm_code = generateConfirmCode(8)
			await AppDataSource.manager.save(user)
			await sendConfirmEmail(user)
			return { success: false, message: 'email not confirmed', token: jwt }
		}

		// maybe find something safer
		return { success: true, token: jwt }
	})

	fastify.get('/api/user/get/:id', async (req, resp) => {
		const user = await AppDataSource.manager.findOne(User, {
			relations: { entries: true },
			where: {
				id: req.params.id
			}
		})

		const newUser: User = user
		const entries: EntryList[] = await AppDataSource.manager.find(EntryList, {
			relations: { anime: true },
			where: {
				user,
				is_favorite: true
			}
		})

		const parsedEntries = []
		entries.forEach((val) => {
			parsedEntries.push({
				is_anime: val.is_anime,
				score: val.score,
				anime: {
					name: val.anime.name,
					img_url: val.anime.img_url,
					mal_id: val.anime.mal_id
				}
			})
		})

		return {
			user: {
				name: newUser.name,
				join_date: newUser.join_date,
				profile_picture: newUser.profile_picture
			},
			entries: parsedEntries
		}
	})

	fastify.get('/api/user/getOwnAccount', async (req, resp) => {
		const { success, user } = await getUser(req)
		if (!success)
			return user

		const newUser: User = user

		const entries: EntryList[] = await AppDataSource.manager.find(EntryList, {
			relations: { anime: true },
			where: {
				user,
				is_favorite: true
			}
		})

		const parsedEntries = []
		entries.forEach((val) => {
			parsedEntries.push({
				is_anime: val.is_anime,
				score: val.score,
				anime: {
					name: val.anime.name,
					img_url: val.anime.img_url,
					mal_id: val.anime.mal_id
				}
			})
		})

		return {
			user: {
				name: newUser.name,
				join_date: newUser.join_date,
				profile_picture: newUser.profile_picture
			},
			entries: parsedEntries
		}
	})

	fastify.get('/api/user/verify', async (req, resp) => {
		const { success, user } = await getUser(req)
		if (!success)
			return user

		return { success: Boolean(user), confirmed_email: user.confirmed_email }
	})

	fastify.get('/api/user/delete', async (req, resp) => {
		const { success, user } = await getUser(req)
		if (!success)
			return user

		await AppDataSource.manager.remove(user)
		return { success: true }
	})

	fastify.put('/api/user/update', async (req, resp) => {
		const { success, user } = await getUser(req)
		if (!success)
			return user

		let name: string = ''
		let password: string = ''

		const info = JSON.parse(req.body)
		try {
			name = info.name
			password = info.password
		}
		catch (err) {
		}

		if (name !== '')
			user.name = name
		
		if (password !== '')
			user.password = await encryptText(password)

		await AppDataSource.manager.save(user)

		const newJwt = await createJWT(user)
		return { success: true, new_jwt: newJwt }
	})

	fastify.put('/api/user/update-pfp', async (req, resp) => {
		const { success, user } = await getUser(req)
		if (!success)
			return user

		try {
			const data = await req.file()

			const extension = String(data.filename).split('.')[String(data.filename).split('.').length - 1]
			const supportedExtensions = ['jpeg', 'jpg', 'png', 'webp', 'avif', 'svg', 'tiff']
			if (!supportedExtensions.includes(extension))
				return { success: false, message: 'image extension not supported'}

			const buffer = await data.toBuffer()
			sharp(buffer)
				.resize(500, 500)
				.toFile(`images/users/${user.id}.jpg`)
			
			user.profile_picture = `${user.id}.jpg`
			await AppDataSource.manager.save(user)

			return { success: true }
		}
		catch (err) {
			console.log(err)
			return { success: false, message: 'file may be too large' }
		}
	})
} 