import React, { useState } from "react";

import { PrintLayout } from "./PrintLayout";
import { TService } from "../../../../domain/models/service/service";
import { useCollection } from "../../../core/hooks/useCollection";
import { AntaresFromApi } from "../../../../domain/models/antares/antares";
import { StationSchemaBasicDataType } from "../../../../domain/models/stations/station";
import { missionCrud, TMission } from "../../../../domain/models/mission/mission";
import { TRelevantServiceDetail } from "../../../../domain/models/service/relevant_service_detail";

function getServiceData(services: TService[]): {
    stationsDetail: StationsDetail[]
} {
    const stationsDetail = detailByStation(services)

    return { stationsDetail }
}

type StationsDetail = {
    stationId: string
    details: TService[]
}
function detailByStation(services: TService[]): StationsDetail[] {
    const stationDetail: StationsDetail[] = []
    let servicesCount = 0

    services.forEach((service) => {
        const antaresId = service.antaresId
        const stationId = service.stationId
        const stationItem = stationDetail.find(
            (item) => item.stationId === stationId
        )

        if (stationItem) {
            stationItem.details.push(service)
        } else if (stationId && antaresId) {
            stationDetail.push({
                stationId,
                details: [
                    service
                ]
            })
        }

        servicesCount++
    })

    return stationDetail
}

interface ServicePrintProps {
    services: TService[]
    missions: TMission[]
}


export function RelevantServicesReportPrint({ services, missions }: ServicePrintProps) {
    const antaresCollection = useCollection('mission/antares', AntaresFromApi)
    const stationCollection = useCollection('station', (data: StationSchemaBasicDataType) => {
        return { success: true, result: data }
    })
    const { stationsDetail } = getServiceData(services);

    function getMissionFrom(id: string): TMission | undefined {
        const station = missions.filter(x => x.id == id)[0]
        if (station) return station
        return undefined
    }

    function getAntaresDescriptionFor(id: string): string {
        const antares = antaresCollection.filter(x => x.id == id)[0]
        if (antares) return antares.description
        return ""
    }

    function getStationDescriptionFor(id: string) {
        const station = stationCollection.filter(x => x.id == id)[0]
        if (station) return station.description
        return ""
    }

    function getStationNameFor(id: string) {
        const station = stationCollection.filter(x => x.id == id)[0]
        if (station) return station.name
        return ""
    }

    let relevantServices: TRelevantServiceDetail[] = []


    return <PrintLayout title={"INFORME DE SERVICIOS RELEVANTES POR REGIONES OPERATIVAS"} subtitle={"12/05/2024 00:00:00 - 12/05/2024 12:00:00"}>
        <div className="text-sm">
            {relevantServices.map(relevantService => (
                relevantService && <div>

                    {relevantService.stations.map(station => (
                        <>
                            <span className="font-semibold text-[#1C2434]"><span>ESTACIÓN N°{station.abbreviation.replace("M", "")} : {station.abbreviation}</span> ( {station.name?.toUpperCase()} )</span>

                            {station.services.map(service => (
                                <>
                                    <div className="flex justify-between pt-2">
                                        <div>
                                            <span>FECHA:</span>
                                            <span className="font-semibold">{service.serviceDate?.split(" ")[0] ?? ""}</span>
                                        </div>

                                        <div>
                                            <span>HORA:</span>
                                            <span className="font-semibold">{service.serviceDate?.split(" ")[1] ?? ""}</span>
                                        </div>

                                        <div>
                                            <span>CÓDIGO:</span>
                                            <span className="font-semibold">{service.missionCode}</span>
                                        </div>

                                        <div>
                                            <span >IMPACTO:</span>
                                            <span className="font-semibold">Pendiente</span>
                                        </div>
                                    </div>

                                    <span className="font-semibold"> {service.antaresId!} - {service.antaresDescription} </span>

                                    <div>
                                        <p>
                                            <span className="font-semibold">Dirección de origen:</span>
                                            {service.location?.address}
                                        </p>

                                        <p>
                                            <span className="font-semibold">Dirección de destino:</span>
                                            {service.location?.address}
                                        </p>

                                        {service.serviceDescription &&
                                            <p>
                                                <span className="font-semibold">Nota:</span>
                                                {service.serviceDescription}
                                            </p>
                                        }
                                    </div>


                                    <div className="pt-6">
                                        <span className="font-semibold">Resumen:</span>
                                    </div>


                                    <div className="pt-6">
                                        <span className="font-semibold">Resumen:</span>
                                        <span className="px-2">Áreas operativas:<span className="font-semibold pl-1">{service.operativeAreas?.filter(x => x)?.length}</span></span>
                                        <span className="px-2">Unidades:<span className="font-semibold pl-1">{service.units?.filter(x => x)?.length}</span></span>
                                        <span className="px-2">Funcionarios presentes:<span className="font-semibold pl-1">{service.firefighters?.length}</span></span>
                                    </div>

                                    <div className="pt-2">
                                        <div className="space-x-2">
                                            <span className="font-semibold">Áreas operativas:</span>
                                            <span>{service.operativeAreas?.join(" , ")}</span>
                                        </div>

                                        <div className="space-x-2">
                                            <span className="font-semibold">Unidades:</span>
                                            <span>{service.units?.join(" , ")}</span>
                                        </div>

                                        <div className="space-x-2">
                                            <span className="font-semibold">Funcionarios:</span>
                                            <span>{service.firefighters?.join(" , ")}</span>
                                        </div>
                                    </div>
                                </>

                            ))}
                        </>
                    ))}
                </div>
            ))}
        </div>
    </PrintLayout>
}