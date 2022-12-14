interface Jpg {
	image_url: string;
	small_image_url: string;
	large_image_url: string;
}

interface Webp {
	image_url: string;
	small_image_url: string;
	large_image_url: string;
}

interface Image {
	jpg: Jpg;
	webp: Webp;
}

interface Trailer {
	youtube_id: string;
	url: string;
	embed_url: string;
}

interface Title {
	type: string;
	title: string;
}

interface From {
	day: number;
	month: number;
	year: number;
}

interface To {
	day: number;
	month: number;
	year: number;
}

interface Prop {
	from: From;
	to: To;
	string: string;
}

interface Aired {
	from: string;
	to: string;
	prop: Prop;
}

interface Broadcast {
	day: string;
	time: string;
	timezone: string;
	string: string;
}

interface Producer {
	mal_id: number;
	type: string;
	name: string;
	url: string;
}

interface Licensor {
	mal_id: number;
	type: string;
	name: string;
	url: string;
}

interface Studio {
	mal_id: number;
	type: string;
	name: string;
	url: string;
}

interface Genre {
	mal_id: number;
	type: string;
	name: string;
	url: string;
}

interface Explicit_genre {
	mal_id: number;
	type: string;
	name: string;
	url: string;
}

interface Theme {
	mal_id: number;
	type: string;
	name: string;
	url: string;
}

interface Demographic {
	mal_id: number;
	type: string;
	name: string;
	url: string;
}

interface Entry {
	mal_id: number;
	type: string;
	name: string;
	url: string;
}

interface Relation {
	relation: string;
	entry: Entry[];
}

interface Theme {
	openings: string[];
	endings: string[];
}

interface External {
	name: string;
	url: string;
}

interface Streaming {
	name: string;
	url: string;
}

export interface Anime {
	mal_id: number;
	url: string;
	images: Image;
	trailer: Trailer;
	approved: boolean;
	titles: Title[];
	title: string;
	title_english: string;
	title_japanese: string;
	title_synonyms: string[];
	type: string;
	source: string;
	episodes: number;
	status: string;
	airing: boolean;
	aired: Aired;
	duration: string;
	rating: string;
	score: number;
	scored_by: number;
	rank: number;
	popularity: number;
	members: number;
	favorites: number;
	synopsis: string;
	background: string;
	season: string;
	year: number;
	broadcast: Broadcast;
	producers: Producer[];
	licensors: Licensor[];
	studios: Studio[];
	genres: Genre[];
	explicit_genres: Explicit_genre[];
	themes: Theme[];
	demographics: Demographic[];
	relations: Relation[];
	theme: Theme;
	external: External[];
	streaming: Streaming[];
}

export interface AnimeRequest {
	data: Anime;
}

export interface AnimeRequestSearch {
	data: Anime[];
}