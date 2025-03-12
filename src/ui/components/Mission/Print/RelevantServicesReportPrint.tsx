import React, { useEffect, useState } from 'react'

import { PrintLayout } from './PrintLayout'
import { post } from '../../../../services/http'
import { modalService } from '../../../core/overlay/overlay_service'

interface ServicePrintProps {
    missionsIds: string[]
    filters: { name: string; value: string }[]
}

interface RegionReport {
    region_id: string
    region_name: string
    stations: StationReport[]
}

interface StationReport {
    station_id: string
    station_name: string
    station_short_name: string
    missions: MissionReport[]
}

interface MissionReport {
    id: string
    date: string
    code: string
    level: string
    is_important: boolean
    peace_quadrant: string
    description: string
    operative_areas: string[]
    unharmed: string
    injured: string
    transported: string
    deceased: string
    units: string[]
    firefighters: FirefightersReport[]
    first_service_id: string
    first_service_antares_description: string
    origin_location: LocationReport
    destination_location: LocationReport
    carecenter_location: LocationReport
    people: PersonReport[]
    vehicles: VehicleReport[]
    infrastructures: InfrastructureReport[]
}

interface FirefightersReport {
    name: string
    rank: string
    document_id: string
    role: string
    team: string
}
interface LocationReport {
    state: string
    municipality: string
    parish: string
    sector: string
    urbanization: string
    address: string
}

interface PersonReport {
    person_state: string
    condition: string
    name: string
    gender: string
    age: string
    document_id: string
    phone: string
    transfer_vehicle: string
}

interface VehicleReport {
    brand: string
    model: string
    plate: string
    year: string
    color: string
}

interface InfrastructureReport {
    type: string
    occupation: string
    levels: string
}

