import React, { useEffect, useState } from 'react'
import { useAntaresCollection } from '../../../../domain/models/mission/antares/use_collection'
import { useStationCollection } from '../../../../domain/models/mission/station/use_collection'
import Overlay from '../../../core/overlay/overlay'
import { post } from '../../../../services/http'

interface NewsSummaryPrintProps {
    missionsIds: string[]
    filters: { name: string; value: string }[]
}

// Define structure to match hierarchical response
interface MissionSummary {
    id: string | number
    code: string // Using code directly from response
    antaresId: string
    stationId: string
    date: string
    isImportant: boolean
    cancelReason: string
    serviceLocation?: string
    first_service_id?: string
    first_service_antares_description?: string
}

export function NewsSummaryPrint({
    missionsIds,
    filters,
}: NewsSummaryPrintProps) {
    const [stationCollection] = useStationCollection()
    const [antaresCollection] = useAntaresCollection()

    const [services, setServices] = useState<MissionSummary[]>([])
    const [servicesByAntares, setServicesByAntares] = useState<
        { antaresId: string; antaresDescription: string; count: number }[]
    >([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        getServices(missionsIds)
    }, [])

    async function getServices(missionIds: string[]) {
        try {
            setLoading(true)

            // Use the hierarchical endpoint from RelevantServicesReportPrint
            const hierarchicalData = await post<{ regions: any[] }>(
                'mission-reports/hierarchical/in',
                missionIds
            )

            if (hierarchicalData.success && hierarchicalData.result) {
                // Process hierarchical data to extract mission information
                const processedServices: MissionSummary[] = []

                hierarchicalData.result.regions.forEach((region) => {
                    region.stations.forEach((station) => {
                        station.missions.forEach((mission) => {
                            // Extract location information
                            const locationInfo = formatLocation(
                                mission.origin_location
                            )

                            processedServices.push({
                                id: mission.id,
                                code: mission.code || '', // Use code directly from response
                                antaresId: mission.first_service_id || '',
                                first_service_id:
                                    mission.first_service_id || '',
                                first_service_antares_description:
                                    mission.first_service_antares_description ||
                                    '',
                                stationId: station.station_id || '',
                                date: mission.date || '',
                                isImportant: !!mission.is_important,
                                cancelReason: mission.cancel_reason || '',
                                serviceLocation: locationInfo,
                            })
                        })
                    })
                })

                console.log('Processed services:', processedServices)
                setServices(processedServices)

                // Calculate services by antares
                const antaresCounts =
                    calculateServicesByAntares(processedServices)
                console.log('Antares counts:', antaresCounts)
                setServicesByAntares(
                    antaresCounts.sort((a, b) => b.count - a.count)
                )
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    // Helper to format location from hierarchical data
    function formatLocation(location: any): string {
        if (!location) return ''

        // Check if location is an array
        if (Array.isArray(location) && location.length > 0) {
            location = location[0]
        }

        return `${location.address ? `${location.address}, ` : ''}${location.urbanization ? `URBANIZACIÓN: ${location.urbanization}, ` : ''}${location.sector ? `SECTOR: ${location.sector}, ` : ''}${location.parish ? `PARROQUIA: ${location.parish}, ` : ''}${location.municipality ? `MUNICIPIO: ${location.municipality}, ` : ''}${location.state ? `ESTADO: ${location.state}` : ''}`
            .trim()
            .replace(/,\s*$/, '')
    }

    // Modified function to group by antares description
    function calculateServicesByAntares(
        services: MissionSummary[]
    ): { antaresId: string; antaresDescription: string; count: number }[] {
        // Map to track counts by description rather than ID
        const antaresDescriptionCountMap = new Map<string, number>()
        const antaresDescriptionToId = new Map<string, string>()

        // Count services by antaresId but group by description
        services.forEach((service) => {
            if (!service.cancelReason) {
                const antaresId = service.first_service_id || service.antaresId
                if (antaresId) {
                    // Get description
                    const antaresItem = antaresCollection.find(
                        (a) => a.id === antaresId
                    )
                    const description =
                        antaresItem?.description ||
                        service.first_service_antares_description ||
                        `Antares ${antaresId}`

                    // Store the description for this ID
                    antaresDescriptionToId.set(description, antaresId)

                    // Increment count for this description
                    antaresDescriptionCountMap.set(
                        description,
                        (antaresDescriptionCountMap.get(description) || 0) + 1
                    )
                }
            }
        })

        // Create result with grouped descriptions
        const result: {
            antaresId: string
            antaresDescription: string
            count: number
        }[] = []

        // Add counts from map
        antaresDescriptionCountMap.forEach((count, description) => {
            result.push({
                antaresId: antaresDescriptionToId.get(description) || '',
                antaresDescription: description,
                count,
            })
        })

        return result
    }

    function getServicesByAntares(
        services: MissionSummary[]
    ): { antaresId: string; antaresDescription: string; count: number }[] {
        return calculateServicesByAntares(services)
    }

    function getCanceledServicesCount(services: MissionSummary[]): number {
        return services.filter((service) => !!service.cancelReason).length
    }

    function getServicesByCancelReason(
        services: MissionSummary[]
    ): { antaresId: string; antaresDescription: string; count: number }[] {
        const cancelServices = services.filter(
            (service) => !!service.cancelReason
        )
        const cancelReasons: string[] = [
            ...new Set(cancelServices.map((service) => service.cancelReason)),
        ]

        if (cancelReasons.length < 1) return []
        return cancelReasons.map((cancelReason) => ({
            antaresId: '-1',
            antaresDescription: cancelReason,
            count: cancelServices.filter(
                (service) => service.cancelReason === cancelReason
            ).length,
        }))
    }

    // Safely extract code from mission
    function getMissionCode(mission: MissionSummary): string {
        if (mission.code && typeof mission.code === 'string') {
            const parts = mission.code.split('-')
            return parts[0] || ''
        }
        return String(mission.id || '')
    }

    return (
        <div className="relative min-h-[20rem] h-full w-full bg-white">
            {loading ? (
                <Overlay background={''} isVisible={true} type={'Loader'} />
            ) : (
                <>
                    <div className="font-semibold">
                        DIRECCIÓN GENERAL NACIONAL DE BOMBEROS
                    </div>
                    <div className="font-semibold">
                        REDAN CAPITAL - ZOEDAN MIRANDA
                    </div>

                    {filters && (
                        <>
                            <div className="py-2">
                                -------------------------------------------------------------------------
                            </div>
                            <div className="font-semibold pb-2">FILTROS</div>

                            {filters.map((filter, idx) => (
                                <div key={idx}>
                                    {filter.name}:{' '}
                                    <span className="font-semibold px-2 text-slate-700">
                                        {' '}
                                        {filter.value}{' '}
                                    </span>
                                </div>
                            ))}
                        </>
                    )}

                    <div className="py-2">
                        -------------------------------------------------------------------------
                    </div>
                    <div className="font-semibold">RESUMEN DE NOVEDADES</div>
                    <div className="py-2">
                        -------------------------------------------------------------------------
                    </div>
                    <div className="font-semibold">
                        EVENTOS DE IMPORTANCIA:{' '}
                        <span className="font-normal">
                            {services.filter((x) => x.isImportant).length}
                        </span>
                    </div>

                    {services
                        .filter((x) => x.isImportant && !x.cancelReason)
                        .map((importantService, idx) => (
                            <div className="pt-8" key={idx}>
                                <div className="font-semibold">
                                    EVENTO:{' '}
                                    <span className="font-normal">
                                        {importantService.first_service_id} -{' '}
                                        {importantService.first_service_antares_description ||
                                            antaresCollection.find(
                                                (x) =>
                                                    x.id ===
                                                    importantService.first_service_id
                                            )?.description ||
                                            ''}
                                    </span>
                                </div>
                                <div className="font-semibold">
                                    HORA:{' '}
                                    <span className="font-normal">
                                        {importantService.date}
                                    </span>
                                </div>
                                <div className="font-semibold">
                                    CÓDIGO:{' '}
                                    <span className="font-normal">
                                        {getMissionCode(importantService)}
                                    </span>
                                </div>
                                <div className="font-semibold">
                                    ESTACIÓN:{' '}
                                    <span className="font-normal">
                                        {stationCollection.find(
                                            (x) =>
                                                x.id ===
                                                importantService.stationId
                                        )?.abbreviation || ''}{' '}
                                        -{' '}
                                        {stationCollection.find(
                                            (x) =>
                                                x.id ===
                                                importantService.stationId
                                        )?.name || ''}
                                    </span>
                                </div>
                                <div className="font-semibold">
                                    DIRECCIÓN:{' '}
                                    <span className="font-normal">
                                        {importantService.serviceLocation}
                                    </span>
                                </div>
                            </div>
                        ))}

                    <div className="py-2">
                        -------------------------------------------------------------------------
                    </div>

                    <div className="font-semibold">
                        Total Servicios Efectuados:{' '}
                        <span className="font-normal">
                            {services.length -
                                getCanceledServicesCount(services)}
                        </span>
                    </div>

                    <div className="pt-8">
                        {services.filter(
                            (x) => !x.first_service_id && !x.antaresId
                        ).length > 0 && (
                            <>
                                <div className="font-semibold">
                                    {
                                        services.filter(
                                            (x) =>
                                                !x.first_service_id &&
                                                !x.antaresId
                                        ).length
                                    }
                                    <span className="font-normal">
                                        {' '}
                                        - SERVICIOS SIN ANTARES
                                    </span>
                                </div>
                            </>
                        )}
                        {servicesByAntares
                            .sort((a, b) => b.count - a.count)
                            .map((antares, idx) => (
                                <React.Fragment key={idx}>
                                    {antares.count > 0 && (
                                        <div className="font-semibold">
                                            {antares.count}
                                            <span className="font-normal">
                                                {' '}
                                                - {antares.antaresDescription}
                                            </span>
                                        </div>
                                    )}
                                </React.Fragment>
                            ))}
                    </div>

                    <div className="py-2">
                        -------------------------------------------------------------------------
                    </div>

                    <div className="font-semibold">
                        Servicios Cancelados:{' '}
                        <span className="font-normal">
                            {getCanceledServicesCount(services)}
                        </span>
                    </div>

                    <div className="pt-8">
                        {getServicesByCancelReason(services)
                            .sort((a, b) => b.count - a.count)
                            .map((antares, idx) => (
                                <React.Fragment key={idx}>
                                    {antares.count > 0 && (
                                        <div className="font-semibold">
                                            {antares.count}
                                            <span className="font-normal">
                                                {' '}
                                                - {antares.antaresDescription}
                                            </span>
                                        </div>
                                    )}
                                </React.Fragment>
                            ))}
                    </div>

                    <div className="py-2">
                        -------------------------------------------------------------------------
                    </div>
                    <div className="">CENTRO DE OPERACIONES DE EMERGENCIA</div>
                    <div className="">TELÉFONO: 0414-9254769</div>
                    <div className="">GENERAL (B). LAURA GERARDI</div>
                    <div className="">DIRECTORA-PRESIDENTE</div>
                </>
            )}
        </div>
    )
}
