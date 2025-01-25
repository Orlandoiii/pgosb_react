import { useEffect, useState } from "react"
import { ServiceFromApi, TService, TServiceSummary } from "../../../../domain/models/service/service"
import { useCollection } from "../../../core/hooks/useCollection"
import { getAll, getById, getGroup, getSummary } from "../../../../services/http"
import { StationSchemaBasicDataType } from "../../../../domain/models/stations/station"
import { AntaresFromApi } from "../../../../domain/models/antares/antares"
import React from "react"
import { LocationFromApi, ServiceLocationSchemaType } from "../../../../domain/models/location/location"
import Overlay from "../../../core/overlay/overlay"
import { MissionServiceFromApi, MissionServiceFront } from "../../../../domain/models/mission/service/mission_service"
import { useStationCollection } from "../../../../domain/models/mission/station/use_collection"
import { useAntaresCollection } from "../../../../domain/models/mission/antares/use_collection"
import { useMissionServiceActions } from "../../../../domain/models/mission/service/use_collection"
import { MissionFromApi, MissionFront } from "../../../../domain/models/mission/mission"

function getServiceData(services: MissionServiceFront[]): {
    antaresSummary: AnteresSummary[]
    stationsSummary: StationsSummary[]
    antaresDetail: AntaresDetail[]
    stationsDetail: StationsDetail[]
} {

    services = services.sort((a, b) => (a.id as any) - (b.id as any))

    const antaresSummary = groupByAntaresId(services)
    const stationsSummary = groupServicesByStation(services)

    const antaresDetail = detailByAntares(services)
    const stationsDetail = detailByStation(services)

    return { antaresSummary, stationsSummary, antaresDetail, stationsDetail }
}

type AnteresSummary = { antaresId: string; count: number, percentage: string }
function groupByAntaresId(services: MissionServiceFront[]): AnteresSummary[] {
    let antares: AnteresSummary[] = []
    let missions: string[] = []

    services.forEach((service) => {
        const already = missions.filter(x => x == service.missionId).length > 0

        if (!already) {
            missions.push(service.missionId)

            const antaresId = service.antaresId
            const antaresItem = antares.find((item) => item.antaresId === antaresId)

            if (antaresItem) {
                antaresItem.count++
            } else if (antaresId) {
                antares.push({ antaresId, count: 1, percentage: "0" })
            }
        }
    })

    antares.forEach(antares => {
        antares.percentage = ((antares.count / missions.length) * 100).toFixed(2)
    })

    antares = antares.sort((a, b) => b.count - a.count)

    return antares
}

type StationsSummary = { stationId: string; count: number, percentage: string }
function groupServicesByStation(services: MissionServiceFront[]): StationsSummary[] {
    let stations: StationsSummary[] = []

    services.forEach((service) => {
        const stationId = service.stationId
        const stationItem = stations.find(
            (item) => item.stationId === stationId
        )

        if (stationItem) {
            stationItem.count++
        } else if (stationId) {
            stations.push({ stationId, count: 1, percentage: "0" })
        }
    })

    stations.forEach(station => {
        station.percentage = ((station.count / services.length) * 100).toFixed(2)
    })

    stations = stations.sort((a, b) => b.count - a.count)

    return stations
}

