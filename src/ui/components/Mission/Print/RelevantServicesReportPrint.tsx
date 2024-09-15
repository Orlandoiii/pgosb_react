import React, { useEffect, useState } from "react";

import { PrintLayout } from "./PrintLayout";
import { TService } from "../../../../domain/models/service/service";
import { TMission } from "../../../../domain/models/mission/mission";
import { ApiRelevantServiceDetail, RelevantServiceDetail, RelevantServiceFromApi, TApiRelevantServiceDetail, TRelevantServiceDetail } from "../../../../domain/models/service/relevant_service_detail";
import { get } from "../../../../services/http";
import { modalService } from "../../../core/overlay/overlay_service";

interface ServicePrintProps {
    servicesIds: string[]
}


export function RelevantServicesReportPrint({ servicesIds }: ServicePrintProps) {
    const [relevantServices, setRelevantServices] = useState<TRelevantServiceDetail[]>([]);
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        updateRelevantServices()
    }, [])

    async function updateRelevantServices() {
        try {
            setLoading(true)
            const result = await get<TApiRelevantServiceDetail[]>(`mission/service/relevant/'${servicesIds.join("','")}'`)

            if (result.success && result.result) {
                const newRelevantServices: TRelevantServiceDetail[] = []

                result.result.forEach(item => {
                    const first = ApiRelevantServiceDetail.safeParse(item)
                    const data = first.data!
                    console.log(item.unharmed, first.data?.unharmed);
                    
                    const a =
                    {
                        regionAreaId: data.id,
                        regionAreaName: data.region_area,
                        stations: (data.service_stations || []).map(station => ({
                            abbreviation: station.abbreviation || '',
                            name: station.name || '',
                            location: {
                                state: station.state || '',
                                municipality: station.municipality || '',
                                parish: station.parish || '',
                                sector: station.sector || '',
                                urb: station.urb || '',
                            },
                            services: [{
                                missionCode: data.mission_code || '',
                                serviceId: data.service_id || '',
                                serviceDescription: data.service_description || '',
                                serviceDate: data.service_date || '',
                                antaresId: data.antares_id || '',
                                antaresType: data.antares_type || '',
                                antaresDescription: data.antares_description || '',
                                unharmed: data.unharmed || '',
                                injured: data.injured || '',
                                transported: data.transported || '',
                                deceased: data.deceased || '',
                                location: data.service_locations[0] || undefined,
                                operativeAreas: data.operative_area_name || [],
                                careCenter: (data.centers || []).map(center => ({
                                    name: center.name || '',
                                    abbreviation: center.abbreviation || '',
                                    location: {
                                        state: center.state || '',
                                        municipality: center.municipality || '',
                                        parish: center.parish || '',
                                        sector: center.sector || '',
                                        urb: center.urb || '',
                                    }
                                })),
                                units: data.units || [],
                                firefighters: data.firefighters || [],
                                vehicles: data.vehicles || [],
                                infrastructures: data.infrastructures || [],
                                people: (data.people || []).map(person => ({
                                    ...person,
                                    personCondition: person.person_condition || '',
                                })),
                            }]
                        }))
                    }

                    if (first.success && first.data) {
                        const parset = RelevantServiceDetail.safeParse(a)

                        if (parset.success && parset.data) {
                            const regionIndex = newRelevantServices.findIndex(x => x?.regionAreaId && x.regionAreaId === parset.data.regionAreaId);
                            if (regionIndex === -1) {
                                newRelevantServices.push(parset.data);
                            } else {
                                const region = newRelevantServices[regionIndex];
                                const stationIndex = region.stations.findIndex(x => x?.abbreviation && x.abbreviation === parset.data.stations[0].abbreviation);

                                if (stationIndex === -1) {
                                    region.stations.push(parset.data.stations[0]);
                                } else {
                                    const station = region.stations[stationIndex];
                                    const newService = parset.data.stations[0].services[0];
                                    const serviceIndex = station.services.findIndex(x => x?.serviceId && x.serviceId === newService.serviceId);

                                    if (serviceIndex === -1) {
                                        station.services.push(newService);
                                    } else {
                                        // Merge existing service with new service data
                                        const existingService = station.services[serviceIndex];
                                        Object.keys(newService).forEach(key => {
                                            if (Array.isArray(newService[key])) {
                                                existingService[key] = [...new Set([...existingService[key], ...newService[key]])];
                                            } else if (typeof newService[key] === 'object' && newService[key] !== null) {
                                                existingService[key] = { ...existingService[key], ...newService[key] };
                                            } else {
                                                existingService[key] = newService[key];
                                            }
                                        });
                                    }
                                }
                            }
                        } else {
                            modalService.toastError(`No se pudo parsear un elemento ${parset?.error}`);
                            return;
                        }
                    } else {
                        console.log("Falla", first);
                    }
                })
                setRelevantServices(newRelevantServices)
            }
            else modalService.toastError("No se pudo cargar la data de los servicios relevantes")
        }
        finally {
            setLoading(false)
        }
    }

    return <div id={'PrintThis'} className='h-full w-full'>
        <PrintLayout loading={loading} title={"INFORME DE SERVICIOS RELEVANTES POR REGIONES OPERATIVAS"} subtitle={"12/05/2024 00:00:00 - 12/05/2024 12:00:00"}>
            <div className="text-sm">
                {relevantServices.map(relevantService => (
                    relevantService && <div className="pb-16">

                        <div className="font-bold text-2xl w-full text-center pb-6">{relevantService.regionAreaName}</div>

                        {relevantService.stations.map(station => (
                            <>
                                <div className="w-full text-lg flex items-center justify-center pb-4">
                                    <span className="font-semibold text-[#1C2434]"><span>ESTACIÓN N°{station.abbreviation.replace("M", "")} : {station.abbreviation}</span> ( {station.name?.toUpperCase()} )</span>

                                </div>
                                {station.services.map((service, index) => (
                                    <>

                                        {index != 0 && <div className="py-6 px-4 opacity-50">
                                            <div className="w-full h-0.5 bg-[#1C2434] rounded-full"></div>
                                        </div>}

                                        <div className="flex justify-between">
                                            <div>
                                                <span>FECHA:</span>
                                                <span className="font-semibold">{service?.serviceDate?.split(" ")[0] ?? ""}</span>
                                            </div>

                                            <div>
                                                <span>HORA:</span>
                                                <span className="font-semibold">{service?.serviceDate?.split(" ")[1] ?? ""}</span>
                                            </div>

                                            <div>
                                                <span>CÓDIGO:</span>
                                                <span className="font-semibold">{service?.missionCode?.split("-")[0]}</span>
                                            </div>

                                            <div>
                                                <span >IMPACTO:</span>
                                                <span className="font-semibold">Pendiente</span>
                                            </div>
                                        </div>

                                        <div className="pt-2">
                                            <span className="font-semibold text-base"> {service?.antaresId!} - {service?.antaresDescription} </span>
                                        </div>

                                        <div>
                                            <p className="pt-2">
                                                <span className="font-semibold pr-2">DIRECCIÓN DE ORIGEN:</span>
                                                <span className="text-xs">
                                                    {station?.location?.urb && <span className="font-semibold pl-2">URBANIZACIÓN: <span className="font-normal pl-1">{`${station?.location?.urb},`}</span></span>}
                                                    {station?.location?.sector && <span className="font-semibold pl-2">SECTOR:       <span className="font-normal pl-1">{`${station?.location?.sector},`}</span></span>}
                                                    {station?.location?.parish && <span className="font-semibold pl-2">PARROQUIA:    <span className="font-normal pl-1">{`${station?.location?.parish},`}</span></span>}
                                                    {station?.location?.municipality && <span className="font-semibold pl-2">MUNICIPIO:    <span className="font-normal pl-1">{`${station?.location?.municipality},`}</span></span>}
                                                    {station?.location?.state && <span className="font-semibold pl-2">ESTADO:       <span className="font-normal pl-1">{`${station?.location?.state}`}`</span></span>}
                                                </span>
                                            </p>

                                            <p className="pt-2">
                                                <span className="font-semibold pr-2">DIRECCIÓN DEL SERVICIO:</span>
                                                <span className="text-xs">
                                                    {service?.location?.address && `${service?.location?.address},`}
                                                    {service?.location?.urb && <span className="font-semibold pl-2">URBANIZACIÓN: <span className="font-normal pl-1">{`${service?.location?.urb},`}</span></span>}
                                                    {service?.location?.sector && <span className="font-semibold pl-2">SECTOR:       <span className="font-normal pl-1">{`${service?.location?.sector},`}</span></span>}
                                                    {service?.location?.parish && <span className="font-semibold pl-2">PARROQUIA:    <span className="font-normal pl-1">{`${service?.location?.parish},`}</span></span>}
                                                    {service?.location?.municipality && <span className="font-semibold pl-2">MUNICIPIO:    <span className="font-normal pl-1">{`${service?.location?.municipality},`}</span></span>}
                                                    {service?.location?.state && <span className="font-semibold pl-2">ESTADO:       <span className="font-normal pl-1">{`${service?.location?.state}`}`</span></span>}
                                                </span>
                                            </p>

                                            {service.careCenter[0] &&
                                                <p className="pt-2">
                                                    <span className="font-semibold pr-2">DIRECCIÓN DEL CENTRO DE ATENCIÓN:</span>
                                                    <span className="text-xs">
                                                        {service.careCenter[0]?.location?.urb && <span className="font-semibold pl-2">URBANIZACIÓN: <span className="font-normal pl-1">{`${service?.location?.urb},`}</span></span>}
                                                        {service.careCenter[0]?.location?.sector && <span className="font-semibold pl-2">SECTOR:       <span className="font-normal pl-1">{`${service?.location?.sector},`}</span></span>}
                                                        {service.careCenter[0]?.location?.parish && <span className="font-semibold pl-2">PARROQUIA:    <span className="font-normal pl-1">{`${service?.location?.parish},`}</span></span>}
                                                        {service.careCenter[0]?.location?.municipality && <span className="font-semibold pl-2">MUNICIPIO:    <span className="font-normal pl-1">{`${service?.location?.municipality},`}</span></span>}
                                                        {service.careCenter[0]?.location?.state && <span className="font-semibold pl-2">ESTADO:       <span className="font-normal pl-1">{`${service?.location?.state}`}`</span></span>}
                                                    </span>
                                                </p>
                                            }

                                            {service?.serviceDescription &&
                                                <p className="pt-2">
                                                    <span className="font-semibold pr-1">Nota:</span>
                                                    {service?.serviceDescription}
                                                </p>
                                            }
                                        </div>



                                        {service.people.length > 0 &&
                                            <div className="pt-6">
                                                <span className="text-base font-semibold">PERSONAS:</span>

                                                <div className="pl-8">
                                                    {service.people.map(person => (
                                                        <>
                                                            <span>{`${person.condition ? `${person.condition}: ` : ""}${person.name},`}</span>
                                                            <span className="pl-2"><span className="font-semibold pr-1">GENERO: </span> {`${person.gender},`}</span>
                                                            <span className="pl-2"><span className="font-semibold pr-1">EDAD: </span> {`${person.age},`}</span>
                                                            <span className="pl-2"><span className="font-semibold pr-1">CI: </span> {`${person.document},`}</span>
                                                            <span className="pl-2"><span className="font-semibold pr-1">CONDICIÓN: </span> {`${person.condition},`}</span>
                                                            <span className="pl-2"><span className="font-semibold pr-1">TELÉFONO: </span> {`${person.phone},`}</span>

                                                            {person.unit &&
                                                                <div className="pl-8">
                                                                    <span className="pl-2"><span className="font-semibold pr-1">VEHÍCULO DE TRASLADO: </span> {`${person.unit},`}</span>
                                                                </div>
                                                            }
                                                        </>
                                                    ))
                                                    }
                                                </div>
                                            </div>
                                        }

                                        {service.vehicles.length > 0 &&
                                            <div className="pt-6">
                                                <span className="text-base font-semibold">VEHÍCULOS:</span>

                                                <div className="pl-8">
                                                    {service.vehicles.map(vehicle => (

                                                        <div>
                                                            <span className="pl-2"><span className="font-semibold pr-1">TIPO: </span> {`${vehicle.type},`}</span>
                                                            <span className="pl-2"><span className="font-semibold pr-1">MARCA: </span> {`${vehicle.make},`}</span>
                                                            <span className="pl-2"><span className="font-semibold pr-1">MODELO: </span> {`${vehicle.model},`}</span>
                                                            <span className="pl-2"><span className="font-semibold pr-1">PLACA: </span> {`${vehicle.plate},`}</span>
                                                            <span className="pl-2"><span className="font-semibold pr-1">AÑO: </span> {`${vehicle.year},`}</span>
                                                            <span className="pl-2"><span className="font-semibold pr-1">COLOR: </span> {`${vehicle.color},`}</span>
                                                        </div>

                                                    ))
                                                    }
                                                </div>
                                            </div>
                                        }

                                        {service.infrastructures.length > 0 &&
                                            <div className="pt-6">
                                                <span className="text-base font-semibold">INFRAESTRUCTURAS:</span>

                                                <div className="pl-8">
                                                    {service.infrastructures.map(infrastructures => (
                                                        <>
                                                            <span className="pl-2"><span className="font-semibold pr-1">TIPO: </span> {`${infrastructures.type},`}</span>
                                                            <span className="pl-2"><span className="font-semibold pr-1">OCUPACIÓN: </span> {`${infrastructures.occupation},`}</span>
                                                            <span className="pl-2"><span className="font-semibold pr-1">NIVELES: </span> {`${infrastructures.levels},`}</span>
                                                        </>
                                                    ))
                                                    }
                                                </div>
                                            </div>
                                        }




                                        <div className="pt-5">
                                            <span className="font-semibold">RESUMEN:</span>
                                            <span className="px-2">ÁREAS OPERATIVAS:<span className="font-semibold pl-1">{service?.operativeAreas?.filter(x => x)?.length}</span></span>
                                            <span className="px-2">UNIDADES:<span className="font-semibold pl-1">{service?.units?.filter(x => x)?.length}</span></span>
                                            <span className="px-2">FUNCIONARIOS PRESENTES:<span className="font-semibold pl-1">{service?.firefighters?.length}</span></span>
                                        </div>

                                        <div className="pt-5">
                                            <span className="font-semibold">PERSONAS SIN IDENTIFICACIÓN:</span>
                                            <span className="px-2">ILESOS:<span className="font-semibold pl-1">{service?.unharmed}</span></span>
                                            <span className="px-2">HERIDOS:<span className="font-semibold pl-1">{service?.injured}</span></span>
                                            <span className="px-2">TRANSPORTADOS:<span className="font-semibold pl-1">{service?.transported}</span></span>
                                            <span className="px-2">FALLECIDOS:<span className="font-semibold pl-1">{service?.deceased}</span></span>
                                        </div>

                                        <div className="pt-2">
                                            <div className="space-x-2">
                                                <span className="font-semibold">ÁREAS OPERATIVAS:</span>
                                                <span>{service?.operativeAreas?.join(" , ")}</span>
                                            </div>

                                            <div className="space-x-2">
                                                <span className="font-semibold">UNIDADES:</span>
                                                <span>{service?.units?.join(" , ")}</span>
                                            </div>

                                            <div className="space-x-2">
                                                <span className="font-semibold">FUNCIONARIOS:</span>
                                                <span>{service?.firefighters.map(firefighter => (
                                                    <div className="pl-8">
                                                        <span><span className="font-semibold pr-1">RANGO:</span>{`${firefighter.rank},`}</span>
                                                        <span className="pl-2"><span className="font-semibold pr-1">NOMBRE:</span>{`${firefighter.name},`}</span>
                                                        <span className="pl-2"><span className="font-semibold pr-1">CI:</span>{`${firefighter.document},`}</span>
                                                        <span className="pl-2"><span className="font-semibold pr-1">ROL:</span>{`${firefighter.role},`}</span>
                                                        <span className="pl-2"><span className="font-semibold pr-1">EQUIPO:</span>{`${firefighter.team}`}</span>
                                                    </div>
                                                ))}</span>
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
    </div>
}