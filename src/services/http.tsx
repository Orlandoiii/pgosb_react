import axios, { AxiosInstance, AxiosResponse } from 'axios'
import { LoadConfigFile } from '../ui/core/context/ConfigContext'

export type RequestResult<T> = { success: boolean; data?: T; error?: string }

function getBaseClient(): AxiosInstance {
    return axios.create()
}

async function getBaseURL(): Promise<string> {
    const config = await LoadConfigFile()
    return config.config['back_url'] + '/api/v1/'
}

function logTrace(data: string) {
    if (true) {
        console.trace(data)
    }
}

async function requestInternal(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    endpoint: string,
    data?: object
): Promise<RequestResult<any>> {
    const serializedData = data ? JSON.stringify(data) : ''

    try {
        var response: AxiosResponse<any, any>

        logTrace(
            `Requesting: ${method} | endpoint: ${(await getBaseURL()) + endpoint} | data: ${serializedData}`
        )

        if (method.toUpperCase() === 'GET')
            response = await axios.get((await getBaseURL()) + endpoint)
        else if (method.toUpperCase() === 'POST')
            response = await axios.post((await getBaseURL()) + endpoint, data)
        else if (method.toUpperCase() === 'PUT')
            response = await axios.put((await getBaseURL()) + endpoint, data)
        else if (method.toUpperCase() === 'DELETE')
            response = await axios.delete((await getBaseURL()) + endpoint)

        if (response!) {
            logTrace(
                `Request result for: ${method} | endpoint: ${(await getBaseURL()) + endpoint} | data: ${serializedData} => response: ${response.status} - ${JSON.stringify(response.data)}`
            )

            if (response.status === 200)
                return { success: true, data: response.data }
            else {
                return {
                    success: false,
                    error: `${response.status} - ${response.data}`,
                }
            }
        } else {
            logTrace(
                `Request result for: ${method} | endpoint: ${(await getBaseURL()) + endpoint} | data: ${serializedData} => response: ${JSON.stringify(response!)}`
            )
            return { success: false, data: 'No response from the request' }
        }
    } catch (error) {
        logTrace(
            `Exception on the request for: ${method} | endpoint: ${(await getBaseURL()) + endpoint} | data: ${serializedData} => message: ${error.message}`
        )

        return {
            success: false,
            error: `Exception on the request, with message: ${error.message}`,
        }
    }
}

export async function getAll<T>(
    endpoint: string,
    fromJson?: (json: any) => { success: boolean; result?: T; error?: string }
): Promise<RequestResult<T[]>> {
    const response = await requestInternal('GET', `${endpoint}/all`)

    if (response.success) {
        const result: T[] = []

        for (let i: number = 0; i < response.data.length; i++) {
            if (fromJson) {
                const parsed = fromJson(response.data[i])
                if (parsed.success) result.push(parsed.result!)
                else
                    return {
                        success: false,
                        error: `Error in parse: ${parsed.error}`,
                    }
            } else {
                result.push(response.data[i] as any)
            }
        }

        return { success: true, data: result }
    } else return response
}

export async function getById<T>(
    endpoint: string,
    id: string,
    fromJson: (json: any) => { success: boolean; result?: T; error?: string }
): Promise<{ success: boolean; data?: T; error?: string }> {
    const response = await requestInternal('GET', `${endpoint}/${id}`)

    if (response.success) {
        const parsed = fromJson(response.data)
        return {
            success: parsed.success,
            data: parsed.result,
            error: parsed.error,
        }
    } else return response
}

export async function insert<T>(
    endpoint: string,
    data: any
): Promise<{ success: boolean; data?: T; error?: string }> {
    const response = await requestInternal('POST', `${endpoint}/create`, data)

    if (response.success) {
        return { success: true, data: response.data }
    } else return response
}

export async function update(
    endpoint: string,
    data: any
): Promise<{ success: boolean; error?: string }> {
    const response = await requestInternal('PUT', `${endpoint}/update`, data)

    if (response.success) {
        return { success: true }
    } else return response
}

export async function remove(
    endpoint: string,
    id: string
): Promise<{ success: boolean; error?: string }> {
    const response = await requestInternal('DELETE', `${endpoint}/delete/${id}`)

    if (response.success) {
        return { success: true }
    } else return response
}

export class CreateCRUD<T> {
    constructor(
        endpointCompound: string,
        toJson: (data: T) => any,
        fromJson: (json: any) => RequestResult<any>
    ) {
        this.endpointCompound = endpointCompound
        this.fromJson = fromJson
        this.toJson = toJson
    }

    private readonly fromJson: (json: any) => RequestResult<T>
    private readonly toJson: (data: T) => any
    private readonly endpointCompound: string

    async getAll(): Promise<RequestResult<T[]>> {
        return getAll<T>(this.endpointCompound, this.fromJson)
    }

    async getById(id: string): Promise<RequestResult<T>> {
        return getById<T>(this.endpointCompound, id, this.fromJson)
    }

    async insert(data: T): Promise<RequestResult<T>> {
        const mapped = this.toJson(data)

        if (mapped.success) return insert(this.endpointCompound, mapped.result)
        else return { success: false, error: 'El mapeo no fue satisfactorio' }
    }

    async update(data: T): Promise<RequestResult<T>> {
        const mapped = this.toJson(data)

        if (mapped.success) return update(this.endpointCompound, mapped.result)
        else return { success: false, error: 'El mapeo no fue satisfactorio' }
    }

    async remove(id: string): Promise<RequestResult<T>> {
        return remove(this.endpointCompound, id)
    }
}