type AntaresDetail = {
    antaresId: string
    details: {
        stationId: string
        services: number
        unharmed: number
        injured: number
        transported: number
        deceased: number
        percentage: string
    }[],
    summatory: {
        services: number
        unharmed: number
        injured: number
        transported: number
        deceased: number
        percentage: string
    }
}
function detailByAntares(services: MissionServiceFront[]): AntaresDetail[] {
    let antaresDetail: AntaresDetail[] = []
    let servicesCount: number = 0
    let missions: string[] = []

    services.forEach((service) => {
        const already = missions.filter(x => x == service.missionId).length > 0
        console.log(service.missionId, service.id, already,);
        if (!already) {
            missions.push(service.missionId)

            const antaresId = service.antaresId
            const stationId = service.stationId
            const antaresItem = antaresDetail.find(
                (item) => item.antaresId === antaresId
            )

            if (antaresItem) {
                const stationItem = antaresItem.details.find(
                    (item) => item.stationId === stationId
                )
                if (stationItem) {
                    stationItem.services++
                    stationItem.unharmed += Number(service.unharmed)
                    stationItem.injured += Number(service.injured)
                    stationItem.transported += Number(service.transported)
                    stationItem.deceased += Number(service.deceased)
                } else if (stationId) {
                    antaresItem.details.push({
                        stationId,
                        services: 1,
                        unharmed: Number(service.unharmed),
                        injured: Number(service.injured),
                        transported: Number(service.transported),
                        deceased: Number(service.deceased),
                        percentage: "0",
                    })
                }
            } else if (antaresId && stationId) {
                antaresDetail.push({
                    antaresId,
                    details: [
                        {
                            stationId,
                            services: 1,
                            unharmed: Number(service.unharmed),
                            injured: Number(service.injured),
                            transported: Number(service.transported),
                            deceased: Number(service.deceased),
                            percentage: "0",
                        },
                    ],
                    summatory: {
                        services: 0,
                        unharmed: 0,
                        injured: 0,
                        transported: 0,
                        deceased: 0,
                        percentage: "0",
                    },
                })
            }

            servicesCount++
        }
    })

    antaresDetail.forEach((antaresDetail) => {
        antaresDetail.details.forEach((detail) => {
            detail.percentage = ((detail.services / servicesCount) * 100).toFixed(2)

            antaresDetail.summatory.services += detail.services
            antaresDetail.summatory.unharmed += detail.unharmed
            antaresDetail.summatory.injured += detail.injured
            antaresDetail.summatory.transported += detail.transported
            antaresDetail.summatory.deceased += detail.deceased

            antaresDetail.summatory.percentage = Number((Number(antaresDetail.summatory.percentage) + Number(detail.percentage)).toString()).toFixed(2)
        })

        antaresDetail.details = antaresDetail.details.sort((a, b) => b.services - a.services)
    })

    antaresDetail = antaresDetail.sort((a, b) => b.summatory.services - a.summatory.services)

    console.log("detail", antaresDetail, missions);

    return antaresDetail
}

type StationsDetail = {
    stationId: string
    details: {
        antaresId: string
        services: number
        unharmed: number
        injured: number
        transported: number
        deceased: number
        percentage: string
    }[],
    summatory: {
        services: number
        unharmed: number
        injured: number
        transported: number
        deceased: number
        percentage: string
    }
}
function detailByStation(services: MissionServiceFront[]): StationsDetail[] {
    let stationDetail: StationsDetail[] = []
    let missions: string[] = []
    let servicesCount = 0

    services.forEach((service) => {
        const already = missions.filter(x => x === service.missionId).length > 0

        if (!already) {
            missions.push(service.missionId)

            const antaresId = service.antaresId
            const stationId = service.stationId
            const stationItem = stationDetail.find(
                (item) => item.stationId === stationId
            )

            if (stationItem) {
                const antaresItem = stationItem.details.find(
                    (item) => item.antaresId === antaresId
                )
                if (antaresItem) {
                    antaresItem.services++
                    antaresItem.unharmed += Number(service.unharmed)
                    antaresItem.injured += Number(service.injured)
                    antaresItem.transported += Number(service.transported)
                    antaresItem.deceased += Number(service.deceased)
                } else if (antaresId) {
                    stationItem.details.push({
                        antaresId,
                        services: 1,
                        unharmed: Number(service.unharmed),
                        injured: Number(service.injured),
                        transported: Number(service.transported),
                        deceased: Number(service.deceased),
                        percentage: "0",
                    })
                }
            } else if (stationId && antaresId) {
                stationDetail.push({
                    stationId,
                    details: [
                        {
                            antaresId,
                            services: 1,
                            unharmed: Number(service.unharmed),
                            injured: Number(service.injured),
                            transported: Number(service.transported),
                            deceased: Number(service.deceased),
                            percentage: "0",
                        },
                    ],
                    summatory: {
                        services: 0,
                        unharmed: 0,
                        injured: 0,
                        transported: 0,
                        deceased: 0,
                        percentage: "0",
                    },
                })
            }

            servicesCount++
        }
    })

    stationDetail.forEach((stationItem) => {
        stationItem.details.forEach((detail) => {
            detail.percentage = ((detail.services / servicesCount) * 100).toFixed(2)

            stationItem.summatory.services += detail.services
            stationItem.summatory.unharmed += detail.unharmed
            stationItem.summatory.injured += detail.injured
            stationItem.summatory.transported += detail.transported
            stationItem.summatory.deceased += detail.deceased

            stationItem.summatory.percentage = Number((Number(stationItem.summatory.percentage) + Number(detail.percentage)).toString()).toFixed(2)
        })

        stationItem.details = stationItem.details.sort((a, b) => b.services - a.services)
    })

    stationDetail = stationDetail.sort((a, b) => b.summatory.services - a.summatory.services)

    return stationDetail
}