export function RelevantServicesReportPrint({
    missionsIds: servicesIds,
    filters,
}: ServicePrintProps) {
    const [relevantServices, setRelevantServices] = useState<RegionReport[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        updateRelevantServices()
    }, [])

    async function updateRelevantServices() {
        try {
            setLoading(true)
            const result = await post<{ regions: RegionReport[] }>(
                `mission-reports/hierarchical/in`,
                servicesIds
            )

            if (result.success && result.result) {
                setRelevantServices(result.result.regions)
            } else
                modalService.toastError(
                    'No se pudo cargar la data de los servicios relevantes'
                )
        } finally {
            setLoading(false)
        }
    }
    console.log(
        'relevantServices',
        relevantServices,
        relevantServices?.length > 0
    )

    return (
        <div id={'PrintThis'} className="h-full w-full">
            <PrintLayout
                loading={loading}
                title={'INFORME DE SERVICIOS POR REGIONES OPERATIVAS'}
                subtitle={new Date().toLocaleString('en-GB', {
                    timeZone: 'UTC',
                    hour12: false,
                })}
                filters={filters}
            >
                <div className="text-sm">
                    {relevantServices &&
                        relevantServices.length > 0 &&
                        relevantServices.map(
                            (region) =>
                                region && (
                                    <div className="pb-16">
                                        <div className="font-bold text-2xl w-full text-center pb-6">
                                            {region.region_name}
                                        </div>

                                        {region.stations.map((station) => (
                                            <>
                                                <div className="w-full text-lg flex items-center justify-center pb-4">
                                                    <span className="pt-6 font-semibold text-[#1C2434]">
                                                        <span>
                                                            ESTACIÓN N°
                                                            {station?.station_short_name?.replace(
                                                                'M',
                                                                ''
                                                            )}{' '}
                                                            :{' '}
                                                            {
                                                                station?.station_short_name
                                                            }
                                                        </span>{' '}
                                                        ({' '}
                                                        {station?.station_name?.toUpperCase()}{' '}
                                                        )
                                                    </span>
                                                </div>
                                                {station?.missions?.map(
                                                    (mission, index) => (
                                                        <>
                                                            {index != 0 && (
                                                                <div className="py-6 px-4 opacity-50">
                                                                    <div className="w-full h-0.5 bg-[#1C2434] rounded-full"></div>
                                                                </div>
                                                            )}

                                                            <div className="flex justify-between">
                                                                <div>
                                                                    <span>
                                                                        FECHA:
                                                                    </span>
                                                                    <span className="font-semibold">
                                                                        {mission?.date?.split(
                                                                            'T'
                                                                        )[0] ??
                                                                            ''}
                                                                    </span>
                                                                </div>

                                                                <div>
                                                                    <span>
                                                                        HORA:
                                                                    </span>
                                                                    <span className="font-semibold">
                                                                        {mission?.date
                                                                            ?.split(
                                                                                'T'
                                                                            )[1]
                                                                            .replace(
                                                                                'Z',
                                                                                ''
                                                                            ) ??
                                                                            ''}
                                                                    </span>
                                                                </div>

                                                                <div>
                                                                    <span>
                                                                        CÓDIGO:
                                                                    </span>
                                                                    <span className="font-semibold">
                                                                        {
                                                                            mission?.code?.split(
                                                                                '-'
                                                                            )[0]
                                                                        }
                                                                    </span>
                                                                </div>

                                                                <div>
                                                                    <span>
                                                                        NIVEL:
                                                                    </span>
                                                                    <span className="font-semibold">
                                                                        {
                                                                            mission?.level
                                                                        }
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            <div className="flex w-full justify-between">
                                                                <div className="pt-2">
                                                                    <span className="font-semibold text-base">
                                                                        {' '}
                                                                        {
                                                                            mission?.first_service_id
                                                                        }{' '}
                                                                        -{' '}
                                                                        {
                                                                            mission?.first_service_antares_description
                                                                        }{' '}
                                                                        {mission.is_important
                                                                            ? '( RELEVANTE )'
                                                                            : ''}
                                                                    </span>
                                                                </div>

                                                                <div className="flex pt-2">
                                                                    <span>
                                                                        CUADRANTE
                                                                        DE PAZ:
                                                                    </span>
                                                                    <span className="font-semibold">
                                                                        {
                                                                            mission?.peace_quadrant
                                                                        }
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            <div>
                                                                <p className="pt-2">
                                                                    <span className="font-semibold pr-2">
                                                                        DIRECCIÓN
                                                                        DE
                                                                        ORIGEN:
                                                                    </span>
                                                                    <span className="text-xs">
                                                                        {mission
                                                                            ?.origin_location[0]
                                                                            ?.state && (
                                                                            <span className="font-semibold pl-2">
                                                                                ESTADO:{' '}
                                                                                <span className="font-normal pl-1">
                                                                                    {`${mission?.origin_location[0]?.state}`}

                                                                                    `
                                                                                </span>
                                                                            </span>
                                                                        )}
                                                                        {mission
                                                                            ?.origin_location
                                                                            ?.municipality && (
                                                                            <span className="font-semibold pl-2">
                                                                                MUNICIPIO:{' '}
                                                                                <span className="font-normal pl-1">{`${mission?.origin_location?.municipality},`}</span>
                                                                            </span>
                                                                        )}
                                                                        {mission
                                                                            ?.origin_location
                                                                            ?.parish && (
                                                                            <span className="font-semibold pl-2">
                                                                                PARROQUIA:{' '}
                                                                                <span className="font-normal pl-1">{`${mission?.origin_location?.parish},`}</span>
                                                                            </span>
                                                                        )}
                                                                        {mission
                                                                            ?.origin_location
                                                                            ?.sector && (
                                                                            <span className="font-semibold pl-2">
                                                                                SECTOR:{' '}
                                                                                <span className="font-normal pl-1">{`${mission?.origin_location?.sector},`}</span>
                                                                            </span>
                                                                        )}
                                                                        {mission
                                                                            ?.origin_location
                                                                            ?.urbanization && (
                                                                            <span className="font-semibold pl-2">
                                                                                URBANIZACIÓN:{' '}
                                                                                <span className="font-normal pl-1">{`${mission?.origin_location?.urbanization},`}</span>
                                                                            </span>
                                                                        )}

                                                                        {mission
                                                                            ?.origin_location
                                                                            ?.address && (
                                                                            <span className="font-semibold pl-2">
                                                                                Dirección:{' '}
                                                                                <span className="font-normal pl-1">{`${mission?.origin_location?.address},`}</span>
                                                                            </span>
                                                                        )}
                                                                    </span>
                                                                </p>

                                                                <p className="pt-2">
                                                                    <span className="font-semibold pr-2">
                                                                        DIRECCIÓN
                                                                        DE
                                                                        DESTINO:
                                                                    </span>
                                                                    <span className="text-xs">
                                                                        {mission
                                                                            ?.destination_location
                                                                            ?.state && (
                                                                            <span className="font-semibold pl-2">
                                                                                ESTADO:{' '}
                                                                                <span className="font-normal pl-1">
                                                                                    {`${mission?.destination_location?.state}`}

                                                                                    `
                                                                                </span>
                                                                            </span>
                                                                        )}
                                                                        {mission
                                                                            ?.destination_location
                                                                            ?.municipality && (
                                                                            <span className="font-semibold pl-2">
                                                                                MUNICIPIO:{' '}
                                                                                <span className="font-normal pl-1">{`${mission?.destination_location?.municipality},`}</span>
                                                                            </span>
                                                                        )}
                                                                        {mission
                                                                            ?.destination_location
                                                                            ?.parish && (
                                                                            <span className="font-semibold pl-2">
                                                                                PARROQUIA:{' '}
                                                                                <span className="font-normal pl-1">{`${mission?.destination_location?.parish},`}</span>
                                                                            </span>
                                                                        )}
                                                                        {mission
                                                                            ?.destination_location
                                                                            ?.sector && (
                                                                            <span className="font-semibold pl-2">
                                                                                SECTOR:{' '}
                                                                                <span className="font-normal pl-1">{`${mission?.destination_location?.sector},`}</span>
                                                                            </span>
                                                                        )}
                                                                        {mission
                                                                            ?.destination_location
                                                                            ?.urbanization && (
                                                                            <span className="font-semibold pl-2">
                                                                                URBANIZACIÓN:{' '}
                                                                                <span className="font-normal pl-1">{`${mission?.destination_location?.urbanization},`}</span>
                                                                            </span>
                                                                        )}

                                                                        {mission
                                                                            ?.destination_location
                                                                            ?.address && (
                                                                            <span className="font-semibold pl-2">
                                                                                Dirección:{' '}
                                                                                <span className="font-normal pl-1">{`${mission?.destination_location?.address},`}</span>
                                                                            </span>
                                                                        )}
                                                                    </span>
                                                                </p>

                                                                {mission
                                                                    ?.carecenter_location?.[0] && (
                                                                    <p className="pt-2">
                                                                        <span className="font-semibold pr-2">
                                                                            DIRECCIÓN
                                                                            DEL
                                                                            CENTRO
                                                                            DE
                                                                            ATENCIÓN:
                                                                        </span>
                                                                        <span className="text-xs">
                                                                            {mission
                                                                                .carecenter_location
                                                                                ?.state && (
                                                                                <span className="font-semibold pl-2">
                                                                                    ESTADO:{' '}
                                                                                    <span className="font-normal pl-1">
                                                                                        {`${mission.carecenter_location?.state}`}

                                                                                        `
                                                                                    </span>
                                                                                </span>
                                                                            )}
                                                                            {mission
                                                                                .carecenter_location
                                                                                ?.municipality && (
                                                                                <span className="font-semibold pl-2">
                                                                                    MUNICIPIO:{' '}
                                                                                    <span className="font-normal pl-1">{`${mission.carecenter_location?.municipality},`}</span>
                                                                                </span>
                                                                            )}
                                                                            {mission
                                                                                .carecenter_location
                                                                                ?.parish && (
                                                                                <span className="font-semibold pl-2">
                                                                                    PARROQUIA:{' '}
                                                                                    <span className="font-normal pl-1">{`${mission.carecenter_location?.parish},`}</span>
                                                                                </span>
                                                                            )}
                                                                            {mission
                                                                                .carecenter_location
                                                                                ?.sector && (
                                                                                <span className="font-semibold pl-2">
                                                                                    SECTOR:{' '}
                                                                                    <span className="font-normal pl-1">{`${mission.carecenter_location?.sector},`}</span>
                                                                                </span>
                                                                            )}
                                                                            {mission
                                                                                .carecenter_location
                                                                                ?.urbanization && (
                                                                                <span className="font-semibold pl-2">
                                                                                    URBANIZACIÓN:{' '}
                                                                                    <span className="font-normal pl-1">{`${mission.carecenter_location?.urbanization},`}</span>
                                                                                </span>
                                                                            )}
                                                                            {mission
                                                                                .carecenter_location
                                                                                ?.address && (
                                                                                <span className="font-semibold pl-2">
                                                                                    Dirección:{' '}
                                                                                    <span className="font-normal pl-1">{`${mission.carecenter_location?.address},`}</span>
                                                                                </span>
                                                                            )}
                                                                        </span>
                                                                    </p>
                                                                )}

                                                                {mission?.description && (
                                                                    <p className="pt-2">
                                                                        <span className="font-semibold pr-1">
                                                                            Nota:
                                                                        </span>
                                                                        {
                                                                            mission?.description
                                                                        }
                                                                    </p>
                                                                )}
                                                            </div>

                                                            {mission.people
                                                                .length > 0 && (
                                                                <div className="pt-6">
                                                                    <span className="text-base font-semibold">
                                                                        PERSONAS:
                                                                    </span>

                                                                    <div className="pl-8">
                                                                        {mission.people.map(
                                                                            (
                                                                                person
                                                                            ) => (
                                                                                <div>
                                                                                    <span className="pl-2">
                                                                                        <span className="font-semibold pr-1">
                                                                                            ESTADO:{' '}
                                                                                        </span>{' '}
                                                                                        {`${person.condition},`}
                                                                                    </span>
                                                                                    <span className="pl-2">
                                                                                        <span className="font-semibold pr-1">
                                                                                            CONDICIÓN:{' '}
                                                                                        </span>{' '}
                                                                                        {`${person.condition},`}
                                                                                    </span>
                                                                                    <span className="pl-2">
                                                                                        <span className="font-semibold pr-1">
                                                                                            NOMBRE:{' '}
                                                                                        </span>{' '}
                                                                                        {`${person.name},`}
                                                                                    </span>
                                                                                    <span className="pl-2">
                                                                                        <span className="font-semibold pr-1">
                                                                                            GÉNERO:{' '}
                                                                                        </span>{' '}
                                                                                        {`${person.gender},`}
                                                                                    </span>
                                                                                    <span className="pl-2">
                                                                                        <span className="font-semibold pr-1">
                                                                                            EDAD:{' '}
                                                                                        </span>{' '}
                                                                                        {`${person.age},`}
                                                                                    </span>
                                                                                    <span className="pl-2">
                                                                                        <span className="font-semibold pr-1">
                                                                                            CI:{' '}
                                                                                        </span>{' '}
                                                                                        {`${person.document_id},`}
                                                                                    </span>
                                                                                    <span className="pl-2">
                                                                                        <span className="font-semibold pr-1">
                                                                                            TELÉFONO:{' '}
                                                                                        </span>{' '}
                                                                                        {`${person.phone}`}
                                                                                    </span>

                                                                                    {person.transfer_vehicle && (
                                                                                        <div className="pl-8">
                                                                                            <span className="pl-2">
                                                                                                <span className="font-semibold pr-1">
                                                                                                    VEHÍCULO
                                                                                                    DE
                                                                                                    TRASLADO:{' '}
                                                                                                </span>{' '}
                                                                                                {`, ${person.transfer_vehicle},`}
                                                                                            </span>
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            )
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {mission.vehicles
                                                                .length > 0 && (
                                                                <div className="pt-6">
                                                                    <span className="text-base font-semibold">
                                                                        VEHÍCULOS:
                                                                    </span>

                                                                    <div className="pl-8">
                                                                        {mission.vehicles.map(
                                                                            (
                                                                                vehicle
                                                                            ) => (
                                                                                <div>
                                                                                    <span className="pl-2">
                                                                                        <span className="font-semibold pr-1">
                                                                                            MARCA:{' '}
                                                                                        </span>{' '}
                                                                                        {`${vehicle.brand},`}
                                                                                    </span>
                                                                                    <span className="pl-2">
                                                                                        <span className="font-semibold pr-1">
                                                                                            MODELO:{' '}
                                                                                        </span>{' '}
                                                                                        {`${vehicle.model},`}
                                                                                    </span>
                                                                                    <span className="pl-2">
                                                                                        <span className="font-semibold pr-1">
                                                                                            PLACA:{' '}
                                                                                        </span>{' '}
                                                                                        {`${vehicle.plate},`}
                                                                                    </span>
                                                                                    <span className="pl-2">
                                                                                        <span className="font-semibold pr-1">
                                                                                            AÑO:{' '}
                                                                                        </span>{' '}
                                                                                        {`${vehicle.year},`}
                                                                                    </span>
                                                                                    <span className="pl-2">
                                                                                        <span className="font-semibold pr-1">
                                                                                            COLOR:{' '}
                                                                                        </span>{' '}
                                                                                        {`${vehicle.color},`}
                                                                                    </span>
                                                                                </div>
                                                                            )
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {mission
                                                                .infrastructures
                                                                .length > 0 && (
                                                                <div className="pt-6">
                                                                    <span className="text-base font-semibold">
                                                                        INFRAESTRUCTURAS:
                                                                    </span>

                                                                    <div className="pl-8">
                                                                        {mission.infrastructures.map(
                                                                            (
                                                                                infrastructures
                                                                            ) => (
                                                                                <>
                                                                                    <span className="pl-2">
                                                                                        <span className="font-semibold pr-1">
                                                                                            TIPO:{' '}
                                                                                        </span>{' '}
                                                                                        {`${infrastructures.type},`}
                                                                                    </span>
                                                                                    <span className="pl-2">
                                                                                        <span className="font-semibold pr-1">
                                                                                            OCUPACIÓN:{' '}
                                                                                        </span>{' '}
                                                                                        {`${infrastructures.occupation},`}
                                                                                    </span>
                                                                                    <span className="pl-2">
                                                                                        <span className="font-semibold pr-1">
                                                                                            NIVELES:{' '}
                                                                                        </span>{' '}
                                                                                        {`${infrastructures.levels},`}
                                                                                    </span>
                                                                                </>
                                                                            )
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {/* {mission?.authoritiesData?.length > 0 &&
                                            <div className="pt-6">
                                                <span className="text-base font-semibold">AUTORIDADES:</span>

                                                <div className="pl-8">
                                                    {mission?.authoritiesData?.map(authority => (
                                                        <>
                                                            <div>
                                                                <span>{authority.authority_abbreviation}:</span>
                                                                <span className="font-semibold">{authority.authority_name}</span>
                                                            </div>

                                                            {authority.person.length > 0 && (
                                                                <div className="pl-8">
                                                                    <span className="text-base font-semibold">FUNCIONARIOS:</span>

                                                                    <div className="pl-2">
                                                                        {authority.person.map(person => (
                                                                            <div>
                                                                                <span className="pl-2"><span className="font-semibold pr-1">PLACA: </span> {`${person.identification_number}`}</span>
                                                                                <span className="pl-2"><span className="font-semibold pr-1">NOMBRE: </span> {`${person.name},`}</span>
                                                                                <span className="pl-2"><span className="font-semibold pr-1">GÉNERO: </span> {`${person.gender},`}</span>
                                                                                <span className="pl-2"><span className="font-semibold pr-1">CI: </span> {`${person.legal_id},`}</span>
                                                                                <span className="pl-2"><span className="font-semibold pr-1">TELÉFONO: </span> {`${person.phone},`}</span>
                                                                                <span className="pl-2"><span className="font-semibold pr-1">OBSERVACIONES: </span> {`${person.observations},`}</span>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {authority.vehicles.length > 0 && (
                                                                <div className="pl-8">
                                                                    <span className="text-base font-semibold">VEHÍCULOS:</span>

                                                                    <div className="pl-2">
                                                                        {authority.vehicles.map(vehicle => (
                                                                            <div>
                                                                                <span className="pl-2"><span className="font-semibold pr-1">TIPO: </span> {`${vehicle.type},`}</span>
                                                                                <span className="pl-2"><span className="font-semibold pr-1">MARCA: </span> {`${vehicle.make},`}</span>
                                                                                <span className="pl-2"><span className="font-semibold pr-1">MODELO: </span> {`${vehicle.model},`}</span>
                                                                                <span className="pl-2"><span className="font-semibold pr-1">PLACA: </span> {`${vehicle.plate},`}</span>
                                                                                <span className="pl-2"><span className="font-semibold pr-1">AÑO: </span> {`${vehicle.year},`}</span>
                                                                                <span className="pl-2"><span className="font-semibold pr-1">COLOR: </span> {`${vehicle.color},`}</span>
                                                                                <span className="pl-2"><span className="font-semibold pr-1">DESCRIPCIÓN: </span> {`${vehicle.description},`}</span>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </>
                                                    ))
                                                    }
                                                </div>
                                            </div>
                                        } */}

                                                            <div className="pt-5">
                                                                <span className="font-semibold">
                                                                    RESUMEN:
                                                                </span>
                                                                <span className="px-2">
                                                                    ÁREAS
                                                                    OPERATIVAS:
                                                                    <span className="font-semibold pl-1">
                                                                        {
                                                                            mission?.operative_areas?.filter(
                                                                                (
                                                                                    x
                                                                                ) =>
                                                                                    x
                                                                            )
                                                                                ?.length
                                                                        }
                                                                    </span>
                                                                </span>
                                                                <span className="px-2">
                                                                    UNIDADES:
                                                                    <span className="font-semibold pl-1">
                                                                        {
                                                                            mission?.units?.filter(
                                                                                (
                                                                                    x
                                                                                ) =>
                                                                                    x
                                                                            )
                                                                                ?.length
                                                                        }
                                                                    </span>
                                                                </span>
                                                                <span className="px-2">
                                                                    FUNCIONARIOS
                                                                    PRESENTES:
                                                                    <span className="font-semibold pl-1">
                                                                        {
                                                                            mission
                                                                                ?.firefighters
                                                                                ?.length
                                                                        }
                                                                    </span>
                                                                </span>
                                                            </div>

                                                            <div className="pt-2">
                                                                <div className="space-x-2">
                                                                    <span className="font-semibold">
                                                                        ÁREAS
                                                                        OPERATIVAS:
                                                                    </span>
                                                                    <span>
                                                                        {mission?.operative_areas?.join(
                                                                            ' , '
                                                                        )}
                                                                    </span>
                                                                </div>

                                                                <div className="space-x-2">
                                                                    <span className="font-semibold">
                                                                        UNIDADES:
                                                                    </span>
                                                                    <span>
                                                                        {mission?.units?.join(
                                                                            ' , '
                                                                        )}
                                                                    </span>
                                                                </div>

                                                                <div className="space-x-2">
                                                                    <span className="font-semibold">
                                                                        FUNCIONARIOS:
                                                                    </span>
                                                                    <span>
                                                                        {mission?.firefighters.map(
                                                                            (
                                                                                firefighter
                                                                            ) => (
                                                                                <div className="pl-8">
                                                                                    <span>
                                                                                        <span className="font-semibold pr-1">
                                                                                            RANGO:
                                                                                        </span>
                                                                                        {`${firefighter.rank},`}
                                                                                    </span>
                                                                                    <span className="pl-2">
                                                                                        <span className="font-semibold pr-1">
                                                                                            NOMBRE:
                                                                                        </span>
                                                                                        {`${firefighter.name},`}
                                                                                    </span>
                                                                                    <span className="pl-2">
                                                                                        <span className="font-semibold pr-1">
                                                                                            CI:
                                                                                        </span>
                                                                                        {`${firefighter.document_id},`}
                                                                                    </span>
                                                                                    <span className="pl-2">
                                                                                        <span className="font-semibold pr-1">
                                                                                            ROL:
                                                                                        </span>
                                                                                        {`${firefighter.role},`}
                                                                                    </span>
                                                                                    <span className="pl-2">
                                                                                        <span className="font-semibold pr-1">
                                                                                            EQUIPO:
                                                                                        </span>
                                                                                        {`${firefighter.team}`}
                                                                                    </span>
                                                                                </div>
                                                                            )
                                                                        )}
                                                                    </span>
                                                                </div>

                                                                <div className="pt-5">
                                                                    <span className="font-semibold">
                                                                        PERSONAS
                                                                        SIN
                                                                        IDENTIFICACIÓN:
                                                                    </span>
                                                                    <span className="px-2">
                                                                        ILESOS:
                                                                        <span className="font-semibold pl-1">
                                                                            {
                                                                                mission?.unharmed
                                                                            }
                                                                        </span>
                                                                    </span>
                                                                    <span className="px-2">
                                                                        HERIDOS:
                                                                        <span className="font-semibold pl-1">
                                                                            {
                                                                                mission?.injured
                                                                            }
                                                                        </span>
                                                                    </span>
                                                                    <span className="px-2">
                                                                        TRANSPORTADOS:
                                                                        <span className="font-semibold pl-1">
                                                                            {
                                                                                mission?.transported
                                                                            }
                                                                        </span>
                                                                    </span>
                                                                    <span className="px-2">
                                                                        FALLECIDOS:
                                                                        <span className="font-semibold pl-1">
                                                                            {
                                                                                mission?.deceased
                                                                            }
                                                                        </span>
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </>
                                                    )
                                                )}
                                            </>
                                        ))}
                                    </div>
                                )
                        )}
                </div>
            </PrintLayout>
        </div>
    )
}

type StationDetail = {
    abbreviation: string
    name: string
    locations: Array<{
        state?: string
        municipality?: string
        parish?: string
        sector?: string
        urb?: string
        address?: string
    }>
    services: Array<{
        id?: string
        type?: string
        antaresDescription?: string
    }>
    firefighters: Array<{
        rank?: string
        name?: string
        document?: string
        role?: string
        team?: string
    }>
    units: Array<string>
    operativeArea: Array<string>
    people: Array<{
        condition?: string
        name?: string
        gender?: string
        age?: string
        document?: string
        phone?: string
        person_condition?: string
        unit?: string
        address?: string
        building?: string
        vehicle?: string
    }>
    infrastructures: Array<{
        type?: string
        floor?: string
        occupation?: string
        levels?: string
    }>
    vehicles: Array<{
        plate?: string
        make?: string
        model?: string
        year?: string
        color?: string
        vehicle_type?: string
        motor_serial?: string
    }>
    careCenters: Array<{
        name?: string
        abbreviation?: string
        state?: string
        municipality?: string
        parish?: string
        sector?: string
        urb?: string
    }>
}

// Define the type for RelevantMissionDetail
type RelevantMissionDetail = {
    regionAreaId: string
    regionAreaName: string
    missionCode: string
    missionId: string
    missionDescription: string
    missionDate: string
    unharmed: string
    injured: string
    transported: string
    deceased: string
    isImportant: boolean
    stations: StationDetail[]
}
