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
})

const FromApiInternal = (data: LocationSchemaType): LocationSchemaType => {
    return data
}

const ToApiInternal = (data: LocationSchemaType): LocationSchemaType => {
    return data
}

export const LocationFromApi = (
    data: LocationSchemaType
): ResultErr<LocationSchemaType> =>
    mapEntity<LocationSchemaType, LocationSchemaType>(
        data,
        LocationSchema as any,
        LocationSchema as any,
        FromApiInternal
    )
export const LocationToApi = (
    data: LocationSchemaType
): ResultErr<LocationSchemaType> =>
    mapEntity<LocationSchemaType, LocationSchemaType>(
        data,
        LocationSchema as any,
        LocationSchema as any,
        ToApiInternal
    )

export type LocationSchemaType = z.infer<typeof LocationSchema>


export const LocationCrud = new CRUD<LocationSchemaType>(
    'mission/vehicle',
    LocationToApi,
    LocationFromApi
)

export const LocationNameConverter: { [K in keyof LocationSchemaType]?: string } =
    {
        state : 'Estado',
        municipality: 'Municipio',
        parish: "Parroquia",
        sector: "Sector"
    }