import { Client, User } from '.'
import { Channel, ChannelType } from './Channel.js'
import { TextBasedChannel } from './interfaces/mod.js'
import { CreateMessageOptions, MessageManager } from '../managers/index.js'
import { APIChannel } from '../deps.js'

type APIDMChannel = Pick<APIChannel, 'id' | 'recipients'>

export class DMChannel extends Channel implements TextBasedChannel {
	readonly type = ChannelType.Direct
	readonly messages: MessageManager = new MessageManager(this)
	recipientId!: string

	constructor(client: Client, data: APIDMChannel) {
		super(client)
		this._patch(data)
	}

	protected _patch(data: APIDMChannel): this {
		super._patch(data)
		if (data.recipients?.length) {
			this.recipientId = data.recipients.find((id) => id !== this.client.user!.id)!
		}
		return this
	}

	get recipient(): User {
		return this.client.users.cache.get(this.recipientId)!
	}

	send(options: CreateMessageOptions) {
		return this.messages.send(options)
	}
}
