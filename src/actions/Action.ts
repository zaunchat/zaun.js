import type { Client } from '../Client.js'

export abstract class Action {
	constructor(protected readonly client: Client) {}
	abstract handle(data: unknown): Awaited<unknown | void>
}

export { Events } from '../Constants.js'
