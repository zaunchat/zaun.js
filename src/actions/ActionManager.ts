import * as Actions from './index.js'
import { Action as BaseAction } from './Action.js'
import type { Client } from '../Client.js'

export class ActionManager {
	#actions = new Map<string, BaseAction>()

	constructor(protected readonly client: Client) {
		for (const Action of Object.values(Actions)) {
			this.register(Action as new (client: Client) => BaseAction)
		}
	}

	register(Action: new (client: Client) => BaseAction): void {
		this.#actions.set(Action.name.replace(/Action$/, ''), new Action(this.client))
	}

	get(name: string): BaseAction | null {
		return this.#actions.get(name) ?? null
	}
}
