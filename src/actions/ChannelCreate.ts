import { Action, Events } from './Action.js'
import type { APIChannel } from '../deps.js'

export class ChannelCreateAction extends Action {
	handle(data: APIChannel) {
		this.client.emit(Events.CHANNEL_CREATE, this.client.channels.add(data))
	}
}
