import { BaseManager } from './BaseManager'
import { DMChannel, User } from '../structures'
import { APIUser } from '../deps'
import { TypeError } from '../errors'

export type UserResolvable = User | APIUser | string

export class UserManager extends BaseManager<User, APIUser> {
	holds = User

	async createDM(user: UserResolvable): Promise<DMChannel> {
		const id = this.resolveId(user)

		if (!id) throw new TypeError('INVALID_TYPE', 'user', 'UserResolvable')

		const data = await this.client.api.get(`/users/${id}/dm`)

		return this.client.channels.add(data) as DMChannel
	}

	fetch(): Promise<Map<string, User>>
	fetch(user: UserResolvable): Promise<User>
	async fetch(user?: UserResolvable): Promise<User | Map<string, User>> {
		if (typeof user === 'undefined') {
			const data = await this.client.api.get('/users')
			return data.reduce((cur, prev) => {
				const user = this.add(prev)
				cur.set(user.id, user)
				return cur
			}, new Map<string, User>())
		}

		const id = this.resolveId(user)

		if (!id) throw new TypeError('INVALID_TYPE', 'user', 'UserResolvable')

		const data = await this.client.api.get(`/users/${id}`)

		return this.add(data)
	}
}
