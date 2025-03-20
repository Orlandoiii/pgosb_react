import React, { useEffect, useState } from 'react'
import { PrintLayout } from './PrintLayout'

import { useAntaresCollection } from '../../../../domain/models/mission/antares/use_collection'
import { useStationCollection } from '../../../../domain/models/mission/station/use_collection'
import { MissionServiceFront } from '../../../../domain/models/mission/service/mission_service'
import { useMissionServiceActions } from '../../../../domain/models/mission/service/use_collection'
import { post } from '../../../../services/http'

type GroupReport = {
    antaresStationAggregationJson: AntaresStationAggregationJson[]
    antaresStationAggregationCount: number
    antaresAggregationJson: AntaresAggregationJson[]
    antaresAggregationCount: number
    stationAggregationJson: StationAggregationJson[]
    stationAggregationCount: number
    antaresTypeAggregationJson: AntaresTypeAggregationJson[]
    antaresTypeAggregationCount: number
    municipalityAggregationJson: MunicipalityAggregationJson[]
    municipalityAggregationCount: number
    parishAggregationJson: ParishAggregationJson[]
    parishAggregationCount: number
}

type AntaresStationAggregationJson = {
    antares_id: string
    antares_name: string
    station_id: string
    station_name: string
    station_abbreviation: string
    count: string

    unharmed: string
    injured: string
    transported: string
    deceased: string

    municipality_origin: string
    parish_origin: string
}

type AntaresAggregationJson = {
    antares_id: string
    antares_name: string
    count: string
}

type StationAggregationJson = {
    station_id: string
    station_name: string
    station_abbreviation: string
    count: string
}

type AntaresTypeAggregationJson = {
    antares_type: string
    count: string
}

type MunicipalityAggregationJson = {
    municipality_origin: string
    count: string
}

type ParishAggregationJson = {
    parish_origin: string
    count: string
}

interface ServicePrintProps {
    missionsIds: string[]
    filters: { name: string; value: string }[]
    groupBy: 'Antares' | 'Stations' | 'AntaresTypes' | 'Municipality' | 'Parish'
}

type AgregationByAntares = {
    antares_id: string
    antares_name: string
    count: number
    stations: SubAgregationStation[]
}

type AgregationByAntaresType = {
    antares_type: string
    count: number
    stations: SubAgregationStation[]
}

type SubAgregationStation = {
    station_id: string
    station_name: string
    station_abbreviation: string
    count: number
    unharmed: number
    injured: number
    transported: number
    deceased: number
}

type AgregationByStation = {
    station_id: string
    station_name: string
    station_abbreviation: string
    count: number
    unharmed: number
    injured: number
    transported: number
    deceased: number
    antares: SubAgregationAntares[]
}

type AgregationByMunicipality = {
    municipality_name: string
    count: number
    unharmed: number
    injured: number
    transported: number
    deceased: number
    antares: SubAgregationAntares[]
}

type AgregationByParish = {
    parish_name: string
    count: number
    unharmed: number
    injured: number
    transported: number
    deceased: number
    antares: SubAgregationAntares[]
}

type SubAgregationAntares = {
    antares_id: string
    antares_name: string
    count: number
}

