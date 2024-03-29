import { Client } from '../Client.js'
import { BitField, Snowflake } from '../deps.js'

export abstract class Base {
	id!: string

	constructor(public readonly client: Client) {}

	protected _patch(data: { id: string }): this {
		this.id = data.id
		return this
	}

	equals(that?: this | null): boolean {
		if (!that) return false

		for (const key in that) {
			const a = that[key],
				b = this[key]
			if (a instanceof Base && !a.equals(b as typeof a)) return false
			if (a instanceof BitField && a.bitfield !== (b as unknown as BitField).bitfield) {
				return false
			}

			// TODO: Add Map checking.
			if (typeof a === 'object' && a != null) continue
			if (a !== b) return false
		}

		return true
	}

	_update(data: { id: string }): this {
		const clone = this._clone()
		this._patch(data)
		return clone
	}

	_clone(): this {
		const clone = Object.assign(Object.create(this), this)

		for (const key in clone) {
			const prop = clone[key]
			if (prop instanceof Base) clone[key] = prop._clone()
		}

		return clone
	}

	get createdTimestamp(): number {
		return Snowflake.timestampOf(this.id)
	}

	get createdAt(): Date {
		return new Date(this.createdTimestamp)
	}
}

export { Client }
