import type { Client } from '../Client.js'
import type { Base } from '../structures/index.js'

export abstract class BaseManager<T extends Base, R extends { id: string }> {
	readonly cache = new Map<string, T>()
	abstract readonly holds: (new (...args: any[]) => T) | null

	constructor(protected readonly client: Client) {}

	add(raw: R): T {
		if (!this.holds) throw new Error('No "holds" exists.')
		const obj = new this.holds(this.client, raw)
		this.cache.set(obj.id, obj)
		return obj
	}

	remove(id: string): void {
		this.cache.delete(id)
	}

	resolve(resolvable: T): T
	resolve(resolvable: string | R): T | null
	resolve(resolvable: string | R | T | null | void): T | null
	resolve(resolvable: string | R | T | null | void): T | null {
		const id = this.resolveId(resolvable)
		if (id) return this.cache.get(id) ?? null
		return null
	}

	resolveId(resolvable: T): string
	resolveId(resolvable: string | R): string | null
	resolveId(resolvable: string | T | R | null | void): string | null
	resolveId(resolvable: string | T | R | null | void): string | null {
		if (resolvable == null) return null
		if (typeof resolvable === 'string') return resolvable
		if (typeof resolvable === 'object' && 'id' in resolvable) {
			return resolvable.id
		}
		return null
	}

	valueOf(): this['cache'] {
		return this.cache
	}
}
