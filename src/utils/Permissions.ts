import { BitField } from './BitField.js'

export type PermissionString = keyof typeof Permissions.FLAGS
export type PermissionsResolvable = bigint | number | Permissions | PermissionString | PermissionsResolvable[]

export declare interface Permissions {
	serialize(): Record<PermissionString, boolean>
	any(bit: PermissionsResolvable): boolean
	add(...bits: PermissionsResolvable[]): this
	missing(bits: PermissionsResolvable): PermissionString[]
	remove(...bits: PermissionsResolvable[]): this
	has(bit: PermissionsResolvable): boolean
	toArray(): PermissionString[]
	equals(bit: PermissionsResolvable): boolean
}

export class Permissions extends BitField {
	static FLAGS = {
		VIEW_CHANNEL: 1n << 0n,
		SEND_MESSAGES: 1n << 1n,
		READ_MESSAGE_HISTORY: 1n << 2n,
		EMBED_LINKS: 1n << 3n,
		UPLOAD_FILES: 1n << 4n,
		MANAGE_SERVER: 1n << 5n,
		MANAGE_CHANNELS: 1n << 6n,
		MANAGE_MESSAGES: 1n << 7n,
		MANAGE_ROLES: 1n << 8n,
		MANAGE_INVITES: 1n << 9n,
		MANAGE_NICKNAMES: 1n << 10n,
		BAN_MEMBERS: 1n << 11n,
		KICK_MEMBERS: 1n << 12n,
		CHANGE_NICKNAME: 1n << 13n,
		INVITE_OTHERS: 1n << 14n
	} as const

	constructor(...bits: PermissionsResolvable[]) {
		super(bits)
	}
}

export const DEFAULT_PERMISSION_DM = new Permissions([
	'VIEW_CHANNEL',
	'SEND_MESSAGES',
	'EMBED_LINKS',
	'UPLOAD_FILES',
	'READ_MESSAGE_HISTORY'
]).freeze()

export const DEFAULT_PERMISSION_EVERYONE = new Permissions([
	'VIEW_CHANNEL',
	'SEND_MESSAGES',
	'EMBED_LINKS',
	'UPLOAD_FILES',
	'READ_MESSAGE_HISTORY'
]).freeze()
