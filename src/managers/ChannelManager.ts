import { BaseManager } from './BaseManager.js'
import { Channel, ChannelType, DMChannel, GroupChannel } from '../structures/index.js'
import { APIChannel } from '../deps.js'
import { TypeError } from '../errors/index.js'

export type ChannelResolvable = Channel | APIChannel | string

export interface CreateGroupOptions {
	name: string
}

export class ChannelManager extends BaseManager<Channel, APIChannel> {
	holds = null

	add(data: APIChannel): Channel {
		let channel: Channel

		switch (data.type) {
			case ChannelType.Direct:
				channel = new DMChannel(this.client, data)
				break
			case ChannelType.Group:
				channel = new GroupChannel(this.client, data)
				break
			default:
				throw new Error(`Unknown channel type: ${data.type}`)
		}

		this.cache.set(channel.id, channel)

		return channel
	}

	remove(id: string): void {
		const channel = this.cache.get(id)

		super.remove(id)
	}

	fetch(): Promise<Map<string, Channel>>
	fetch(channel: ChannelResolvable): Promise<Channel>
	async fetch(channel?: ChannelResolvable): Promise<Channel | Map<string, Channel>> {
		if (typeof channel !== 'undefined') {
			const id = this.resolveId(channel)

			if (!id) {
				throw new TypeError('INVALID_TYPE', 'channel', 'ChannelResolvable')
			}

			const data = await this.client.api.get(`/channels/${id}`)

			return this.add(data)
		}

		const data = await this.client.api.get('/channels')

		return data.reduce((cur, prev) => {
			const channel = this.add(prev)
			cur.set(channel.id, channel)
			return cur
		}, new Map<string, Channel>())
	}

	async delete(channel: ChannelResolvable): Promise<void> {
		const id = this.resolveId(channel)

		if (!id) {
			throw new TypeError('INVALID_TYPE', 'channel', 'ChannelResolvable')
		}

		await this.client.api.delete(`/channels/${id}`)
	}

	async create(options: CreateGroupOptions): Promise<GroupChannel> {
		const data = await this.client.api.post('/channels', { body: options })
		return this.add(data) as GroupChannel
	}
}
