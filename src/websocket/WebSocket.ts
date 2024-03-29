import type { Client } from '../Client.js'
import { ClientUser } from '../structures/index.js'
import { Events, WSEvents } from '../Constants.js'
import { Error } from '../errors/index.js'
import WebSocket from 'isomorphic-ws'

declare function clearInterval(id: number): void
declare function setInterval(cb: (...args: any[]) => void, delay?: number, ...args: any[]): number

export class WebSocketShard {
	heartbeatInterval?: number
	lastPingTimestamp?: number
	lastPongAcked = false
	socket: WebSocket | null = null
	connected = false
	ready = false
	reconnecting: Promise<unknown> | null = null

	constructor(protected readonly client: Client) {}

	private debug(message: unknown): void {
		this.client.emit(Events.DEBUG, `[WS]: ${message}`)
	}

	async send(data: unknown): Promise<void> {
		if (this.reconnecting) {
			this.debug('Waiting reconnecting...')
			await this.reconnecting
		}

		if (this.socket?.readyState === WebSocket.OPEN) {
			this.socket.send(JSON.stringify(data))
		} else {
			this.debug(`Tried to send packet '${JSON.stringify(data)}' but no WebSocket is available!`)
		}
	}

	private onOpen(): void {
		this.debug('Socket opened')
		if (!this.client.token) throw new Error('INVALID_TOKEN')
		this.send({
			op: WSEvents.AUTHENTICATE,
			d: { token: this.client.token }
		})
	}

	get ping(): number {
		if (!this.lastPingTimestamp) return -0
		return Date.now() - this.lastPingTimestamp
	}

	setHeartbeatTimer(time: number): void {
		this.debug(`Setting a heartbeat interval for ${time}ms.`)

		if (this.heartbeatInterval) clearInterval(this.heartbeatInterval)
		if (time !== -1) {
			this.heartbeatInterval = setInterval(() => this.sendHeartbeat(), time)
		}
	}

	sendHeartbeat(): void {
		this.debug('Sending a heartbeat.')

		if (!this.lastPongAcked) {
			this.debug('Did not receive a pong ack last time.')
			if (this.client.options.ws.reconnect) {
				this.debug('Reconnecting...')
				this.reconnecting = this.destroy()
					.then(() => this.connect())
					.then(() => (this.reconnecting = null))
			}
		}

		const now = Date.now()
		this.send({ op: WSEvents.PING, d: now })
		this.lastPongAcked = false
		this.lastPingTimestamp = now
	}

	private onError(event: unknown): void {
		this.client.emit(Events.ERROR, event)
	}

	private onMessage({ data }: { data: unknown }): void {
		let packet: unknown

		try {
			packet = JSON.parse(String(data))
		} catch (err) {
			this.client.emit(Events.ERROR, err)
			return
		}

		this.client.emit(Events.RAW, packet)

		this.onPacket(packet).catch((e) => this.client.emit(Events.ERROR, e))
	}

	private onClose(event: { code: number; reason: string }): void {
		this.debug(`Closed with reason: ${event.reason}, code: ${event.code}`)
		this.destroy()
	}

	private async onPacket(packet: any) {
		if (!packet) {
			this.debug(`Received broken packet: '${packet}'.`)
			return
		}

		switch (packet.op) {
			case WSEvents.AUTHENTICATED:
				this.connected = true
				break
			case WSEvents.PONG:
				this.debug('Received a heartbeat.')
				this.lastPongAcked = true
				break
			case WSEvents.ERROR:
				this.client.emit(Events.ERROR, packet)
				break
			case WSEvents.READY: {
				const data = packet.d

				this.lastPongAcked = true

				this.client.user = new ClientUser(this.client, data.user)
				this.client.users.cache.set(this.client.user.id, this.client.user)

				for (const user of data.users) {
					this.client.users.add(user)
				}

				for (const channel of data.channels) {
					this.client.channels.add(channel)
				}

				// TODO:
				// this.setHeartbeatTimer(this.client.options.ws.heartbeat);

				this.ready = true

				this.client.emit(Events.READY, this.client)
				break
			}
			default: {
				const action = this.client.actions.get(packet.op)

				if (action) {
					await action.handle(packet.d)
				} else {
					this.debug(`Received unknown packet "${packet.op}"`)
				}

				break
			}
		}
	}

	connect(): Promise<this> {
		return new Promise((resolve, reject) => {
			if (this.socket?.readyState === WebSocket.OPEN && this.ready) {
				return resolve(this)
			}

			const ws = (this.socket = new WebSocket(this.client.options.ws.url))

			ws.onopen = this.onOpen.bind(this)
			ws.onmessage = this.onMessage.bind(this)
			ws.onerror = this.onError.bind(this)
			ws.onclose = this.onClose.bind(this)

			this.client.once('error', reject)
			ws.addEventListener('close', () => reject('Socket closed'))

			const interval = setInterval(() => {
				if (this.connected) resolve(this)
				if (!this.socket) clearInterval(interval)
			}, 100)
		})
	}

	destroy(): Promise<void> {
		return new Promise((resolve) => {
			this.setHeartbeatTimer(-1)
			this.connected = false
			this.ready = false

			if (this.socket?.readyState === WebSocket.OPEN) {
				this.socket.addEventListener('close', () => {
					this.socket = null
					resolve()
				})

				this.socket.close()
			} else {
				this.socket = null
				resolve()
			}
		})
	}
}
