import { mapEntity } from '../../../services/mapper'
import { CRUD } from '../../../utilities/crud'
import { ResultErr } from '../../abstractions/types/resulterr'
import { z } from 'zod'

export const AuthoritySchema = z.object({

    id: z.string().default(''),
    type: z.string().default(''),
    name: z.string().default(''),
    last_name: z.string().default(''),

    identification: z.string().default(''),
    rank: z.string().default(''),
    //idPlate: string
    phone: z.string().default(''),
    vehicles: z.string().default(''),
    details_vehicles: z.string().default(''),
})



export const ApiAuthoritySchema = z.object({

    id: z.string().default(''),
    type: z.string().default(''),
    name: z.string().default(''),
    last_name: z.string().default(''),

    identification: z.string().default(''),
    rank: z.string().default(''),
    //idPlate: string
    phone: z.string().default(''),
    vehicles: z.string().default(''),
    details_vehicles: z.string().default(''),
})


export type TAuthority = z.infer<typeof AuthoritySchema>
export type TApiAuthority = z.infer<typeof ApiAuthoritySchema>


function fromApiInternal(data: TApiAuthority): TAuthority {
    return {
        id: data.id,
        type: data.type,
        name: data.name,
        last_name: data.last_name,
        identification: data.identification,
        rank: data.rank,
        phone: data.phone,
        vehicles: data.vehicles,
        details_vehicles: data.details_vehicles,
    }
}

function toApiInternal(data: TAuthority): TApiAuthority {
    return {
        id: String(data.id),
        type: data.type,
        name: data.name,
        last_name: data.last_name,
        identification: data.identification,
        rank: data.rank,
        phone: data.phone,
        vehicles: data.vehicles,
        details_vehicles: data.details_vehicles,
    }
}


export const AuthorityFromApi = (
    data: TApiAuthority
): ResultErr<TAuthority> =>
    mapEntity<TApiAuthority, TAuthority>(
        data,
        ApiAuthoritySchema as any,
        AuthoritySchema as any,
        fromApiInternal
    )

export const AuthorityToApi = (
    data: TAuthority
): ResultErr<TApiAuthority> =>
    mapEntity<TAuthority, TApiAuthority>(
        data,
        AuthoritySchema as any,
        ApiAuthoritySchema as any,
        toApiInternal
    )

export const authorityCrud = new CRUD<TAuthority>(
    'mission/authority',
    AuthorityToApi,
    AuthorityFromApi
)









export const ApiMissionAuthorityServiceSchema = z.object({
    id: z.string().optional().default(''),
    mission_id: z.string().optional().default(''),
    service_id: z.string().optional().default(''),
    authority_id: z.string().optional().default(''),
})

export type ApiMissionAuthorityServiceType = z.infer<typeof ApiMissionAuthorityServiceSchema>
