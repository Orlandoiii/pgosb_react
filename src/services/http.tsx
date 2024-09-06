import axios, { AxiosResponse } from 'axios'

import { LoadConfigFile } from '../ui/core/context/ConfigContext'
import { ResultErr } from '../domain/abstractions/types/resulterr'

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
): Promise<ResultErr<any>> {
    const url = `${await getBaseURL()}${endpoint}`
    const serializedData = data ? JSON.stringify(data) : ''

    logTrace(
        `Requesting: ${method} | endpoint: ${url} | data: ${serializedData}`
    )

    try {
        const response: AxiosResponse<any> = await axios({ method, url, data })

        logTrace(
            `Request result: ${method} | endpoint: ${url} | response: ${response.status} - ${JSON.stringify(response.data)}`
        )

        if (response.status === 200) {
            return { success: true, result: response.data }
        } else {
            return {
                success: false,
                error: `${response.status} - ${response.data}`,
            }
        }
    } catch (error) {
        logTrace(
            `Exception on request: ${method} | endpoint: ${url} | message: ${error.message}`
        )

        return { success: false, error: `Exception: ${error.message}` }
    }
}

export async function getAllSimple<T>(
    endpoint: string,
    fromJson?: (json: any) => ResultErr<T>
): Promise<ResultErr<T[]>> {
    const response = await requestInternal('GET', `${endpoint}/all/simple`)
    console.log('response', response)

    if (response.success) {
        if (!fromJson) return { success: true, result: response.result }
        const result: T[] = response.result.map(
            (item: any) => fromJson(item).result
        )
        return { success: true, result: result }
    } else {
        return response
    }
}

export async function getSummary<T>(endpoint: string): Promise<ResultErr<T[]>> {
    const response = await requestInternal('GET', `${endpoint}/summary`)
    console.log('response', response)

    if (response.success && response.result) {
        return { success: true, result: response.result }
    } else {
        return response
    }
}

export async function getAll<T>(
    endpoint: string,
    fromJson?: (json: any) => ResultErr<T>
): Promise<ResultErr<T[]>> {
    const response = await requestInternal('GET', `${endpoint}/all`)

    if (response.success) {
        if (!fromJson) return { success: true, result: response.result }
        const result: T[] = response.result.map(
            (item: any) => fromJson(item).result
        )
        return { success: true, result: result }
    } else {
        return response
    }
}

export async function getGroup<T>(
    endpoint: string,
    id: string,
    fromJson?: (json: any) => ResultErr<T>
): Promise<ResultErr<T[]>> {
    const response = await requestInternal('GET', `${endpoint}/group/${id}`)

    if (response.success) {
        if (!fromJson) return { success: true, result: response.result }
        const result: T[] = response.result.map(
            (item: any) => fromJson(item).result
        )
        return { success: true, result: result }
    } else {
        return response
    }
}

export async function getById<T>(
    endpoint: string,
    id: string,
    fromJson: (json: any) => ResultErr<T>
): Promise<ResultErr<T>> {
    const response = await requestInternal('GET', `${endpoint}/${id}`)

    if (response.success) {
        return fromJson(response.result)
    } else {
        return response
    }
}

export async function get<T>(
    endpoint: string,
    fromJson?: (json: any) => ResultErr<T>
): Promise<ResultErr<T>> {
    const response = await requestInternal('GET', `${endpoint}`)

    if (response.success) {
        if (fromJson) return fromJson(response.result)
        return { success: true, result: response.result }
    } else {
        return response
    }
}

export async function insert<T>(
    endpoint: string,
    data: any
): Promise<ResultErr<T>> {
    return await requestInternal('POST', `${endpoint}/create`, data)
}

export async function post<T>(
    endpoint: string,
    data: any
): Promise<ResultErr<T>> {
    return await requestInternal('POST', `${endpoint}`, data)
}

export async function update<T>(
    endpoint: string,
    data: any
): Promise<ResultErr<T>> {
    return await requestInternal('PUT', `${endpoint}/update`, data)
}

export async function remove<T>(
    endpoint: string,
    id: string
): Promise<ResultErr<T>> {
    return await requestInternal('DELETE', `${endpoint}/delete/${id}`)
}