interface NewsSummaryPrintProps {
    missionsIds: string[]
    filters: { name: string, value: string }[]
}

export function NewsSummaryPrint({ missionsIds: servicesIds, filters }: NewsSummaryPrintProps) {
    const serviceActions = useMissionServiceActions();

    const [stationCollection] = useStationCollection();
    const [antaresCollection] = useAntaresCollection();

    const [services, setServices] = useState<NewsSummary[]>([])
    const [servicesByAntares, setServicesByAntares] = useState<{ antaresId: string, antaresDescription: string, count: number }[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        getServices(servicesIds)
    }, [])

    async function getServices(servicesIds: string[]) {

        console.log("called for", servicesIds.length);


        try {
            setLoading(true)
            const servicesList: NewsSummary[] = await getServicesList()
            let ServicesByAntares = getServicesByAntares(servicesList)
            ServicesByAntares = ServicesByAntares.sort((a, b) => b.count - a.count)
            setServices(servicesList)

            setServicesByAntares(ServicesByAntares)

        }
        catch (error) {
            console.log(error);

        }
        finally {
            setLoading(false)
        }
    }

    type NewsSummary = MissionFront & {
        stationDescription: string;
        serviceLocation: string;
        antares_id: string;
    }

    async function getServicesList(): Promise<NewsSummary[]> {

        const servicesList: NewsSummary[] = []
        const missionSummaryRequest = await await getAll<MissionFront>("mission", MissionFromApi)

        let serviceLocations: ServiceLocationSchemaType[] = []
        let locationsSet = false;

        if (missionSummaryRequest.success && missionSummaryRequest.result) {

            for (const serviceId of servicesIds) {
                const missionSummary = missionSummaryRequest.result.filter(x => x.id == serviceId)[0]
                if (!locationsSet) {
                    serviceLocations = (await getAll<ServiceLocationSchemaType>('mission/location', LocationFromApi)).result ?? []
                    locationsSet = true
                }
                if (missionSummary) {
                    const servicesRequest = await getById<MissionServiceFront>("mission", serviceId, MissionServiceFromApi)

                    const serviceLocation = serviceLocations?.filter(x => x.id == servicesRequest.result?.locationId)[0]

                    let a = `${serviceLocation?.address ? `${serviceLocation.address}, ` : ''}${serviceLocation?.urb ? `URBANIZACIÓN: ${serviceLocation.urb}, ` : ''}${serviceLocation?.sector ? `SECTOR: ${serviceLocation.sector}, ` : ''}${serviceLocation?.parish ? `PARROQUIA: ${serviceLocation.parish}, ` : ''}${serviceLocation?.municipality ? `MUNICIPIO: ${serviceLocation.municipality}, ` : ''}${serviceLocation?.state ? `ESTADO: ${serviceLocation.state}` : ''}`.trim().replace(/,\s*$/, '')

                    servicesList.push({
                        ...missionSummary,
                        antares_id: missionSummary.antaresId ?? "0",
                        stationDescription: missionSummary.stationId,
                        serviceLocation: `${serviceLocation?.address ? `${serviceLocation.address}, ` : ''}${serviceLocation?.urb ? `URBANIZACIÓN: ${serviceLocation.urb}, ` : ''}${serviceLocation?.sector ? `SECTOR: ${serviceLocation.sector}, ` : ''}${serviceLocation?.parish ? `PARROQUIA: ${serviceLocation.parish}, ` : ''}${serviceLocation?.municipality ? `MUNICIPIO: ${serviceLocation.municipality}, ` : ''}${serviceLocation?.state ? `ESTADO: ${serviceLocation.state}` : ''}`.trim().replace(/,\s*$/, '')
                    })
                }
            }
        }
        return servicesList
    }

    function getAntaresDescriptionFor(id: string): string {
        const antares = antaresCollection.filter(x => x.id == id)[0]
        if (antares) return antares.description
        return ""
    }

    function getStationAbbreviationFor(id: string) {
        const station = stationCollection.filter(x => x.id == id)[0]
        if (station) return station.abbreviation
        return ""
    }

    function getStationDescriptionFor(id: string) {
        const station = stationCollection.filter(x => x.id == id)[0]
        if (station) return station.description
        return ""
    }

    function getServicesByAntares(services: NewsSummary[]): { antaresId: string, antaresDescription: string, count: number }[] {
        const validServices = services.filter(service => service.cancelReason == '')

        return antaresCollection.map(antares => (
            { antaresId: antares.id, antaresDescription: antares.description, count: validServices.filter(service => service.antares_id == antares.id && service.cancelReason == '').length }
        ))
    }

    function getCanceledServicesCount(services: NewsSummary[]): number {
        return services.filter(service => service.cancelReason != '').length
    }

    function getServicesByCancelReason(services: NewsSummary[]): { antaresId: string, antaresDescription: string, count: number }[] {
        const cancelServices = services.filter(service => service.cancelReason != '')
        const cancelReasons: string[] = [
            ...new Set(cancelServices.map(service => service.cancelReason))
        ];

        if (cancelReasons.length < 1) return [];
        return cancelReasons.map(cancelReason => ({
            antaresId: "-1", antaresDescription: cancelReason, count: cancelServices.filter(service => service.cancelReason == cancelReason).length
        }))
    }


    return <div className="relative min-h-[20rem] h-full w-full bg-white">

        {loading ?
            (<Overlay background={""} isVisible={true} type={'Loader'} />) : (

                <>


                    <div className="font-semibold">DIRECCIÓN GENERAL NACIONAL DE BOMBEROS</div>
                    <div className="font-semibold">REDAN CAPITAL - ZOEDAN MIRANDA</div>

                    {filters && (
                        <>
                            <div className="py-2">-------------------------------------------------------------------------</div>
                            <div className="font-semibold pb-2">FILTROS</div>

                            {filters.map(filter => (
                                <div >
                                    {filter.name}:  <span className='font-semibold px-2 text-slate-700'> {filter.value} </span>
                                </div>
                            ))}
                        </>
                    )}

                    <div className="py-2">-------------------------------------------------------------------------</div>
                    <div className="font-semibold">RESUMEN DE NOVEDADES</div>
                    <div className="py-2">-------------------------------------------------------------------------</div>
                    <div className="font-semibold">EVENTOS DE IMPORTANCIA: <span className="font-normal">{services.filter(x => x.isImportant).length}</span></div>

                    {services.filter(x => x.isImportant && x.cancelReason == '').map(importantService => (
                        <div className="pt-8">
                            <div className="font-semibold">EVENTO: <span className="font-normal">{importantService.antares_id} -  {antaresCollection.filter(x => x.id == importantService.antares_id)?.[0]?.description ?? ''}</span></div>
                            <div className="font-semibold">HORA: <span className="font-normal">{importantService.manualMissionDate}</span></div>
                            <div className="font-semibold">CÓDIGO: <span className="font-normal">{importantService.id.split("-")[0]}</span></div>
                            <div className="font-semibold">ESTACIÓN: <span className="font-normal">{stationCollection.filter(x => x.id == importantService.stationId)?.[0]?.abbreviation} - {stationCollection.filter(x => x.id == importantService.stationId)?.[0]?.name}</span></div>
                            <div className="font-semibold">DIRECCIÓN: <span className="font-normal">{importantService.serviceLocation}</span></div>
                        </div>
                    ))}

                    <div className="py-2">-------------------------------------------------------------------------</div>

                    <div className="font-semibold">Total Servicios Efectuados: <span className="font-normal">{services.length - getCanceledServicesCount(services)}</span></div>

                    <div className="pt-8">
                        {services.filter(x => !x.antaresId).length > 0 &&
                        <>
                        <div className="font-semibold">{services.filter(x => !x.antaresId).length}<span className="font-normal"> - SERVICIOS SIN ANTARES</span></div>
                        </> }
                        {getServicesByAntares(services).sort((a, b) => b.count - a.count).map(antares => (
                            <>
                                {antares.count > 0 &&
                                    <div className="font-semibold">{antares.count}<span className="font-normal"> - {antares.antaresDescription}</span></div>
                                }
                            </>
                        ))}
                    </div>

                    <div className="py-2">-------------------------------------------------------------------------</div>

                    <div className="font-semibold">Servicios Cancelados: <span className="font-normal">{getCanceledServicesCount(services)}</span></div>

                    <div className="pt-8">
                        {getServicesByCancelReason(services).sort((a, b) => b.count - a.count).map(antares => (
                            <>
                                {antares.count > 0 &&
                                    <div className="font-semibold">{antares.count}<span className="font-normal"> - {antares.antaresDescription}</span></div>
                                }
                            </>
                        ))}
                    </div>

                    <div className="py-2">-------------------------------------------------------------------------</div>
                    <div className="">CENTRO DE OPERACIONES DE EMERGENCIA</div>
                    <div className="">TELÉFONO: 0414-9254769</div>
                    <div className="">GENERAL (B). LAURA GERARDI</div>
                    <div className="">DIRECTORA-PRESIDENTE</div></>
            )}
    </div>
}

