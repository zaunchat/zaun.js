import { Base } from './Base'
import type { GroupChannel } from '.'
import type { TextBasedChannel } from './interfaces/TextBasedChannel'
import { Permissions } from '../deps'

export enum ChannelType {
	Unknown = 0,
	Direct = 1,
	Group = 2
}

export enum OverwriteType {
	Member = 0,
	Role = 1
}

export interface Overwrite {
	id: string
	type: OverwriteType
	allow: Permissions
	deny: Permissions
}

export abstract class Channel extends Base {
	type = ChannelType.Unknown

	isText(): this is this & TextBasedChannel {
		return 'messages' in this
	}

	isGroup(): this is GroupChannel {
		return this.type === ChannelType.Group
	}

	delete(): Promise<void> {
		return this.client.channels.delete(this)
	}

	toString(): string {
		return `<#${this.id}>`
	}
}
