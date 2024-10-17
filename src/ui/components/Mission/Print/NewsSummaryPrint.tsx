import { useEffect, useState } from "react"
import { ServiceFromApi, TService, TServiceSummary } from "../../../../domain/models/service/service"
import { useCollection } from "../../../core/hooks/useCollection"
import { getAll, getById, getGroup, getSummary } from "../../../../services/http"
import { StationSchemaBasicDataType } from "../../../../domain/models/stations/station"
import { AntaresFromApi } from "../../../../domain/models/antares/antares"
import React from "react"
import { LocationFromApi, ServiceLocationSchemaType } from "../../../../domain/models/location/location"
import Overlay from "../../../core/overlay/overlay"

function getServiceData(services: TService[]): {
    antaresSummary: AnteresSummary[]
    stationsSummary: StationsSummary[]
    antaresDetail: AntaresDetail[]
    stationsDetail: StationsDetail[]
} {
    const antaresSummary = groupByAntaresId(services)
    const stationsSummary = groupServicesByStation(services)

    const antaresDetail = detailByAntares(services)
    const stationsDetail = detailByStation(services)

    return { antaresSummary, stationsSummary, antaresDetail, stationsDetail }
}

type AnteresSummary = { antaresId: string; count: number, percentage: string }
function groupByAntaresId(services: TService[]): AnteresSummary[] {
    let antares: AnteresSummary[] = []

    services.forEach((service) => {
        const antaresId = service.antaresId
        const antaresItem = antares.find((item) => item.antaresId === antaresId)

        if (antaresItem) {
            antaresItem.count++
        } else if (antaresId) {
            antares.push({ antaresId, count: 1, percentage: "0" })
        }
    })

    antares.forEach(antares => {
        antares.percentage = ((antares.count / services.length) * 100).toFixed(2)
    })

    antares = antares.sort((a, b) => b.count - a.count)

    return antares
}

