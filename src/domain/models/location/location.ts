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
    id: z.string().optional(),
    alias: z.string().optional(),
    state_id: z.string().optional(),
    state: z.string().optional(),
    mission_id: z.string().optional(),
    municipality_id: z.string().optional(),
    municipality: z.string().optional(),
    parish_id: z.string().optional(),
    parish: z.string().optional(),
    sector_id: z.string().optional(),
    sector: z.string().optional(),
    urb_id: z.string().optional(),
    urb: z.string().optional(),
    address: z.string().optional(),
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
        ServiceLocationSchema as any,
        ServiceLocationSchema as any,
        FromApiInternal
    )
export const LocationToApi = (
    data: ServiceLocationSchemaType
): ResultErr<ServiceLocationSchemaType> =>
    mapEntity<ServiceLocationSchemaType, ServiceLocationSchemaType>(
        data,
        ServiceLocationSchema as any,
        ServiceLocationSchema as any,
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
    // id: 'Id',
    alias: 'Alias',
    state: 'Estado',
    municipality: 'Municipio',
    parish: 'Parroquia',
    sector: 'Sector',
}
