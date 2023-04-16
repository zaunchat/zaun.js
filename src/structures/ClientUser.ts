import { User } from './User.js'

export class ClientUser extends User {
	readonly friends = new Map<string, User>()
	readonly blocked = new Map<string, User>()
}
