import React, { ReactNode, useEffect, useState } from 'react'
import { ServiceFromApi, TService } from '../../../../domain/models/service/service'
import { PrintLayout } from './PrintLayout'
import { useCollection } from '../../../core/hooks/useCollection'
import { AntaresFromApi, TAntares } from '../../../../domain/models/antares/antares'

import { StationSchemaBasicDataType } from '../../../../domain/models/stations/station'
import { getById } from '../../../../services/http'

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

interface ServicePrintProps {
    servicesIds: string[]
    filters: { name: string, value: string }[]
    groupBy: "Antares" | "Stations" | "AntaresTypes"
}

type AnteresTypeSummary = { antaresType: string; count: number, percentage: string }

type AntaresTypeDetail = {
    antaresType: string
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

function getAntaresTypes(antares: TAntares[], antaresSummary: AnteresSummary[], antaresDetail: AntaresDetail[]): { antaresTypeSummary: AnteresTypeSummary[], antaresTypeDetail: AntaresTypeDetail[] } {
    if (!antares || antares.length < 1) return { antaresTypeSummary: [], antaresTypeDetail: [] }

    let antaresTypeSummary: AnteresTypeSummary[] = [];
    let servicesCount = 0;

    antaresSummary.forEach(item => {
        var currentAntares = antares.filter(x => x.id == item.antaresId)[0]

        if (currentAntares) {
            var CurrentAntaresType = antaresTypeSummary.filter(x => x.antaresType == currentAntares.type)[0]

            if (CurrentAntaresType) CurrentAntaresType.count += item.count
            else antaresTypeSummary.push({ antaresType: currentAntares.type, count: item.count, percentage: '' })

            servicesCount += item.count
        }
    });

    antaresTypeSummary = antaresTypeSummary.sort((a, b) => b.count - a.count)
    antaresTypeSummary.forEach(x => {
        x.percentage = ((x.count / servicesCount) * 100).toFixed(2)
    })    

    let antaresTypeDetail: AntaresTypeDetail[] = [];

    antaresDetail.forEach(item => {
        let currentAntares = antares.filter(x => x.id == item.antaresId)[0]

        if (currentAntares) {
            let CurrentAntaresType = antaresTypeDetail.filter(x => x.antaresType == currentAntares.type)[0]

            if (!CurrentAntaresType) {
                CurrentAntaresType = {
                    antaresType: currentAntares.type, details: [], summatory: {
                        services: 0,
                        unharmed: 0,
                        injured: 0,
                        transported: 0,
                        deceased: 0,
                        percentage: "",
                    }
                }

                antaresTypeDetail.push(CurrentAntaresType)
            }

            item.details.forEach(station => {
                let currentStation = CurrentAntaresType.details.filter(x => x.stationId == station.stationId)[0]

                if (currentStation) {
                    currentStation.unharmed += station.unharmed
                    currentStation.injured += station.injured
                    currentStation.transported += station.transported
                    currentStation.deceased += station.deceased
                    currentStation.services += station.services

                    CurrentAntaresType.summatory.unharmed += station.unharmed
                    CurrentAntaresType.summatory.injured += station.injured
                    CurrentAntaresType.summatory.transported += station.transported
                    CurrentAntaresType.summatory.deceased += station.deceased
                    CurrentAntaresType.summatory.services += station.services
                }
                else {
                    CurrentAntaresType.details.push({ ...station, percentage: '' })

                    CurrentAntaresType.summatory.unharmed += station.unharmed
                    CurrentAntaresType.summatory.injured += station.injured
                    CurrentAntaresType.summatory.transported += station.transported
                    CurrentAntaresType.summatory.deceased += station.deceased
                    CurrentAntaresType.summatory.services += station.services
                }
            })
        }
    })

    antaresTypeDetail = antaresTypeDetail.sort((a, b) => b.summatory.services - a.summatory.services)
    antaresTypeDetail.forEach(item => {
        item.summatory.percentage = ((item.summatory.services / servicesCount) * 100).toFixed(2)

        item.details.forEach(detail => {
            detail.percentage = ((detail.services / servicesCount) * 100).toFixed(2)
        })

        item.details = item.details.sort((a, b) => b.services - a.services)
    })

    return { antaresTypeSummary, antaresTypeDetail }
}

export function DetailServicesSummaryPrint({ servicesIds, groupBy, filters }: ServicePrintProps) {
    const antaresCollection = useCollection('mission/antares', AntaresFromApi)
    const stationCollection = useCollection('station', (data: StationSchemaBasicDataType) => {
        return { success: true, result: data }
    })

    const [services, setServices] = useState<TService[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        getServices(servicesIds)
    }, [])

    async function getServices(servicesIds: string[]) {

        console.log("called for", servicesIds.length);


        try {
            setLoading(true)
            const servicesList: TService[] = await getServicesList()
            setServices(servicesList)
        }
        catch (error) {
            console.log(error);

        }
        finally {
            setLoading(false)
        }
    }

    async function getServicesList(): Promise<TService[]> {

        const servicesList: TService[] = []

        for (const serviceId of servicesIds) {
            const request = await getById<TService>("mission/service", serviceId, ServiceFromApi)
            if (request.success && request.result) {
                servicesList.push(request.result)
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

    const { antaresSummary, stationsSummary, antaresDetail, stationsDetail } = getServiceData(services);
    const { antaresTypeSummary, antaresTypeDetail } = getAntaresTypes(antaresCollection, antaresSummary, antaresDetail)

    console.log(antaresTypeSummary, antaresTypeDetail);


    return <div id={'PrintThis'} className='h-full w-full'>
        <PrintLayout loading={loading} title={`ESTADÍSTICAS POR ${groupBy === 'Antares' ? "ANTARES" : "ESTACIONES"} (CLASIFICACIONES Y ESTACIONES DE BOMBEROS)`} subtitle={new Date().toLocaleString('en-GB', { timeZone: 'UTC', hour12: false })} filters={filters}>
            <>
                <div className='flex'>

                    {groupBy == "AntaresTypes" ? (
                        <div className="pt-4 w-1/2">
                            <div className="flex justify-center items-center w-full font-semibold text-slate-700 text-xl">
                                Resumen por tipos de antares
                            </div>

                            <div className="flex flex-wrap justify-center gap-x-6 gap-y-4 px-4 w-full pt-4">
                                {antaresTypeSummary.map(antares => (
                                    <div className="w-fit">
                                        <div className="w-full text-center space-x-1 bg-[#1C2434] px-4 py-1.5 rounded-t-lg font-semibold text-xs text-white">
                                            <span> {antares.antaresType} </span>
                                            <span>-</span>
                                            <span>{antares.count}</span>
                                        </div>
                                        <div className="flex justify-center items-center space-x-2 px-4 py-2 border border-t-0 rounded-b-lg font-semibold text-sm text-slate-600">
                                            <span>{antares.percentage}%</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="pt-4 w-1/2">
                            <div className="flex justify-center items-center w-full font-semibold text-slate-700 text-xl">
                                Resumen de antares
                            </div>

                            <div className="flex flex-wrap justify-center gap-x-6 gap-y-4 px-4 w-full pt-4">
                                {antaresSummary.map(antares => (
                                    <div className="w-fit">
                                        <div className="w-full text-center space-x-1 bg-[#1C2434] px-4 py-1.5 rounded-t-lg font-semibold text-xs text-white">
                                            <span>( {antares.antaresId} {getAntaresDescriptionFor(antares.antaresId)} )</span>
                                            <span>-</span>
                                            <span>{antares.count}</span>
                                        </div>
                                        <div className="flex justify-center items-center space-x-2 px-4 py-2 border border-t-0 rounded-b-lg font-semibold text-sm text-slate-600">
                                            <span>{antares.percentage}%</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="pt-4 w-1/2">
                        <div className="flex justify-center items-center w-full font-semibold text-slate-700 text-xl">
                            Resumen de Estaciones
                        </div>

                        <div className="flex flex-wrap justify-center gap-x-6 gap-y-4 px-4 w-full pt-4">
                            {stationsSummary.map(station => (
                                <div className="w-fit">
                                    <div className="w-full text-center space-x-1 bg-[#1C2434] px-6 py-1.5 rounded-t-lg font-semibold text-xs text-white">
                                        <span>{getStationAbbreviationFor(station.stationId)} ( {getStationDescriptionFor(station.stationId)} )</span>
                                        <span>-</span>
                                        <span>{station.count}</span>
                                    </div>
                                    <div className="flex justify-center items-center space-x-2 px-4 py-2 border border-t-0 rounded-b-lg font-semibold text-sm text-slate-600">
                                        <span>{station.percentage}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {groupBy == "Antares" && (
                    <div className="space-y-4 pt-8">
                        <div className="flex items-center pl-4 w-full font-semibold text-slate-700 text-xl">
                            Detalles por Antares
                        </div>

                        <div className="space-y-8">
                            {antaresDetail.map(antares => (
                                <div>
                                    <div className="bg-[#1C2434] px-6 py-2 rounded-t-lg font-semibold text-white text-xl">
                                        Antares {antares.antaresId} ( {getAntaresDescriptionFor(antares.antaresId)} ) - {antares.summatory.services} Servicios
                                    </div>

                                    <div className="px-2 border rounded-b-md">
                                        <table className="w-full">
                                            <tr>
                                                <td className="py-2 font-semibold text-lg text-slate-600">
                                                    Estación
                                                </td>
                                                <td className="py-2 font-semibold text-center text-lg text-slate-600">
                                                    Servicios
                                                </td>
                                                <td className="py-2 font-semibold text-center text-lg text-slate-600">
                                                    Ilesos
                                                </td>
                                                <td className="py-2 font-semibold text-center text-lg text-slate-600">
                                                    Lesionados
                                                </td>
                                                <td className="py-2 font-semibold text-center text-lg text-slate-600">
                                                    Transladados
                                                </td>
                                                <td className="py-2 font-semibold text-center text-lg text-slate-600">
                                                    Fallecidos
                                                </td>
                                                <td className="py-2 font-semibold text-center text-lg text-slate-600">
                                                    Total
                                                </td>
                                            </tr>
                                            {antares.details.map(stationDetail => (
                                                <tr className="border-t">
                                                    <td className="py-2 text-sm">
                                                        {getStationAbbreviationFor(stationDetail.stationId)} - ( {getStationDescriptionFor(stationDetail.stationId)} )
                                                    </td>
                                                    <td className="py-2 text-center text-sm">
                                                        {stationDetail.services}
                                                    </td>
                                                    <td className="py-2 text-center text-sm">
                                                        {stationDetail.unharmed}
                                                    </td>
                                                    <td className="py-2 text-center text-sm">
                                                        {stationDetail.injured}
                                                    </td>
                                                    <td className="py-2 text-center text-sm">
                                                        {stationDetail.transported}
                                                    </td>
                                                    <td className="py-2 text-center text-sm">
                                                        {stationDetail.deceased}
                                                    </td>
                                                    <td className="py-2 text-center text-sm">
                                                        {stationDetail.percentage}%
                                                    </td>
                                                </tr>
                                            ))}

                                            <tr className="border-t font-semibold">
                                                <td className="py-2">Total</td>
                                                <td className="py-2 text-center text-sm">
                                                    {antares.summatory.services}
                                                </td>
                                                <td className="py-2 text-center text-sm">
                                                    {antares.summatory.unharmed}
                                                </td>
                                                <td className="py-2 text-center text-sm">
                                                    {antares.summatory.injured}
                                                </td>
                                                <td className="py-2 text-center text-sm">
                                                    {antares.summatory.transported}
                                                </td>
                                                <td className="py-2 text-center text-sm">
                                                    {antares.summatory.deceased}
                                                </td>
                                                <td className="py-2 text-center text-sm">
                                                    {antares.summatory.percentage}%
                                                </td>
                                            </tr>
                                        </table>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {groupBy == "AntaresTypes" && (
                    <div className="space-y-4 pt-8">
                        <div className="flex items-center pl-4 w-full font-semibold text-slate-700 text-xl">
                            Detalles por Tipos de Antares
                        </div>

                        <div className="space-y-8">
                            {antaresTypeDetail.map(antares => (
                                <div>
                                    <div className="bg-[#1C2434] px-6 py-2 rounded-t-lg font-semibold text-white text-xl">
                                        {antares.antaresType} - {antares.summatory.services} Servicios
                                    </div>

                                    <div className="px-2 border rounded-b-md">
                                        <table className="w-full">
                                            <tr>
                                                <td className="py-2 font-semibold text-lg text-slate-600">
                                                    Estación
                                                </td>
                                                <td className="py-2 font-semibold text-center text-lg text-slate-600">
                                                    Servicios
                                                </td>
                                                <td className="py-2 font-semibold text-center text-lg text-slate-600">
                                                    Ilesos
                                                </td>
                                                <td className="py-2 font-semibold text-center text-lg text-slate-600">
                                                    Lesionados
                                                </td>
                                                <td className="py-2 font-semibold text-center text-lg text-slate-600">
                                                    Transladados
                                                </td>
                                                <td className="py-2 font-semibold text-center text-lg text-slate-600">
                                                    Fallecidos
                                                </td>
                                                <td className="py-2 font-semibold text-center text-lg text-slate-600">
                                                    Total
                                                </td>
                                            </tr>
                                            {antares.details.map(stationDetail => (
                                                <tr className="border-t">
                                                    <td className="py-2 text-sm">
                                                        {getStationAbbreviationFor(stationDetail.stationId)} - ( {getStationDescriptionFor(stationDetail.stationId)} )
                                                    </td>
                                                    <td className="py-2 text-center text-sm">
                                                        {stationDetail.services}
                                                    </td>
                                                    <td className="py-2 text-center text-sm">
                                                        {stationDetail.unharmed}
                                                    </td>
                                                    <td className="py-2 text-center text-sm">
                                                        {stationDetail.injured}
                                                    </td>
                                                    <td className="py-2 text-center text-sm">
                                                        {stationDetail.transported}
                                                    </td>
                                                    <td className="py-2 text-center text-sm">
                                                        {stationDetail.deceased}
                                                    </td>
                                                    <td className="py-2 text-center text-sm">
                                                        {stationDetail.percentage}%
                                                    </td>
                                                </tr>
                                            ))}

                                            <tr className="border-t font-semibold">
                                                <td className="py-2">Total</td>
                                                <td className="py-2 text-center text-sm">
                                                    {antares.summatory.services}
                                                </td>
                                                <td className="py-2 text-center text-sm">
                                                    {antares.summatory.unharmed}
                                                </td>
                                                <td className="py-2 text-center text-sm">
                                                    {antares.summatory.injured}
                                                </td>
                                                <td className="py-2 text-center text-sm">
                                                    {antares.summatory.transported}
                                                </td>
                                                <td className="py-2 text-center text-sm">
                                                    {antares.summatory.deceased}
                                                </td>
                                                <td className="py-2 text-center text-sm">
                                                    {antares.summatory.percentage}%
                                                </td>
                                            </tr>
                                        </table>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {groupBy == "Stations" && (
                    <div className="space-y-4 pt-8">
                        <div className="flex items-center pl-4 w-full font-semibold text-slate-700 text-xl">
                            Detalles por Estación
                        </div>

                        <div className="space-y-8">
                            {stationsDetail.map(station => (
                                <div>
                                    <div className="bg-[#1C2434] px-6 py-2 rounded-t-lg font-semibold text-white text-xl">
                                        Estación {getStationAbbreviationFor(station.stationId)} ( {getStationDescriptionFor(station.stationId)} ) - {station.summatory.services} Servicios
                                    </div>

                                    <div className="px-2 border rounded-b-md">
                                        <table className="w-full">
                                            <tr>
                                                <td className="py-2 font-semibold text-lg text-slate-600">
                                                    Antares
                                                </td>
                                                <td className="py-2 font-semibold text-center text-lg text-slate-600">
                                                    Servicios
                                                </td>
                                                <td className="py-2 font-semibold text-center text-lg text-slate-600">
                                                    Ilesos
                                                </td>
                                                <td className="py-2 font-semibold text-center text-lg text-slate-600">
                                                    Lesionados
                                                </td>
                                                <td className="py-2 font-semibold text-center text-lg text-slate-600">
                                                    Transladados
                                                </td>
                                                <td className="py-2 font-semibold text-center text-lg text-slate-600">
                                                    Fallecidos
                                                </td>
                                                <td className="py-2 font-semibold text-center text-lg text-slate-600">
                                                    Total
                                                </td>
                                            </tr>
                                            {station.details.map(antaresDetail => (
                                                <tr className="border-t">
                                                    <td className="py-2 text-sm">
                                                        {antaresDetail.antaresId} - {getAntaresDescriptionFor(antaresDetail.antaresId)}
                                                    </td>
                                                    <td className="py-2 text-center text-sm">
                                                        {antaresDetail.services}
                                                    </td>
                                                    <td className="py-2 text-center text-sm">
                                                        {antaresDetail.unharmed}
                                                    </td>
                                                    <td className="py-2 text-center text-sm">
                                                        {antaresDetail.injured}
                                                    </td>
                                                    <td className="py-2 text-center text-sm">
                                                        {antaresDetail.transported}
                                                    </td>
                                                    <td className="py-2 text-center text-sm">
                                                        {antaresDetail.deceased}
                                                    </td>
                                                    <td className="py-2 text-center text-sm">
                                                        {antaresDetail.percentage}%
                                                    </td>
                                                </tr>
                                            ))}

                                            <tr className="border-t font-semibold">
                                                <td className="py-2">Total</td>
                                                <td className="py-2 text-center text-sm">
                                                    {station.summatory.services}
                                                </td>
                                                <td className="py-2 text-center text-sm">
                                                    {station.summatory.unharmed}
                                                </td>
                                                <td className="py-2 text-center text-sm">
                                                    {station.summatory.injured}
                                                </td>
                                                <td className="py-2 text-center text-sm">
                                                    {station.summatory.transported}
                                                </td>
                                                <td className="py-2 text-center text-sm">
                                                    {station.summatory.deceased}
                                                </td>
                                                <td className="py-2 text-center text-sm">
                                                    {station.summatory.percentage}%
                                                </td>
                                            </tr>
                                        </table>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </>
        </PrintLayout>
    </div>
}
