import { Action, Events } from './Action'
import type { APIChannel } from '../deps'

export class ChannelCreateAction extends Action {
	handle(data: APIChannel) {
		this.client.emit(Events.CHANNEL_CREATE, this.client.channels.add(data))
	}
}
