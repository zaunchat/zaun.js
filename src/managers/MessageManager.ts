import { BaseManager } from './BaseManager.js'
import { Channel, Message } from '../structures/index.js'
import type { APIMessage } from '@zaunapp/types'
import { TypeError } from '../errors/index.js'

export type MessageResolvable = Message | APIMessage | string

export type CreateMessageOptions =
	| string
	| {
			content: string
	  }

export type EditMessageOptions = CreateMessageOptions

export class MessageManager extends BaseManager<Message, APIMessage> {
	holds = Message

	constructor(public readonly channel: Channel) {
		super(channel.client)
	}

	fetch(): Promise<Map<string, Message>>
	fetch(message: MessageResolvable): Promise<Message>
	async fetch(message?: MessageResolvable): Promise<Message | Map<string, Message>> {
		if (!message) {
			const data = await this.client.api.get(`/messages/${this.channel.id}`)

			return data.reduce((cur, prev) => {
				const msg = this.add(prev)
				cur.set(msg.id, msg)
				return cur
			}, new Map<string, Message>())
		} else {
			const id = this.resolveId(message)

			if (!id) {
				throw new TypeError('INVALID_TYPE', 'message', 'MessageResolvable')
			}

			const data = await this.client.api.get(`/messages/${this.channel.id}/${id}`)

			return this.add(data)
		}
	}

	async delete(message: MessageResolvable): Promise<void> {
		const id = this.resolveId(message)

		if (!id) {
			throw new TypeError('INVALID_TYPE', 'message', 'MessageResolvable')
		}

		await this.client.api.delete(`/messages/${this.channel.id}/${id}`)
	}

	async send(options: CreateMessageOptions): Promise<Message> {
		const data = await this.client.api.post(`/messages/${this.channel.id}`, {
			body: {
				content: typeof options === 'object' ? options.content : options
			}
		})
		return this.add(data)
	}

	async edit(message: MessageResolvable, options: EditMessageOptions): Promise<Message> {
		const id = this.resolveId(message)

		if (!id) {
			throw new TypeError('INVALID_TYPE', 'message', 'MessageResolvable')
		}

		const data = await this.client.api.patch(`/messages/${this.channel.id}/${id}`, {
			body: {
				content: typeof options === 'object' ? options.content : options
			}
		})

		return this.add(data)
	}
}
