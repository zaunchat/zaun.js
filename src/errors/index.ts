import { Messages } from './Messages.js'

const createCustomError = (Base: ErrorConstructor) => {
	return class ItChatError<K extends keyof typeof Messages = keyof typeof Messages> extends Base {
		constructor(key: K, ...args: Parameters<(typeof Messages)[K]>) {
			const msg = Messages[key] as (...args: unknown[]) => string
			super(msg(...args))
			Base.captureStackTrace(this, ItChatError)
		}
	}
}

export const Error = createCustomError(globalThis.Error)
export const TypeError = createCustomError(globalThis.TypeError)
export const RangeError = createCustomError(globalThis.RangeError)
