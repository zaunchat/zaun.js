import type { ClientOptions } from './BaseClient.js'

export enum WSEvents {
	AUTHENTICATE = 'Authenticate',
	AUTHENTICATED = 'Authenticated',
	CHANNEL_CREATE = 'ChannelCreate',
	CHANNEL_DELETE = 'ChannelDelete',
	CHANNEL_UPDATE = 'ChannelUpdate',
	ERROR = 'Error',
	MESSAGE_CREATE = 'Message',
	MESSAGE_DELETE = 'MessageDelete',
	MESSAGE_UPDATE = 'MessageUpdate',
	PING = 'Ping',
	PONG = 'Pong',
	READY = 'Ready',
	USER_UPDATE = 'UserUpdate'
}

export enum Events {
	CHANNEL_CREATE = 'channelCreate',
	CHANNEL_DELETE = 'channelDelete',
	CHANNEL_UPDATE = 'channelUpdate',
	DEBUG = 'debug',
	ERROR = 'error',
	MESSAGE_CREATE = 'messageCreate',
	MESSAGE_DELETE = 'messageDelete',
	MESSAGE_UPDATE = 'messageUpdate',
	RAW = 'raw',
	READY = 'ready',
	USER_UPDATE = 'userUpdate'
}

export const DEFAULT_CLIENT_OPTIONS: ClientOptions = {
	ws: {
		url: 'wss://api.itchat.world/ws',
		heartbeat: 0,
		reconnect: true
	},
	rest: {
		api: 'https://api.itchat.world',
		app: 'https://app.itchat.world',
		cdn: 'https://cdn.itchat.world',
		timeout: 15_000,
		retries: 3
	}
}
