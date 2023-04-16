import { deepMerge, EventEmitter, REST, RESTOptions } from './deps.js'
import { DEFAULT_CLIENT_OPTIONS, Events } from './Constants.js'
import type { Channel, Message, User } from './structures/index.js'
import type { Client } from './Client.js'

export interface ClientEvents {
	channelCreate: [Channel]
	channelUpdate: [Channel, Channel]
	channelDelete: [Channel]
	debug: [string]
	error: [unknown]
	messageCreate: [Message]
	messageDelete: [Message]
	messageUpdate: [Message, Message]
	raw: [unknown]
	ready: [Client]
	userUpdate: [User, User]
}

export declare interface BaseClient {
	on<K extends keyof ClientEvents>(event: K, listener: (...args: ClientEvents[K]) => Awaited<void>): this
	on<S extends string | symbol>(
		event: Exclude<S, keyof ClientEvents>,
		listener: (...args: any[]) => Awaited<void>
	): this
	once<K extends keyof ClientEvents>(event: K, listener: (...args: ClientEvents[K]) => Awaited<void>): this
	once<S extends string | symbol>(
		event: Exclude<S, keyof ClientEvents>,
		listener: (...args: any[]) => Awaited<void>
	): this
	emit<K extends keyof ClientEvents>(event: K, ...args: ClientEvents[K]): boolean
	emit<S extends string | symbol>(event: Exclude<S, keyof ClientEvents>, ...args: unknown[]): boolean
	off<K extends keyof ClientEvents>(event: K, listener: (...args: ClientEvents[K]) => Awaited<void>): this
	off<S extends string | symbol>(
		event: Exclude<S, keyof ClientEvents>,
		listener: (...args: any[]) => Awaited<void>
	): this
	removeAllListeners<K extends keyof ClientEvents>(event?: K): this
	removeAllListeners<S extends string | symbol>(event?: Exclude<S, keyof ClientEvents>): this
}

export interface ClientOptions {
	rest: RESTOptions
	ws: {
		url: string
		heartbeat: number
		reconnect: boolean
	}
}

type DeepPartial<T> = T extends object ? { [P in keyof T]?: DeepPartial<T[P]> } : T

export abstract class BaseClient extends EventEmitter {
	readonly api: REST
	readonly options: ClientOptions
	#token: string | null = null

	constructor(opts: DeepPartial<ClientOptions> = {}) {
		super()
		this.options = deepMerge(DEFAULT_CLIENT_OPTIONS, opts) as ClientOptions
		this.api = new REST(this.options.rest)
		this.api.debug = (msg) => this.emit(Events.DEBUG, `[REST]: ${msg}`)
	}

	debug(msg: unknown): void {
		this.emit(Events.DEBUG, `[MAIN]: ${msg}`)
	}

	set token(token: string | null) {
		this.#token = token
		this.api.setToken(token)
	}

	get token(): string | null {
		return this.#token
	}
}
