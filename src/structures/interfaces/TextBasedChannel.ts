import type { CreateMessageOptions, MessageManager } from '../../managers'
import type { Message } from '..'

export interface TextBasedChannel {
	messages: MessageManager
	send(options: CreateMessageOptions): Promise<Message>
}
