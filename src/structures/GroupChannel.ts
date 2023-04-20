import { Channel, ChannelType, Overwrite } from './Channel.js'
import type { Client, User } from '.'
import type { TextBasedChannel } from './interfaces/mod.js'
import { CreateMessageOptions, MessageManager } from '../managers/index.js'
import { Permissions } from '../deps.js'
import type { APIChannel } from '@zaunapp/types'

type APIGroupChannel = Pick<APIChannel, 'id' | 'recipients' | 'owner_id' | 'name' | 'permissions'>

export class GroupChannel extends Channel implements TextBasedChannel {
	readonly type = ChannelType.Group
	readonly messages: MessageManager = new MessageManager(this)
	name!: string
	topic: string | null = null
	ownerId!: string
	overwrites = new Map<string, Overwrite>()
	permissions = new Permissions()
	_recipients: string[] = []

	constructor(client: Client, data: APIGroupChannel) {
		super(client)
		this._patch(data)
	}

	protected _patch(data: APIGroupChannel): this {
		super._patch(data)
		if (data.name) this.name = data.name
		if (data.owner_id) this.ownerId = data.owner_id
		if (data.recipients) this._recipients = [...data.recipients]
		if (data.permissions != null) {
			this.permissions.set(BigInt(data.permissions))
		}

		return this
	}

	get owner(): User {
		return this.client.users.cache.get(this.ownerId)!
	}

	get recipients(): Map<string, User> {
		return this._recipients.reduce((coll, cur) => {
			const user = this.client.users.cache.get(cur)
			if (user) coll.set(user.id, user)
			return coll
		}, new Map<string, User>())
	}

	send(options: CreateMessageOptions) {
		return this.messages.send(options)
	}

	toString(): string {
		return this.name
	}
}
