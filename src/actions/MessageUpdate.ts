import { Action, Events } from './Action.js'
import type { APIMessage } from '@itchatapp/types'

export class MessageUpdateAction extends Action {
	handle(data: APIMessage) {
		const channel = this.client.channels.cache.get(data.channel_id)

		if (!channel?.isText()) return

		const message = channel.messages.cache.get(data.id)
		const oldMessage = message?._update(data)

		if (oldMessage && message && !message.equals(oldMessage)) {
			this.client.emit(Events.MESSAGE_UPDATE, oldMessage, message)
		}
	}
}
