import { NotImplemented } from './errors/mod'

export interface CDNOptions {
	api: string
	cdn: string
	app: string
}

export class CDN {
	constructor(protected readonly options: CDNOptions) {}

	defaultAvatar(id: string): string {
		throw new NotImplemented('Not ready yet')
	}

	avatar(hash: string, filename: string, size = 1024): string {
		throw new NotImplemented('Not ready yet')
	}

	icon(hash: string, size = 1024): string {
		throw new NotImplemented('Not ready yet')
	}

	invite(code: string): string {
		throw new NotImplemented('Not ready yet')
	}

	banner(hash: string, size = 1024): string {
		throw new NotImplemented('Not ready yet')
	}
}