export function DetailServicesSummaryPrint({
    missionsIds,
    groupBy,
    filters,
}: ServicePrintProps) {
    const [data, setData] = useState<GroupReport>()
    const [agregationByAntares, setAgregationByAntares] =
        useState<AgregationByAntares[]>()
    const [agregationByAntaresType, setAgregationByAntaresType] =
        useState<AgregationByAntaresType[]>()
    const [agregationByStation, setAgregationByStation] =
        useState<AgregationByStation[]>()
    const [AgregationByMunicipality, setAgregationByMunicipality] =
        useState<AgregationByMunicipality[]>()
    const [AgregationByParish, setAgregationByParish] =
        useState<AgregationByParish[]>()
    const [loading, setLoading] = useState(false)
    const [antaresTypes] = useAntaresCollection()

    useEffect(() => {
        getData(missionsIds)
    }, [])

    function sumCount(elements: { count: string }[]): number {
        let sum = 0
        elements.forEach((element) => {
            sum = sum + parseInt(element.count)
        })
        return sum
    }

    async function getData(missionsIds: string[]) {
        try {
            setLoading(true)

            const antaresStationResult = await post<
                AntaresStationAggregationJson[]
            >(`mission-reports/aggregations/antares-station/in`, missionsIds)

            const antaresResult = await post<AntaresAggregationJson[]>(
                `mission-reports/aggregations/antares/in`,
                missionsIds
            )

            const stationResult = await post<StationAggregationJson[]>(
                `mission-reports/aggregations/station/in`,
                missionsIds
            )

            const antaresTypeResult = await post<AntaresTypeAggregationJson[]>(
                `mission-reports/aggregations/antares-type/in`,
                missionsIds
            )

            const municipalityResult = await post<
                MunicipalityAggregationJson[]
            >(`mission-reports/aggregations/municipality/in`, missionsIds)

            const parishResult = await post<ParishAggregationJson[]>(
                `mission-reports/aggregations/parish/in`,
                missionsIds
            )

            setData({
                antaresStationAggregationJson:
                    antaresStationResult.success && antaresStationResult.result
                        ? antaresStationResult.result
                              .sort(
                                  (a, b) =>
                                      parseInt(b.count) - parseInt(a.count)
                              )
                              .sort(
                                  (a, b) =>
                                      parseInt(b.count) - parseInt(a.count)
                              )
                        : [],
                antaresAggregationCount:
                    antaresStationResult.success && antaresStationResult.result
                        ? sumCount(antaresStationResult.result)
                        : 0,
                antaresAggregationJson:
                    antaresResult.success && antaresResult.result
                        ? antaresResult.result.sort(
                              (a, b) => parseInt(b.count) - parseInt(a.count)
                          )
                        : [],
                antaresStationAggregationCount:
                    antaresResult.success && antaresResult.result
                        ? sumCount(antaresResult.result)
                        : 0,
                stationAggregationJson:
                    stationResult.success && stationResult.result
                        ? stationResult.result.sort(
                              (a, b) => parseInt(b.count) - parseInt(a.count)
                          )
                        : [],
                stationAggregationCount:
                    stationResult.success && stationResult.result
                        ? sumCount(stationResult.result)
                        : 0,
                antaresTypeAggregationJson:
                    antaresTypeResult.success && antaresTypeResult.result
                        ? antaresTypeResult.result.sort(
                              (a, b) => parseInt(b.count) - parseInt(a.count)
                          )
                        : [],
                antaresTypeAggregationCount:
                    antaresTypeResult.success && antaresTypeResult.result
                        ? sumCount(antaresTypeResult.result)
                        : 0,
                municipalityAggregationJson:
                    municipalityResult.success && municipalityResult.result
                        ? municipalityResult.result.sort(
                              (a, b) => parseInt(b.count) - parseInt(a.count)
                          )
                        : [],
                municipalityAggregationCount:
                    municipalityResult.success && municipalityResult.result
                        ? sumCount(municipalityResult.result)
                        : 0,
                parishAggregationJson:
                    parishResult.success && parishResult.result
                        ? parishResult.result.sort(
                              (a, b) => parseInt(b.count) - parseInt(a.count)
                          )
                        : [],
                parishAggregationCount:
                    parishResult.success && parishResult.result
                        ? sumCount(parishResult.result)
                        : 0,
            })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (data) {
            createAntaresAgregation()
            createAntaresTypeAggregation()
            createStationAggregation()
            createMunicipalityAggregation()
            createParishAggregation()
        }
    }, [data])

    console.log('DataDelRequest', data)

    function createAntaresAgregation() {
        const antaresMap = new Map<string, AgregationByAntares>()
        const stationMap = new Map<string, Map<string, SubAgregationStation>>()

        data!.antaresStationAggregationJson.forEach((element) => {
            // Get or create antares entry
            const antaresKey = element.antares_id
            let antaresEntry = antaresMap.get(antaresKey)

            if (!antaresEntry) {
                antaresEntry = {
                    antares_id: element.antares_id,
                    antares_name: element.antares_name,
                    count: 0,
                    stations: [],
                }
                antaresMap.set(antaresKey, antaresEntry)
            }

            // Handle stations
            const stationKey = element.station_id
            let stationEntry = stationMap.get(antaresKey)?.get(stationKey)

            if (!stationEntry) {
                stationEntry = {
                    station_id: element.station_id,
                    station_name: element.station_name,
                    station_abbreviation: element.station_abbreviation,
                    count: 0,
                    unharmed: 0,
                    injured: 0,
                    transported: 0,
                    deceased: 0,
                }

                if (!stationMap.has(antaresKey)) {
                    stationMap.set(antaresKey, new Map())
                }
                stationMap.get(antaresKey)!.set(stationKey, stationEntry)
                antaresEntry.stations.push(stationEntry)
            }

            // Update counts
            const numericCount = Number(element.count)
            const numericUnharmed = Number(element.unharmed)
            const numericInjured = Number(element.injured)
            const numericTransported = Number(element.transported)
            const numericDeceased = Number(element.deceased)

            stationEntry.count += numericCount
            stationEntry.unharmed += numericUnharmed
            stationEntry.injured += numericInjured
            stationEntry.transported += numericTransported
            stationEntry.deceased += numericDeceased

            antaresEntry.count += numericCount
        })

        // Convert Map to final array
        const antaresResult = Array.from(antaresMap.values())
        setAgregationByAntares(antaresResult)
    }

    function createAntaresTypeAggregation() {
        const typeMap = new Map<string, AgregationByAntaresType>()
        const stationTypeMap = new Map<
            string,
            Map<string, SubAgregationStation>
        >()

        data!.antaresStationAggregationJson.forEach((element) => {
            const antaresType = getAntaresType(element.antares_id)

            let typeEntry = typeMap.get(antaresType)
            if (!typeEntry) {
                typeEntry = {
                    antares_type: antaresType,
                    count: 0,
                    stations: [],
                }
                typeMap.set(antaresType, typeEntry)
            }

            const stationKey = element.station_id
            let stationEntry = stationTypeMap.get(antaresType)?.get(stationKey)

            if (!stationEntry) {
                stationEntry = {
                    station_id: element.station_id,
                    station_name: element.station_name,
                    station_abbreviation: element.station_abbreviation,
                    count: 0,
                    unharmed: 0,
                    injured: 0,
                    transported: 0,
                    deceased: 0,
                }

                if (!stationTypeMap.has(antaresType)) {
                    stationTypeMap.set(antaresType, new Map())
                }
                stationTypeMap.get(antaresType)!.set(stationKey, stationEntry)
                typeEntry.stations.push(stationEntry)
            }

            // Update counts
            const numericCount = Number(element.count)
            const numericUnharmed = Number(element.unharmed)
            const numericInjured = Number(element.injured)
            const numericTransported = Number(element.transported)
            const numericDeceased = Number(element.deceased)

            stationEntry.count += numericCount
            stationEntry.unharmed += numericUnharmed
            stationEntry.injured += numericInjured
            stationEntry.transported += numericTransported
            stationEntry.deceased += numericDeceased

            typeEntry.count += numericCount
        })

        setAgregationByAntaresType(Array.from(typeMap.values()))
    }

    function createStationAggregation() {
        const stationMap = new Map<string, AgregationByStation>()
        const antaresStationMap = new Map<
            string,
            Map<string, SubAgregationAntares>
        >()

        data!.antaresStationAggregationJson.forEach((element) => {
            // Get or create station entry
            const stationKey = element.station_id
            let stationEntry = stationMap.get(stationKey)

            if (!stationEntry) {
                stationEntry = {
                    station_id: element.station_id,
                    station_name: element.station_name,
                    station_abbreviation: element.station_abbreviation,
                    count: 0,
                    unharmed: 0,
                    injured: 0,
                    transported: 0,
                    deceased: 0,
                    antares: [],
                }
                stationMap.set(stationKey, stationEntry)
            }

            // Get or create antares entry
            const antaresKey = element.antares_id
            let antaresEntry = antaresStationMap
                .get(stationKey)
                ?.get(antaresKey)

            // Convert string values to numbers
            const numericCount = Number(element.count)
            const numericUnharmed = Number(element.unharmed)
            const numericInjured = Number(element.injured)
            const numericTransported = Number(element.transported)
            const numericDeceased = Number(element.deceased)

            if (!antaresEntry) {
                antaresEntry = {
                    antares_id: element.antares_id,
                    antares_name: element.antares_name,
                    count: 0,
                }

                if (!antaresStationMap.has(stationKey)) {
                    antaresStationMap.set(stationKey, new Map())
                }
                antaresStationMap.get(stationKey)!.set(antaresKey, antaresEntry)
                stationEntry.antares.push(antaresEntry)
            }

            // Update antares counts
            antaresEntry.count += numericCount

            // Update station counts
            stationEntry.count += numericCount
            stationEntry.unharmed += numericUnharmed
            stationEntry.injured += numericInjured
            stationEntry.transported += numericTransported
            stationEntry.deceased += numericDeceased
        })

        const stationResult = Array.from(stationMap.values())
        setAgregationByStation(stationResult)
    }

    function createMunicipalityAggregation() {
        const municipalityMap = new Map<string, AgregationByMunicipality>()
        const antaresMunicipalityMap = new Map<
            string,
            Map<string, SubAgregationAntares>
        >()

        data!.antaresStationAggregationJson.forEach((element) => {
            // Get or create station entry
            const municipalityKey = element.municipality_origin
            let municipalityEntry = municipalityMap.get(municipalityKey)

            if (!municipalityEntry) {
                municipalityEntry = {
                    municipality_name: element.municipality_origin,
                    count: 0,
                    unharmed: 0,
                    injured: 0,
                    transported: 0,
                    deceased: 0,
                    antares: [],
                }
                municipalityMap.set(municipalityKey, municipalityEntry)
            }

            // Get or create antares entry
            const antaresKey = element.antares_id
            let antaresEntry = antaresMunicipalityMap
                .get(municipalityKey)
                ?.get(antaresKey)

            // Convert string values to numbers
            const numericCount = Number(element.count)
            const numericUnharmed = Number(element.unharmed)
            const numericInjured = Number(element.injured)
            const numericTransported = Number(element.transported)
            const numericDeceased = Number(element.deceased)

            if (!antaresEntry) {
                antaresEntry = {
                    antares_id: element.antares_id,
                    antares_name: element.antares_name,
                    count: 0,
                }

                if (!antaresMunicipalityMap.has(municipalityKey)) {
                    antaresMunicipalityMap.set(municipalityKey, new Map())
                }
                antaresMunicipalityMap
                    .get(municipalityKey)!
                    .set(antaresKey, antaresEntry)
                municipalityEntry.antares.push(antaresEntry)
            }

            // Update antares counts
            antaresEntry.count += numericCount

            // Update station counts
            municipalityEntry.count += numericCount
            municipalityEntry.unharmed += numericUnharmed
            municipalityEntry.injured += numericInjured
            municipalityEntry.transported += numericTransported
            municipalityEntry.deceased += numericDeceased
        })

        const municipalityResult = Array.from(municipalityMap.values())
        setAgregationByMunicipality(municipalityResult)
    }

    function createParishAggregation() {
        const parishMap = new Map<string, AgregationByParish>()
        const antaresParishMap = new Map<
            string,
            Map<string, SubAgregationAntares>
        >()

        data!.antaresStationAggregationJson.forEach((element) => {
            // Get or create station entry
            const ParishKey = element.parish_origin
            let parishEntry = parishMap.get(ParishKey)

            if (!parishEntry) {
                parishEntry = {
                    parish_name: element.parish_origin,
                    count: 0,
                    unharmed: 0,
                    injured: 0,
                    transported: 0,
                    deceased: 0,
                    antares: [],
                }
                parishMap.set(ParishKey, parishEntry)
            }

            // Get or create antares entry
            const antaresKey = element.antares_id
            let antaresEntry = antaresParishMap.get(ParishKey)?.get(antaresKey)

            // Convert string values to numbers
            const numericCount = Number(element.count)
            const numericUnharmed = Number(element.unharmed)
            const numericInjured = Number(element.injured)
            const numericTransported = Number(element.transported)
            const numericDeceased = Number(element.deceased)

            if (!antaresEntry) {
                antaresEntry = {
                    antares_id: element.antares_id,
                    antares_name: element.antares_name,
                    count: 0,
                }

                if (!antaresParishMap.has(ParishKey)) {
                    antaresParishMap.set(ParishKey, new Map())
                }
                antaresParishMap.get(ParishKey)!.set(antaresKey, antaresEntry)
                parishEntry.antares.push(antaresEntry)
            }

            // Update antares counts
            antaresEntry.count += numericCount

            // Update station counts
            parishEntry.count += numericCount
            parishEntry.unharmed += numericUnharmed
            parishEntry.injured += numericInjured
            parishEntry.transported += numericTransported
            parishEntry.deceased += numericDeceased
        })

        const municipalityResult = Array.from(parishMap.values())
        setAgregationByParish(municipalityResult)
    }

    // Helper to get antares type
    function getAntaresType(antaresId: string): string {
        return antaresTypes.find((t) => t.id === antaresId)?.type || 'unknown'
    }

    return (
        <div id={'PrintThis'} className="h-full w-full">
            <PrintLayout
                loading={loading}
                title={`ESTADÍSTICAS POR ${groupBy === 'Antares' ? 'ANTARES' : groupBy === 'Stations' ? 'ESTACIONES' : 'TIPOS DE ANARES'} (CLASIFICACIONES Y ESTACIONES DE BOMBEROS)`}
                subtitle={new Date().toLocaleString('en-GB', {
                    timeZone: 'UTC',
                    hour12: false,
                })}
                filters={filters}
            >
                <>
                    {data && (
                        <>
                            <div className="flex">
                                {groupBy == 'AntaresTypes' && data && (
                                    <div className="pt-4 w-1/2">
                                        <div className="flex justify-center items-center w-full font-semibold text-slate-700 text-xl">
                                            Resumen por tipos de antares
                                        </div>

                                        <div className="flex flex-wrap justify-center gap-x-6 gap-y-4 px-4 w-full pt-4">
                                            {data.antaresTypeAggregationJson.map(
                                                (antares) => (
                                                    <div className="w-fit">
                                                        <div className="w-full text-center space-x-1 bg-[#1C2434] px-4 py-1.5 rounded-t-lg font-semibold text-xs text-white">
                                                            <span>
                                                                {' '}
                                                                {
                                                                    antares.antares_type
                                                                }{' '}
                                                            </span>
                                                            <span>-</span>
                                                            <span>
                                                                {antares.count}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-center items-center space-x-2 px-4 py-2 border border-t-0 rounded-b-lg font-semibold text-sm text-slate-600">
                                                            <span>
                                                                {(
                                                                    (parseInt(
                                                                        antares.count
                                                                    ) /
                                                                        data.antaresStationAggregationCount) *
                                                                    100
                                                                ).toFixed(2)}
                                                                %
                                                            </span>
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                )}

                                {(groupBy == 'Stations' ||
                                    groupBy == 'Antares') &&
                                    data && (
                                        <div className="pt-4 w-1/2">
                                            <div className="flex justify-center items-center w-full font-semibold text-slate-700 text-xl">
                                                Resumen de antares
                                            </div>

                                            <div className="flex flex-wrap justify-center gap-x-6 gap-y-4 px-4 w-full pt-4">
                                                {data.antaresAggregationJson.map(
                                                    (antares) => (
                                                        <div className="w-fit">
                                                            <div className="w-full text-center space-x-1 bg-[#1C2434] px-4 py-1.5 rounded-t-lg font-semibold text-xs text-white">
                                                                <span>
                                                                    ({' '}
                                                                    {
                                                                        antares.antares_id
                                                                    }{' '}
                                                                    {
                                                                        antares.antares_name
                                                                    }{' '}
                                                                    )
                                                                </span>
                                                                <span>-</span>
                                                                <span>
                                                                    {
                                                                        antares.count
                                                                    }
                                                                </span>
                                                            </div>
                                                            <div className="flex justify-center items-center space-x-2 px-4 py-2 border border-t-0 rounded-b-lg font-semibold text-sm text-slate-600">
                                                                <span>
                                                                    {(
                                                                        (parseInt(
                                                                            antares.count
                                                                        ) /
                                                                            data.antaresAggregationCount) *
                                                                        100
                                                                    ).toFixed(
                                                                        2
                                                                    )}
                                                                    %
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )}

                                {groupBy == 'Municipality' && data && (
                                    <div className="pt-4 w-1/2">
                                        <div className="flex justify-center items-center w-full font-semibold text-slate-700 text-xl">
                                            Resumen de Municipios
                                        </div>

                                        <div className="flex flex-wrap justify-center gap-x-6 gap-y-4 px-4 w-full pt-4">
                                            {data.municipalityAggregationJson.map(
                                                (antares) => (
                                                    <div className="w-fit">
                                                        <div className="w-full text-center space-x-1 bg-[#1C2434] px-4 py-1.5 rounded-t-lg font-semibold text-xs text-white">
                                                            <span>
                                                                ({' '}
                                                                {
                                                                    antares.municipality_origin
                                                                }
                                                                )
                                                            </span>
                                                            <span>-</span>
                                                            <span>
                                                                {antares.count}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-center items-center space-x-2 px-4 py-2 border border-t-0 rounded-b-lg font-semibold text-sm text-slate-600">
                                                            <span>
                                                                {(
                                                                    (parseInt(
                                                                        antares.count
                                                                    ) /
                                                                        data.municipalityAggregationCount) *
                                                                    100
                                                                ).toFixed(2)}
                                                                %
                                                            </span>
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                )}

                                {groupBy == 'Parish' && data && (
                                    <div className="pt-4 w-1/2">
                                        <div className="flex justify-center items-center w-full font-semibold text-slate-700 text-xl">
                                            Resumen de Parroquias
                                        </div>

                                        <div className="flex flex-wrap justify-center gap-x-6 gap-y-4 px-4 w-full pt-4">
                                            {data.parishAggregationJson.map(
                                                (antares) => (
                                                    <div className="w-fit">
                                                        <div className="w-full text-center space-x-1 bg-[#1C2434] px-4 py-1.5 rounded-t-lg font-semibold text-xs text-white">
                                                            <span>
                                                                ({' '}
                                                                {
                                                                    antares.parish_origin
                                                                }
                                                                )
                                                            </span>
                                                            <span>-</span>
                                                            <span>
                                                                {antares.count}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-center items-center space-x-2 px-4 py-2 border border-t-0 rounded-b-lg font-semibold text-sm text-slate-600">
                                                            <span>
                                                                {(
                                                                    (parseInt(
                                                                        antares.count
                                                                    ) /
                                                                        data.parishAggregationCount) *
                                                                    100
                                                                ).toFixed(2)}
                                                                %
                                                            </span>
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="pt-4 w-1/2">
                                    <div className="flex justify-center items-center w-full font-semibold text-slate-700 text-xl">
                                        Resumen de Estaciones
                                    </div>

                                    <div className="flex flex-wrap justify-center gap-x-6 gap-y-4 px-4 w-full pt-4">
                                        {data.stationAggregationJson.map(
                                            (station) => (
                                                <div className="w-fit">
                                                    <div className="w-full text-center space-x-1 bg-[#1C2434] px-6 py-1.5 rounded-t-lg font-semibold text-xs text-white">
                                                        <span>
                                                            {
                                                                station.station_abbreviation
                                                            }{' '}
                                                            ({' '}
                                                            {
                                                                station.station_name
                                                            }{' '}
                                                            )
                                                        </span>
                                                        <span>-</span>
                                                        <span>
                                                            {station.count}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-center items-center space-x-2 px-4 py-2 border border-t-0 rounded-b-lg font-semibold text-sm text-slate-600">
                                                        <span>
                                                            {(
                                                                (parseInt(
                                                                    station.count
                                                                ) /
                                                                    data.stationAggregationCount) *
                                                                100
                                                            ).toFixed(2)}
                                                            %
                                                        </span>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>

                            {groupBy == 'Antares' && agregationByAntares && (
                                <div className="space-y-4 pt-8">
                                    <div className="flex items-center pl-4 w-full font-semibold text-slate-700 text-xl">
                                        Detalles por Antares
                                    </div>

                                    <div className="space-y-8">
                                        {agregationByAntares
                                            .sort((a, b) => b.count - a.count)
                                            .map((antares) => (
                                                <div>
                                                    <div className="bg-[#1C2434] px-6 py-2 rounded-t-lg font-semibold text-white text-xl">
                                                        Antares{' '}
                                                        {antares.antares_id} ({' '}
                                                        {antares.antares_name} )
                                                        - {antares.count}{' '}
                                                        Servicios
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
                                                            {antares.stations.map(
                                                                (
                                                                    stationDetail
                                                                ) => (
                                                                    <tr className="border-t">
                                                                        <td className="py-2 text-sm">
                                                                            {
                                                                                stationDetail.station_abbreviation
                                                                            }{' '}
                                                                            - ({' '}
                                                                            {
                                                                                stationDetail.station_name
                                                                            }{' '}
                                                                            )
                                                                        </td>
                                                                        <td className="py-2 text-center text-sm">
                                                                            {
                                                                                stationDetail.count
                                                                            }
                                                                        </td>
                                                                        <td className="py-2 text-center text-sm">
                                                                            {
                                                                                stationDetail.unharmed
                                                                            }
                                                                        </td>
                                                                        <td className="py-2 text-center text-sm">
                                                                            {
                                                                                stationDetail.injured
                                                                            }
                                                                        </td>
                                                                        <td className="py-2 text-center text-sm">
                                                                            {
                                                                                stationDetail.transported
                                                                            }
                                                                        </td>
                                                                        <td className="py-2 text-center text-sm">
                                                                            {
                                                                                stationDetail.deceased
                                                                            }
                                                                        </td>
                                                                        <td className="py-2 text-center text-sm">
                                                                            {(
                                                                                (stationDetail.count /
                                                                                    data.antaresAggregationCount) *
                                                                                100
                                                                            ).toFixed(
                                                                                2
                                                                            )}
                                                                            %
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            )}

                                                            <tr className="border-t font-semibold">
                                                                <td className="py-2">
                                                                    Total
                                                                </td>
                                                                <td className="py-2 text-center text-sm">
                                                                    {
                                                                        antares.count
                                                                    }
                                                                </td>
                                                                <td className="py-2 text-center text-sm">
                                                                    {antares.stations.reduce(
                                                                        (
                                                                            sum,
                                                                            station
                                                                        ) =>
                                                                            sum +
                                                                            station.unharmed,
                                                                        0
                                                                    )}
                                                                </td>
                                                                <td className="py-2 text-center text-sm">
                                                                    {antares.stations.reduce(
                                                                        (
                                                                            sum,
                                                                            station
                                                                        ) =>
                                                                            sum +
                                                                            station.injured,
                                                                        0
                                                                    )}
                                                                </td>
                                                                <td className="py-2 text-center text-sm">
                                                                    {antares.stations.reduce(
                                                                        (
                                                                            sum,
                                                                            station
                                                                        ) =>
                                                                            sum +
                                                                            station.transported,
                                                                        0
                                                                    )}
                                                                </td>
                                                                <td className="py-2 text-center text-sm">
                                                                    {antares.stations.reduce(
                                                                        (
                                                                            sum,
                                                                            station
                                                                        ) =>
                                                                            sum +
                                                                            station.deceased,
                                                                        0
                                                                    )}
                                                                </td>
                                                                <td className="py-2 text-center text-sm">
                                                                    {(
                                                                        (antares.count /
                                                                            data.antaresAggregationCount) *
                                                                        100
                                                                    ).toFixed(
                                                                        2
                                                                    )}
                                                                    %
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            )}

                            {groupBy == 'AntaresTypes' &&
                                agregationByAntaresType && (
                                    <div className="space-y-4 pt-8">
                                        <div className="flex items-center pl-4 w-full font-semibold text-slate-700 text-xl">
                                            Detalles por Tipos de Antares
                                        </div>

                                        <div className="space-y-8">
                                            {agregationByAntaresType
                                                .sort(
                                                    (a, b) => b.count - a.count
                                                )
                                                .map((antaresType) => (
                                                    <div>
                                                        <div className="bg-[#1C2434] px-6 py-2 rounded-t-lg font-semibold text-white text-xl">
                                                            {
                                                                antaresType.antares_type
                                                            }{' '}
                                                            -{' '}
                                                            {antaresType.count}{' '}
                                                            Servicios
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
                                                                {antaresType.stations.map(
                                                                    (
                                                                        stationDetail
                                                                    ) => (
                                                                        <tr className="border-t">
                                                                            <td className="py-2 text-sm">
                                                                                {
                                                                                    stationDetail.station_abbreviation
                                                                                }{' '}
                                                                                -
                                                                                ({' '}
                                                                                {
                                                                                    stationDetail.station_name
                                                                                }{' '}
                                                                                )
                                                                            </td>
                                                                            <td className="py-2 text-center text-sm">
                                                                                {
                                                                                    stationDetail.count
                                                                                }
                                                                            </td>
                                                                            <td className="py-2 text-center text-sm">
                                                                                {
                                                                                    stationDetail.unharmed
                                                                                }
                                                                            </td>
                                                                            <td className="py-2 text-center text-sm">
                                                                                {
                                                                                    stationDetail.injured
                                                                                }
                                                                            </td>
                                                                            <td className="py-2 text-center text-sm">
                                                                                {
                                                                                    stationDetail.transported
                                                                                }
                                                                            </td>
                                                                            <td className="py-2 text-center text-sm">
                                                                                {
                                                                                    stationDetail.deceased
                                                                                }
                                                                            </td>
                                                                            <td className="py-2 text-center text-sm">
                                                                                {(
                                                                                    (stationDetail.count /
                                                                                        data.antaresTypeAggregationCount) *
                                                                                    100
                                                                                ).toFixed(
                                                                                    2
                                                                                )}

                                                                                %
                                                                            </td>
                                                                        </tr>
                                                                    )
                                                                )}

                                                                <tr className="border-t font-semibold">
                                                                    <td className="py-2">
                                                                        Total
                                                                    </td>
                                                                    <td className="py-2 text-center text-sm">
                                                                        {
                                                                            antaresType.count
                                                                        }
                                                                    </td>
                                                                    <td className="py-2 text-center text-sm">
                                                                        {antaresType.stations.reduce(
                                                                            (
                                                                                sum,
                                                                                station
                                                                            ) =>
                                                                                sum +
                                                                                station.unharmed,
                                                                            0
                                                                        )}
                                                                    </td>
                                                                    <td className="py-2 text-center text-sm">
                                                                        {antaresType.stations.reduce(
                                                                            (
                                                                                sum,
                                                                                station
                                                                            ) =>
                                                                                sum +
                                                                                station.injured,
                                                                            0
                                                                        )}
                                                                    </td>
                                                                    <td className="py-2 text-center text-sm">
                                                                        {antaresType.stations.reduce(
                                                                            (
                                                                                sum,
                                                                                station
                                                                            ) =>
                                                                                sum +
                                                                                station.transported,
                                                                            0
                                                                        )}
                                                                    </td>
                                                                    <td className="py-2 text-center text-sm">
                                                                        {antaresType.stations.reduce(
                                                                            (
                                                                                sum,
                                                                                station
                                                                            ) =>
                                                                                sum +
                                                                                station.deceased,
                                                                            0
                                                                        )}
                                                                    </td>
                                                                    <td className="py-2 text-center text-sm">
                                                                        {(
                                                                            (antaresType.count /
                                                                                data.antaresTypeAggregationCount) *
                                                                            100
                                                                        ).toFixed(
                                                                            2
                                                                        )}
                                                                        %
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                )}

                            {groupBy == 'Stations' && agregationByStation && (
                                <div className="space-y-4 pt-8">
                                    <div className="flex items-center pl-4 w-full font-semibold text-slate-700 text-xl">
                                        Detalles por Estación
                                    </div>

                                    <div className="space-y-8">
                                        {agregationByStation
                                            .sort((a, b) => b.count - a.count)
                                            .map((station) => (
                                                <div>
                                                    <div className="bg-[#1C2434] px-6 py-2 rounded-t-lg font-semibold text-white text-xl">
                                                        Estación{' '}
                                                        {
                                                            station.station_abbreviation
                                                        }{' '}
                                                        ( {station.station_name}{' '}
                                                        ) - {station.count}{' '}
                                                        Servicios
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
                                                            {station.antares.map(
                                                                (
                                                                    antaresDetail
                                                                ) => {
                                                                    // Calculate victim counts for this antares in this station
                                                                    const antaresStationData =
                                                                        data!.antaresStationAggregationJson.find(
                                                                            (
                                                                                item
                                                                            ) =>
                                                                                item.antares_id ===
                                                                                    antaresDetail.antares_id &&
                                                                                item.station_id ===
                                                                                    station.station_id
                                                                        )

                                                                    // Get victim counts from the data
                                                                    const unharmed =
                                                                        antaresStationData
                                                                            ? Number(
                                                                                  antaresStationData.unharmed
                                                                              )
                                                                            : 0
                                                                    const injured =
                                                                        antaresStationData
                                                                            ? Number(
                                                                                  antaresStationData.injured
                                                                              )
                                                                            : 0
                                                                    const transported =
                                                                        antaresStationData
                                                                            ? Number(
                                                                                  antaresStationData.transported
                                                                              )
                                                                            : 0
                                                                    const deceased =
                                                                        antaresStationData
                                                                            ? Number(
                                                                                  antaresStationData.deceased
                                                                              )
                                                                            : 0

                                                                    return (
                                                                        <tr className="border-t">
                                                                            <td className="py-2 text-sm">
                                                                                {
                                                                                    antaresDetail.antares_id
                                                                                }{' '}
                                                                                -{' '}
                                                                                {
                                                                                    antaresDetail.antares_name
                                                                                }
                                                                            </td>
                                                                            <td className="py-2 text-center text-sm">
                                                                                {
                                                                                    antaresDetail.count
                                                                                }
                                                                            </td>
                                                                            <td className="py-2 text-center text-sm">
                                                                                {
                                                                                    unharmed
                                                                                }
                                                                            </td>
                                                                            <td className="py-2 text-center text-sm">
                                                                                {
                                                                                    injured
                                                                                }
                                                                            </td>
                                                                            <td className="py-2 text-center text-sm">
                                                                                {
                                                                                    transported
                                                                                }
                                                                            </td>
                                                                            <td className="py-2 text-center text-sm">
                                                                                {
                                                                                    deceased
                                                                                }
                                                                            </td>
                                                                            <td className="py-2 text-center text-sm">
                                                                                {(
                                                                                    (antaresDetail.count /
                                                                                        data.stationAggregationCount) *
                                                                                    100
                                                                                ).toFixed(
                                                                                    2
                                                                                )}

                                                                                %
                                                                            </td>
                                                                        </tr>
                                                                    )
                                                                }
                                                            )}

                                                            <tr className="border-t font-semibold">
                                                                <td className="py-2">
                                                                    Total
                                                                </td>
                                                                <td className="py-2 text-center text-sm">
                                                                    {
                                                                        station.count
                                                                    }
                                                                </td>
                                                                <td className="py-2 text-center text-sm">
                                                                    {
                                                                        station.unharmed
                                                                    }
                                                                </td>
                                                                <td className="py-2 text-center text-sm">
                                                                    {
                                                                        station.injured
                                                                    }
                                                                </td>
                                                                <td className="py-2 text-center text-sm">
                                                                    {
                                                                        station.transported
                                                                    }
                                                                </td>
                                                                <td className="py-2 text-center text-sm">
                                                                    {
                                                                        station.deceased
                                                                    }
                                                                </td>
                                                                <td className="py-2 text-center text-sm">
                                                                    {(
                                                                        (station.count /
                                                                            data.stationAggregationCount) *
                                                                        100
                                                                    ).toFixed(
                                                                        2
                                                                    )}
                                                                    %
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            )}

                            {groupBy == 'Municipality' &&
                                AgregationByMunicipality && (
                                    <div className="space-y-4 pt-8">
                                        <div className="flex items-center pl-4 w-full font-semibold text-slate-700 text-xl">
                                            Detalles por Municipio
                                        </div>

                                        <div className="space-y-8">
                                            {AgregationByMunicipality.sort(
                                                (a, b) => b.count - a.count
                                            ).map((municipality) => (
                                                <div>
                                                    <div className="bg-[#1C2434] px-6 py-2 rounded-t-lg font-semibold text-white text-xl">
                                                        Municipio{' '}
                                                        {
                                                            municipality.municipality_name
                                                        }{' '}
                                                        - {municipality.count}{' '}
                                                        Servicios
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
                                                            {municipality.antares.map(
                                                                (
                                                                    antaresDetail
                                                                ) => {
                                                                    // Calculate victim counts for this antares in this station
                                                                    const antaresMunicipalityData =
                                                                        data!.antaresStationAggregationJson.filter(
                                                                            (
                                                                                item
                                                                            ) =>
                                                                                item.antares_id ===
                                                                                    antaresDetail.antares_id &&
                                                                                item.municipality_origin ===
                                                                                    municipality.municipality_name
                                                                        )

                                                                    // Calculate totals from all matching records
                                                                    let unharmed = 0
                                                                    let injured = 0
                                                                    let transported = 0
                                                                    let deceased = 0

                                                                    antaresMunicipalityData.forEach(
                                                                        (
                                                                            item
                                                                        ) => {
                                                                            unharmed +=
                                                                                Number(
                                                                                    item.unharmed
                                                                                )
                                                                            injured +=
                                                                                Number(
                                                                                    item.injured
                                                                                )
                                                                            transported +=
                                                                                Number(
                                                                                    item.transported
                                                                                )
                                                                            deceased +=
                                                                                Number(
                                                                                    item.deceased
                                                                                )
                                                                        }
                                                                    )

                                                                    return (
                                                                        <tr className="border-t">
                                                                            <td className="py-2 text-sm">
                                                                                {
                                                                                    antaresDetail.antares_id
                                                                                }{' '}
                                                                                -{' '}
                                                                                {
                                                                                    antaresDetail.antares_name
                                                                                }
                                                                            </td>
                                                                            <td className="py-2 text-center text-sm">
                                                                                {
                                                                                    antaresDetail.count
                                                                                }
                                                                            </td>
                                                                            <td className="py-2 text-center text-sm">
                                                                                {
                                                                                    unharmed
                                                                                }
                                                                            </td>
                                                                            <td className="py-2 text-center text-sm">
                                                                                {
                                                                                    injured
                                                                                }
                                                                            </td>
                                                                            <td className="py-2 text-center text-sm">
                                                                                {
                                                                                    transported
                                                                                }
                                                                            </td>
                                                                            <td className="py-2 text-center text-sm">
                                                                                {
                                                                                    deceased
                                                                                }
                                                                            </td>
                                                                            <td className="py-2 text-center text-sm">
                                                                                {(
                                                                                    (antaresDetail.count /
                                                                                        data.municipalityAggregationCount) *
                                                                                    100
                                                                                ).toFixed(
                                                                                    2
                                                                                )}

                                                                                %
                                                                            </td>
                                                                        </tr>
                                                                    )
                                                                }
                                                            )}

                                                            <tr className="border-t font-semibold">
                                                                <td className="py-2">
                                                                    Total
                                                                </td>
                                                                <td className="py-2 text-center text-sm">
                                                                    {
                                                                        municipality.count
                                                                    }
                                                                </td>
                                                                <td className="py-2 text-center text-sm">
                                                                    {
                                                                        municipality.unharmed
                                                                    }
                                                                </td>
                                                                <td className="py-2 text-center text-sm">
                                                                    {
                                                                        municipality.injured
                                                                    }
                                                                </td>
                                                                <td className="py-2 text-center text-sm">
                                                                    {
                                                                        municipality.transported
                                                                    }
                                                                </td>
                                                                <td className="py-2 text-center text-sm">
                                                                    {
                                                                        municipality.deceased
                                                                    }
                                                                </td>
                                                                <td className="py-2 text-center text-sm">
                                                                    {(
                                                                        (municipality.count /
                                                                            data.municipalityAggregationCount) *
                                                                        100
                                                                    ).toFixed(
                                                                        2
                                                                    )}
                                                                    %
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                            {groupBy == 'Parish' && AgregationByParish && (
                                <div className="space-y-4 pt-8">
                                    <div className="flex items-center pl-4 w-full font-semibold text-slate-700 text-xl">
                                        Detalles por Parroquia
                                    </div>

                                    <div className="space-y-8">
                                        {AgregationByParish.sort(
                                            (a, b) => b.count - a.count
                                        ).map((parish) => (
                                            <div>
                                                <div className="bg-[#1C2434] px-6 py-2 rounded-t-lg font-semibold text-white text-xl">
                                                    Parroquia{' '}
                                                    {parish.parish_name} -{' '}
                                                    {parish.count} Servicios
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
                                                        {parish.antares.map(
                                                            (antaresDetail) => {
                                                                // Calculate victim counts for this antares in this station
                                                                const antaresParishData =
                                                                    data!.antaresStationAggregationJson.filter(
                                                                        (
                                                                            item
                                                                        ) =>
                                                                            item.antares_id ===
                                                                                antaresDetail.antares_id &&
                                                                            item.parish_origin ===
                                                                                parish.parish_name
                                                                    )

                                                                // Calculate totals from all matching records
                                                                let unharmed = 0
                                                                let injured = 0
                                                                let transported = 0
                                                                let deceased = 0

                                                                antaresParishData.forEach(
                                                                    (item) => {
                                                                        unharmed +=
                                                                            Number(
                                                                                item.unharmed
                                                                            )
                                                                        injured +=
                                                                            Number(
                                                                                item.injured
                                                                            )
                                                                        transported +=
                                                                            Number(
                                                                                item.transported
                                                                            )
                                                                        deceased +=
                                                                            Number(
                                                                                item.deceased
                                                                            )
                                                                    }
                                                                )

                                                                return (
                                                                    <tr className="border-t">
                                                                        <td className="py-2 text-sm">
                                                                            {
                                                                                antaresDetail.antares_id
                                                                            }{' '}
                                                                            -{' '}
                                                                            {
                                                                                antaresDetail.antares_name
                                                                            }
                                                                        </td>
                                                                        <td className="py-2 text-center text-sm">
                                                                            {
                                                                                antaresDetail.count
                                                                            }
                                                                        </td>
                                                                        <td className="py-2 text-center text-sm">
                                                                            {
                                                                                unharmed
                                                                            }
                                                                        </td>
                                                                        <td className="py-2 text-center text-sm">
                                                                            {
                                                                                injured
                                                                            }
                                                                        </td>
                                                                        <td className="py-2 text-center text-sm">
                                                                            {
                                                                                transported
                                                                            }
                                                                        </td>
                                                                        <td className="py-2 text-center text-sm">
                                                                            {
                                                                                deceased
                                                                            }
                                                                        </td>
                                                                        <td className="py-2 text-center text-sm">
                                                                            {(
                                                                                (antaresDetail.count /
                                                                                    data.parishAggregationCount) *
                                                                                100
                                                                            ).toFixed(
                                                                                2
                                                                            )}
                                                                            %
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            }
                                                        )}

                                                        <tr className="border-t font-semibold">
                                                            <td className="py-2">
                                                                Total
                                                            </td>
                                                            <td className="py-2 text-center text-sm">
                                                                {parish.count}
                                                            </td>
                                                            <td className="py-2 text-center text-sm">
                                                                {
                                                                    parish.unharmed
                                                                }
                                                            </td>
                                                            <td className="py-2 text-center text-sm">
                                                                {parish.injured}
                                                            </td>
                                                            <td className="py-2 text-center text-sm">
                                                                {
                                                                    parish.transported
                                                                }
                                                            </td>
                                                            <td className="py-2 text-center text-sm">
                                                                {
                                                                    parish.deceased
                                                                }
                                                            </td>
                                                            <td className="py-2 text-center text-sm">
                                                                {(
                                                                    (parish.count /
                                                                        data.parishAggregationCount) *
                                                                    100
                                                                ).toFixed(2)}
                                                                %
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
                    )}
                </>
            </PrintLayout>
        </div>
    )
}
