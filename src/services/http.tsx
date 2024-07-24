import axios, { AxiosInstance } from 'axios'
import { LoadConfigFile } from '../ui/core/context/ConfigContext'

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

const isDebug = true

async function getBaseClient(): Promise<AxiosInstance> {
    const config = await LoadConfigFile()
    return axios.create({ baseURL: config.config['back_url'] + '/api/v1/' })
}

export async function getAll<T>(
    endpoint: string,
    fromJson: (json: any) => FromJsonResult<T>
): Promise<FromJsonArrayResult<T>> {
    try {
        const client = await getBaseClient()
        const response = await client.get(`${endpoint}/all`)

        if (isDebug)
            console.trace(
                `Request GET / endpoint: ${endpoint}/all / response: ${response.status} - ${JSON.stringify(response.data)}`
            )

        if (response.status === 200 || !Array.isArray(response.data)) {
            const result: T[] = []

            for (const item in response.data) {
                const parsed = fromJson(item)
                if (parsed.success) result.push(parsed.data!)
                else
                    return {
                        success: false,
                        error: `Status code: ${response.status}, with data: ${response.data}`,
                    }
            }

            return { success: true, data: result }
        } else
            return {
                success: false,
                error: `Status code: ${response.status}, with data: ${response.data}`,
            }
    } catch (error) {
        if (isDebug)
            console.error(
                `Request GET / endpoint: ${endpoint}/all / with message: ${error.message}`
            )
        return {
            success: false,
            error: `Exception on the request, with message: ${error.message}`,
        }
    }
}

export async function getById<T>(
    endpoint: string,
    id: string,
    fromJson: (json: any) => FromJsonResult<T>
): Promise<{ success: boolean; data?: T; error?: string }> {
    try {
        const client = await getBaseClient()
        const response = await client.get(`${endpoint}/${id}`)

        if (isDebug)
            console.trace(
                `Request GET / endpoint: ${endpoint}/${id} / response: ${response.status} - ${JSON.stringify(response.data)}`
            )

        if (response.status === 200) {
            const parsed = fromJson(response.data)
            return parsed
        } else
            return {
                success: false,
                error: `Status code:${response.status}, with data: ${response.data}`,
            }
    } catch (error) {
        if (isDebug)
            console.error(
                `Request GET / endpoint: ${endpoint}/${id}  / with message: ${error.message}`
            )
        return {
            success: false,
            error: `Exception on the request GET / endpoint: ${endpoint}/all / with message: ${error.message}`,
        }
    }
}

export async function insert<T>(
    endpoint: string,
    data: any
): Promise<ApiResponse<T>> {
    console.log(`esta es mi ${JSON.stringify(data)}`)
    try {
        const client = await getBaseClient()
        const response = await client.post(
            `${endpoint}/create`,
            JSON.stringify(data)
        )

        if (isDebug)
            console.trace(
                `Request POST / endpoint: ${endpoint}/create / message: ${JSON.stringify(data)} / response:${response.status} - ${JSON.stringify(response.data)}`
            )

        if (response.status === 200) {
            return { success: true, data: response.data }
        } else
            return {
                success: false,
                error: `Status code:${response.status}, with data: ${response.data}`,
            }
    } catch (error) {
        if (isDebug)
            console.error(
                `Request POST / endpoint: ${endpoint}/create / message: ${JSON.stringify(data)}  / with message: ${error.message}`
            )
        return {
            success: false,
            error: `Exception on the request POST / endpoint: ${endpoint}/all / with message: ${error.message}`,
        }
    }
}

export async function update(
    endpoint: string,
    id: string,
    data: any
): Promise<{ success: boolean; error?: string }> {
    try {
        const client = await getBaseClient()
        const response = await client.put(
            `${endpoint}/update/${id}`,
            JSON.stringify(data)
        )

        if (isDebug)
            console.trace(
                `Request PUT / endpoint: ${endpoint}/update/${id} / message: ${JSON.stringify(data)} / response:${response.status} - ${JSON.stringify(response.data)}`
            )

        if (response.status === 200) {
            return { success: true }
        } else
            return {
                success: false,
                error: `Status code:${response.status}, with data: ${response.data}`,
            }
    } catch (error) {
        if (isDebug)
            console.error(
                `Request GET / endpoint: ${endpoint}/update/${id} / message: ${JSON.stringify(data)}  / with message: ${error.message}`
            )
        return {
            success: false,
            error: `Exception on the request PUT / endpoint: ${endpoint}/all / with message: ${error.message}`,
        }
    }
}

export async function remove(
    endpoint: string,
    id: string
): Promise<{ success: boolean; error?: string }> {
    const client = await getBaseClient()
    const response = await client.put(`${endpoint}/delete/${id}`)

    if (isDebug)
        console.trace(
            `Request DELETE / endpoint:${endpoint}/delete/${id} / response:${response.status} - ${JSON.stringify(response.data)}`
        )

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
        fromJson: (json: any) => FromJsonResult<any>
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
        const mapped = this.toJson(data)

        if (mapped.success) return insert(this.endpointCompound, mapped.result)
        else return { success: false, error: 'El parseo no fue satisfactorio' }
    }

    async update(id: string, data: T): Promise<ApiResponse<T>> {
        const mapped = this.toJson(data)

        if (mapped.success)
            return update(this.endpointCompound, id, mapped.result)
        else return { success: false, error: 'El parseo no fue satisfactorio' }
    }

    async remove(id: string): Promise<ApiResponse<T>> {
        return remove(this.endpointCompound, id)
    }
}
