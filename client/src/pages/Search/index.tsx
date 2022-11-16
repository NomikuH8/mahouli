import { SearchPageControls, SearchPageResultsContent, SearchPageSideContent, SearchPageStyle } from "./styles";
import { ChevronLeft, ChevronRight, Search } from "react-feather";
import { SyntheticEvent, useEffect, useState } from "react";
import { getEntrySearch } from "../../api/jikanApi";
import { useLocation } from "react-router";
import { Anime } from "../../types/Anime";
import { Manga } from "../../types/Manga";
import { AddToListButton } from "../../components/AddToListButton";


const limit = 30

export function SearchPage() {
	const [results, setResults] = useState<{ query: string, anime: Anime[], manga: Manga[] }>()
	const [loading, setLoading] = useState<boolean>(false)
	const [mode, setMode] = useState<'manga' | 'anime'>('anime')
	const [morePages, setMorePages] = useState<{anime: boolean, manga: boolean}>()
	const [page, setPage] = useState<number>(1)
	let state = useLocation().state as string

	useEffect(() => {
		const query = document.querySelector<HTMLInputElement>('#PageSearchBar')?.value
		if (state && state === query) {
			search(state)
			state = ''
			return
		}

		if (query)
			search(query)
	}, [page])

	const search = (query: string) => {
		getEntrySearch(query, limit, page, true, setResults).then((data) => {
			setMorePages({
				anime: data.pagAnime,
				manga: data.pagManga
			})
		})
	}

	const handleSubmit = (e: SyntheticEvent) => {
		e.preventDefault()

		const query = document.querySelector<HTMLInputElement>('#PageSearchBar')?.value
		setPage(1)
		if (query)
			search(query)
	}

	return (
		<SearchPageStyle>
			<form onSubmit={handleSubmit}>
				<input
					type="text"
					defaultValue={state ? state : ''}
					id="PageSearchBar" />
				<button type="submit"><Search /></button>
			</form>
			<div>
				<span>Buscar por</span>
				<button
					onClick={() => setMode('anime')}
					className={mode === 'anime' ? 'selected-mode' : ''}
				>Animes</button>
				<button
					onClick={() => setMode('manga')}
					className={mode === 'manga' ? 'selected-mode' : ''}
				>Mangás</button>
			</div>
			<SearchPageResultsContent>
					<SearchPageSideContent>
						<table>
							<thead>
								<tr>
									{mode === 'anime' ?
									<>
									<th></th>
									<th>Título</th>
									<th>Ano de Lançamento</th>
									<th>Episódios</th>
									<th>Status</th>
									<th></th>
									</>
									:
									<>
									<th></th>
									<th>Título</th>
									<th>Capítulos</th>
									<th>Status</th>
									<th></th>
									</>
									}
								</tr>
							</thead>
							<tbody>
								{mode === 'anime' ? results?.anime.map((val: Anime, idx) => <tr key={idx+'anime'}>
									<td className="image"><img src={val.images.jpg.small_image_url} /></td>
									<td>{val.title}</td>
									<td className="ano">{val.year}</td>
									<td className="status">{val.episodes}</td>
									<td className="status">{val.airing ? 'Em produção' : 'Terminado'}</td>
									<td><AddToListButton entry={val} isAnime={mode} seeButton /></td>
								</tr>) : <></>}
								{mode === 'manga' ? results?.manga.map((val: Manga, idx) => <tr key={idx+'manga'}>
									<td className="image"><img src={val.images.jpg.small_image_url} /></td>
									<td>{val.title}</td>
									<td className="ano">{val.chapters}</td>
									<td className="status">{val.status === '' ? 'Em produção' : 'Terminado'}</td>
									<td><AddToListButton entry={val} isAnime={mode} seeButton /></td>
								</tr>) : <></>}
							</tbody>
						</table>
					</SearchPageSideContent>
			</SearchPageResultsContent>
			<SearchPageControls>
				<button
					disabled={page <= 1}
					onClick={() => {
						setPage(page - 1)
						window.scrollTo(0, 0)
					}}>
					<ChevronLeft />
				</button>
				<button
					disabled={mode === 'anime' ? !morePages?.anime : !morePages?.manga}
					onClick={() => {
						setPage(page + 1)
						window.scrollTo(0, 0)
					}}>
					<ChevronRight />
				</button>
			</SearchPageControls>
		</SearchPageStyle>
	)
}