import type { APIRequest } from '../REST.js'

interface ResponseLike {
	status: number
}

export class HTTPError extends Error {
	method: string
	status: number
	body: APIRequest['body']
	constructor(response: ResponseLike, request: APIRequest) {
		super()
		this.method = request.method
		this.status = response.status
		this.body = request.body
	}
}
