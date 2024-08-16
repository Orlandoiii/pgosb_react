import { z } from 'zod'
import { ResultErr } from '../../abstractions/types/resulterr'
import { mapEntity } from '../../../services/mapper'
import { CRUD } from '../../../utilities/crud'

export const LocationSchema = z.object({
    state: z.string().optional(),
    municipality: z.string().optional(),
    parish: z.string().optional(),
    sector: z.string().optional(),
    community: z.string().optional(),
    street: z.string().optional(),
    beach: z.string().optional(),
    address: z.string().optional(),
    urb: z.string().optional(),
})

export const ServiceLocationSchema = z.object({
    id: z.string(),
    alias: z.string(),
    state_id: z.string(),
    state: z.string(),
    mission_id: z.string(),
    municipality_id: z.string(),
    municipality: z.string(),
    parish_id: z.string(),
    parish: z.string(),
    sector_id: z.string(),
    sector: z.string(),
    urb_id: z.string(),
    urb: z.string(),
    address: z.string(),
})

export type LocationSchemaType = z.infer<typeof LocationSchema>
export type ServiceLocationSchemaType = z.infer<typeof ServiceLocationSchema>

const FromApiInternal = (data: ServiceLocationSchemaType): ServiceLocationSchemaType => {
    return data
}

const ToApiInternal = (data: ServiceLocationSchemaType): ServiceLocationSchemaType => {
    return data
}

export const LocationFromApi = (
    data: ServiceLocationSchemaType
): ResultErr<ServiceLocationSchemaType> =>
    mapEntity<ServiceLocationSchemaType, ServiceLocationSchemaType>(
        data,
        LocationSchema as any,
        LocationSchema as any,
        FromApiInternal
    )
export const LocationToApi = (
    data: ServiceLocationSchemaType
): ResultErr<ServiceLocationSchemaType> =>
    mapEntity<ServiceLocationSchemaType, ServiceLocationSchemaType>(
        data,
        LocationSchema as any,
        LocationSchema as any,
        ToApiInternal
    )



export const LocationCrud = new CRUD<ServiceLocationSchemaType>(
    'mission/location',
    LocationToApi,
    LocationFromApi
)

export const LocationNameConverter: {
    [K in keyof ServiceLocationSchemaType]?: string
} = {
    id: 'Id',
    alias: 'Alias',
    state: 'Estado',
    municipality: 'Municipio',
    parish: 'Parroquia',
    sector: 'Sector',
}
