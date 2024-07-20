import axios, { AxiosInstance } from 'axios'

import { LoadConfigFile } from '../logic/Config/ConfigContext'

export type FromJsonArrayResult<T> = {
    success: boolean
    data?: T[]
    error?: string
}
export type ApiArrayResponse<T> = {
    success: boolean
    data?: T[]
    error?: string
}

export type FromJsonResult<T> = { success: boolean; data?: T; error?: string }
export type ApiResponse<T> = { success: boolean; data?: T; error?: string }

async function getBaseClient(): Promise<AxiosInstance> {
    const config = await LoadConfigFile()
    return axios.create({ baseURL: config.config['back_url'] + '/api/v1/' })
}

export async function getAll<T>(
    endpoint: string,
    fromJson: (json: any) => FromJsonResult<T>
): Promise<FromJsonArrayResult<T>> {
    const client = await getBaseClient()
    const response = await client.get(`${endpoint}/all`)

    if (response.status === 200 || !Array.isArray(response.data)) {
        const result: T[] = []

        for (const item in response.data) {
            const parsed = fromJson(item)
            if (parsed.success) result.push(parsed.data!)
            else
                return {
                    success: false,
                    error: `Status code:${response.status}, with data: ${response.data}`,
                }
        }

        return { success: true, data: result }
    } else
        return {
            success: false,
            error: `Status code:${response.status}, with data: ${response.data}`,
        }
}

export async function getById<T>(
    endpoint: string,
    id: string,
    fromJson: (json: any) => FromJsonResult<T>
): Promise<{ success: boolean; data?: T; error?: string }> {
    const client = await getBaseClient()
    const response = await client.get(`${endpoint}/${id}`)

    if (response.status === 200) {
        const parsed = fromJson(response.data)
        return parsed
    } else
        return {
            success: false,
            error: `Status code:${response.status}, with data: ${response.data}`,
        }
}

export async function insert<T>(
    endpoint: string,
    data: any
): Promise<ApiResponse<T>> {
    console.log(`esta es mi ${JSON.stringify(data)}`)
    const client = await getBaseClient()
    const response = await client.post(`${endpoint}/create`, data)

    if (response.status === 200) {
        return { success: true, data: response.data }
    } else
        return {
            success: false,
            error: `Status code:${response.status}, with data: ${response.data}`,
        }
}

export async function update(
    endpoint: string,
    id: string,
    data: any
): Promise<{ success: boolean; error?: string }> {
    const client = await getBaseClient()
    const response = await client.put(`${endpoint}/update/${id}`, data)

    if (response.status === 200) {
        return { success: true }
    } else
        return {
            success: false,
            error: `Status code:${response.status}, with data: ${response.data}`,
        }
}

export async function remove(
    endpoint: string,
    id: string
): Promise<{ success: boolean; error?: string }> {
    const client = await getBaseClient()
    const response = await client.put(`${endpoint}/delete/${id}`)

    if (response.status === 200) {
        return { success: true }
    } else
        return {
            success: false,
            error: `Status code:${response.status}, with data: ${response.data}`,
        }
}

export class CreateCRUD<T> {
    constructor(
        endpointCompound: string,
        toJson: (data: T) => any,
        fromJson: (json: any) => FromJsonResult<T>
    ) {
        this.endpointCompound = endpointCompound
        this.fromJson = fromJson
        this.toJson = toJson
    }

    private readonly fromJson: (json: any) => FromJsonResult<T>
    private readonly toJson: (data: T) => any
    private readonly endpointCompound: string

    async getAll(): Promise<ApiArrayResponse<T>> {
        return getAll<T>(this.endpointCompound, this.fromJson)
    }

    async getById(id: string): Promise<ApiResponse<T>> {
        return getById<T>(this.endpointCompound, id, this.fromJson)
    }

    async insert(data: T): Promise<ApiResponse<T>> {
        return insert(this.endpointCompound, this.toJson(data))
    }

    async update(id: string, data: T): Promise<ApiResponse<T>> {
        return update(this.endpointCompound, id, this.toJson(data))
    }

    async remove(id: string): Promise<ApiResponse<T>> {
        return remove(this.endpointCompound, id)
    }
}