type StationsSummary = { stationId: string; count: number, percentage: string }
function groupServicesByStation(services: TService[]): StationsSummary[] {
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
function detailByAntares(services: TService[]): AntaresDetail[] {
    let antaresDetail: AntaresDetail[] = []
    let servicesCount: number = 0

    services.forEach((service) => {
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
function detailByStation(services: TService[]): StationsDetail[] {
    let stationDetail: StationsDetail[] = []
    let servicesCount = 0

    services.forEach((service) => {
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
    servicesIds: string[]
    filters: { name: string, value: string }[]
}

export function NewsSummaryPrint({ servicesIds, filters }: NewsSummaryPrintProps) {
    const antaresCollection = useCollection('mission/antares', AntaresFromApi)
    const stationCollection = useCollection('station', (data: StationSchemaBasicDataType) => {
        return { success: true, result: data }
    })



    const [services, setServices] = useState<NewsSummary[]>([])
    const [servicesByAntares, setServicesByAntares] = useState<{ antaresId: string, antaresDescription: string, count: number }[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        getServices(servicesIds)
    }, [])

    async function getServices(servicesIds: string[]) {
        try {
            setLoading(true)
            const servicesList: NewsSummary[] = await getServicesList()
            let ServicesByAntares = getServicesByAntares(servicesList)
            ServicesByAntares = ServicesByAntares.sort((a, b) => b.count - a.count)
            setServices(servicesList)
            console.log(ServicesByAntares.length);

            setServicesByAntares(ServicesByAntares)

        }
        catch (error) {
            console.log(error);

        }
        finally {
            setLoading(false)
        }
    }

    type NewsSummary = TServiceSummary & {
        stationDescription: string;
        serviceLocation: string;
        cancelReason: string;
    }

    async function getServicesList(): Promise<NewsSummary[]> {

        const servicesList: NewsSummary[] = []
        const servicesSummaryRequest = await await getSummary<TServiceSummary>("mission/service")

        let serviceLocations: ServiceLocationSchemaType[] = []
        let locationsSet = false;

        if (servicesSummaryRequest.success && servicesSummaryRequest.result) {

            for (const serviceId of servicesIds) {
                const serviceSummary = servicesSummaryRequest.result.filter(x => x.id == serviceId)[0]
                if (!locationsSet) {
                    serviceLocations = (await getAll<ServiceLocationSchemaType>('mission/location', LocationFromApi)).result ?? []
                    locationsSet = true
                }
                if (serviceSummary) {
                    const servicesRequest = await getById<TService>("mission/service", serviceId, ServiceFromApi)

                    const serviceLocation = serviceLocations?.filter(x => x.id == servicesRequest.result?.locationId)[0]
                    servicesList.push({
                        ...serviceSummary,
                        stationDescription: stationCollection.filter(x => x.id == serviceSummary.station_name.replace("M", ""))[0]?.description ?? "",
                        serviceLocation: `${serviceLocation?.address ? `${serviceLocation.address}, ` : ''}${serviceLocation?.urb ? `URBANIZACIÓN: ${serviceLocation.urb}, ` : ''}${serviceLocation?.sector ? `SECTOR: ${serviceLocation.sector}, ` : ''}${serviceLocation?.parish ? `PARROQUIA: ${serviceLocation.parish}, ` : ''}${serviceLocation?.municipality ? `MUNICIPIO: ${serviceLocation.municipality}, ` : ''}${serviceLocation?.state ? `ESTADO: ${serviceLocation.state}` : ''}`.trim().replace(/,\s*$/, ''),
                        cancelReason: servicesRequest.result?.cancelReason ?? ""
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
        return antaresCollection.map(antares => (
            { antaresId: antares.id, antaresDescription: antares.description, count: services.filter(service => service.antares_id == antares.id && service.cancelReason == '').length }
        ))
    }

    function getCancelledServices(services: NewsSummary[]): { cancelReason: string, count: number }[] {
        return [
            { cancelReason: "ALARMA FALSA",  count: services.filter(service => service.cancelReason == "ALARMA FALSA").length },
            { cancelReason: "ALARMA INFUNDADA",  count: services.filter(service => service.cancelReason == "ALARMA INFUNDADA").length },
            { cancelReason: "ATENDIDO NO EFECTUADO",  count: services.filter(service => service.cancelReason == "ATENDIDO NO EFECTUADO").length },
            { cancelReason: "ATENCION NO REALIZADA",  count: services.filter(service => service.cancelReason == "ATENCION NO REALIZADA").length }
        ].filter(x => x.count > 0).sort((a,b) => b.count - a.count)
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
                    <div className="font-semibold">EVENTOS DE IMPORTANCIA: <span className="font-normal">{services.filter(x => x.is_important).length}</span></div>

                    {services.filter(x => x.is_important).map(importantService => (
                        <div className="pt-8">
                            <div className="font-semibold">EVENTO: <span className="font-normal">{importantService.antares_id} -  {getAntaresDescriptionFor(importantService.antares_id)} {importantService.cancelReason != '' && <span className="font-semibold">( {importantService.cancelReason} )</span>}</span></div>
                            <div className="font-semibold">HORA: <span className="font-normal">{importantService.manual_service_date}</span></div>
                            <div className="font-semibold">CODIGO: <span className="font-normal">{importantService.mission_id.split("-")[0]}</span></div>
                            <div className="font-semibold">ESTACION: <span className="font-normal">{importantService.station_name} - {importantService.stationDescription}</span></div>
                            <div className="font-semibold">DIRECCION: <span className="font-normal">{importantService.serviceLocation}</span></div>
                        </div>
                    ))}

                    <div className="py-2">-------------------------------------------------------------------------</div>

                    <div className="font-semibold">Total Servicios: <span className="font-normal">{services.filter(x => x.cancelReason == '').length}</span></div>

                    <div className="pt-8">
                        {getServicesByAntares(services).sort((a, b) => b.count - a.count).map(antares => (
                            <>
                                {antares.count > 0 &&
                                    <div className="font-semibold">{antares.count}<span className="font-normal"> - {antares.antaresDescription}</span></div>
                                }
                            </>
                        ))}
                    </div>

                    <div className="py-2">-------------------------------------------------------------------------</div>

                    <div className="font-semibold">Servicios Cancelados: <span className="font-normal">{services.filter(x => x.cancelReason).length}</span></div>

                    <div className="pt-8">
                        {getCancelledServices(services).sort((a, b) => b.count - a.count).map(antares => (
                            <>
                                {antares.count > 0 &&
                                    <div className="font-semibold">{antares.count}<span className="font-normal"> - {antares.cancelReason}</span></div>
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

