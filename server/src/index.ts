import { fastifyStatic } from "@fastify/static"
import { AppDataSource } from "./data-source"
import { userRoutes } from "./api/UsersApi"
import { listRoutes } from "./api/ListApi"
import * as dotenv from 'dotenv'
import cors from '@fastify/cors'
import fastify from "fastify"
import path = require('path')

AppDataSource.initialize().then(async () => {

	dotenv.config()	

	const server = fastify()

	// support to receive images (used for pfp)
	server.register(require('@fastify/multipart'), {
		limits: {
			fileSize: 8000000, // 8mb
			files: 1
		}
	})

	server.register(userRoutes)
	server.register(listRoutes)
	server.register(fastifyStatic, {
		root: path.resolve(__dirname, '../images/users'),
		prefix: '/images/users'
	})

	server.register(cors, {
		origin: '*'
	})

	server.listen({ port: 8080, host: '0.0.0.0' }, (err, address) => {
		if (err) {
			console.error(err)
			process.exit(1)
		}
		console.log(`Servidor rodando em ${address}`)
	})

}).catch(error => console.log(error))
