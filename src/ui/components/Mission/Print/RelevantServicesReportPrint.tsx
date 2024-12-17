import React, { useEffect, useState } from "react";

import { PrintLayout } from "./PrintLayout";
import { ApiRelevantServiceDetail, RelevantServiceDetail, TApiRelevantServiceDetail, TRelevantServiceDetail } from "../../../../domain/models/service/relevant_service_detail";
import { get } from "../../../../services/http";
import { modalService } from "../../../core/overlay/overlay_service";

interface ServicePrintProps {
    missionsIds: string[]
    filters: { name: string, value: string }[]
}

interface DetailByStation {
    regionAreaId: string;
    regionAreaName: string;
    stations: Station[];
}

interface Station {
    abbreviation: string;
    name: string;
    missions:Array<{
        missionCode: string;
        missionId: string;
        missionDescription: string;
        missionDate: string;
        unharmed: string;
        injured: string;
        transported: string;
        deceased: string;
        isImportant: boolean;
        locations: Array<{
            state?: string;
            municipality?: string;
            parish?: string;
            sector?: string;
            urb?: string;
            address?: string;
        }>;
        services: Array<{
            id?: string;
            type?: string;
            antaresDescription?: string;
        }>;
        firefighters: Array<{
            rank?: string;
            name?: string;
            document?: string;
            role?: string;
            team?: string;
        }>;
        units: Array<string>;
        operativeAreas: Array<string>;
        people: Array<{
            condition?: string;
            name?: string;
            gender?: string;
            age?: string;
            document?: string;
            phone?: string;
            person_condition?: string;
            unit?: string;
            address?: string;
            building?: string;
            vehicle?: string;
        }>;
        infrastructures: Array<{
            type?: string;
            floor?: string;
            occupation?: string;
            levels?: string;
        }>;
        vehicles: Array<{
            plate?: string;
            make?: string;
            model?: string;
            year?: string;
            color?: string;
            vehicle_type?: string;
            motor_serial?: string;
        }>;
        careCenters: Array<{
            name?: string;
            abbreviation?: string;
            state?: string;
            municipality?: string;
            parish?: string;
            sector?: string;
            urb?: string;
        }>;
    }>
}


export function RelevantServicesReportPrint({ missionsIds: servicesIds, filters }: ServicePrintProps) {
    const [relevantServices, setRelevantServices] = useState<DetailByStation[]>([]);
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        updateRelevantServices()
    }, [])

    async function updateRelevantServices() {
        try {
            setLoading(true)
            const result = await get<TApiRelevantServiceDetail[]>(`mission/relevant/'${servicesIds.join("','")}'`)

            if (result.success && result.result) {
                let newRelevantServices: DetailByStation[] = []

                result.result.forEach(item => {
                    const first = ApiRelevantServiceDetail.safeParse(item)
                    const data = first.data!

                    const station = item.service_stations && item.service_stations[0]

                    console.log(item.unharmed, first.data);
                    console.log(first.error);

                    const a =
                    {
                        regionAreaId: data.id,
                        regionAreaName: data.region_area,
                        stations:
                        [
                            {
                                abbreviation: station.abbreviation,
                                name: station.name,
                                missions: [{
                                    missionCode: data.mission_code,
                                    missionId: data.service_id,
                                    missionDescription: data.service_description,
                                    missionDate: data.service_date,
                                    unharmed: data.unharmed,
                                    injured: data.injured,
                                    transported: data.transported,
                                    deceased: data.deceased,
                                    isImportant: data.is_important,
                                    locations: item.service_locations,
                                    services: item.antares,
                                    units: item.units,
                                    firefighters: item.firefighters,
                                    operativeAreas: item.operative_area_name,
                                    people: item.people,
                                    infrastructures: item.infrastructures,
                                    vehicles: item.vehicles,
                                    careCenters: item.centers
                                }]
                            }
                        ],
                    }
                    if (first.success && first.data) {
                        const parset = a as DetailByStation

                        const regionIndex = newRelevantServices.findIndex(x => x?.regionAreaId && x.regionAreaId === parset.regionAreaId);
                        if (regionIndex === -1) {
                            newRelevantServices.push(parset);
                        } else {
                            const region = newRelevantServices[regionIndex];
                            const stationIndex = region.stations.findIndex(x => x?.abbreviation && x.abbreviation === parset.stations[0].abbreviation);

                            if (stationIndex === -1) {
                                region.stations.push(parset.stations[0]);
                            } else {
                                const station = region.stations[stationIndex];
                                const newMission = parset.stations[0].missions[0];
                                const missionIndex = station.missions.findIndex(x => x?.missionId && x.missionId === newMission.missionId);

                                if (missionIndex === -1) {
                                    station.missions.push(newMission);
                                } else {
                                    // Merge existing service with new service data
                                    const existingService = station.missions[missionIndex];
                                    Object.keys(newMission).forEach(key => {
                                        if (Array.isArray(newMission[key])) {
                                            existingService[key] = [...new Set([...existingService[key], ...newMission[key]])];
                                        } else if (typeof newMission[key] === 'object' && newMission[key] !== null) {
                                            existingService[key] = { ...existingService[key], ...newMission[key] };
                                        } else {
                                            existingService[key] = newMission[key];
                                        }
                                    });
                                }
                            }
                        }
                    } else {
                        console.log("Falla", first);
                    }
                })
                newRelevantServices = newRelevantServices.sort((a, b) => (a.regionAreaId as any) - (b.regionAreaId as any))

                setRelevantServices(newRelevantServices)
            }
            else modalService.toastError("No se pudo cargar la data de los servicios relevantes")
        }
        finally {
            setLoading(false)
        }
    }

    return <div id={'PrintThis'} className='h-full w-full'>
        <PrintLayout loading={loading} title={"INFORME DE SERVICIOS POR REGIONES OPERATIVAS"} subtitle={new Date().toLocaleString('en-GB', { timeZone: 'UTC', hour12: false })} filters={filters}>
            <div className="text-sm">
                {relevantServices.map(relevantService => (
                    relevantService && <div className="pb-16">

                        <div className="font-bold text-2xl w-full text-center pb-6">{relevantService.regionAreaName}</div>

                        {relevantService.stations.map(station => (
                            <>
                                <div className="w-full text-lg flex items-center justify-center pb-4">
                                    <span className="font-semibold text-[#1C2434]"><span>ESTACIÓN N°{station?.abbreviation?.replace("M", "")} : {station?.abbreviation}</span> ( {station?.name?.toUpperCase()} )</span>

                                </div>
                                {station?.missions?.map((mission, index) => (
                                    <>

                                        {index != 0 && <div className="py-6 px-4 opacity-50">
                                            <div className="w-full h-0.5 bg-[#1C2434] rounded-full"></div>
                                        </div>}

                                        <div className="flex justify-between">
                                            <div>
                                                <span>FECHA:</span>
                                                <span className="font-semibold">{mission?.missionDate?.split(" ")[0] ?? ""}</span>
                                            </div>

                                            <div>
                                                <span>HORA:</span>
                                                <span className="font-semibold">{mission?.missionDate?.split(" ")[1] ?? ""}</span>
                                            </div>

                                            <div>
                                                <span>CÓDIGO:</span>
                                                <span className="font-semibold">{mission?.missionCode?.split("-")[0]}</span>
                                            </div>

                                            <div>
                                                <span >NIVEL:</span>
                                                <span className="font-semibold">{mission?.level}</span>
                                            </div>
                                        </div>

                                        <div className="flex w-full justify-between">
                                            <div className="pt-2">
                                                <span className="font-semibold text-base"> {mission?.services[0].id!} - {mission?.services[0].antaresDescription} {mission.isImportant ? "( Relevante )" : ""}</span>
                                            </div>

                                            <div className="flex pt-2">
                                                <span>CUADRANTE DE PAZ:</span>
                                                <span className="font-semibold">{mission?.peaceQuadrant}</span>
                                            </div>
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
                                                    {mission?.location?.address && `${mission?.location?.address},`}
                                                    {mission?.location?.urb && <span className="font-semibold pl-2">URBANIZACIÓN: <span className="font-normal pl-1">{`${mission?.location?.urb},`}</span></span>}
                                                    {mission?.location?.sector && <span className="font-semibold pl-2">SECTOR:       <span className="font-normal pl-1">{`${mission?.location?.sector},`}</span></span>}
                                                    {mission?.location?.parish && <span className="font-semibold pl-2">PARROQUIA:    <span className="font-normal pl-1">{`${mission?.location?.parish},`}</span></span>}
                                                    {mission?.location?.municipality && <span className="font-semibold pl-2">MUNICIPIO:    <span className="font-normal pl-1">{`${mission?.location?.municipality},`}</span></span>}
                                                    {mission?.location?.state && <span className="font-semibold pl-2">ESTADO:       <span className="font-normal pl-1">{`${mission?.location?.state}`}`</span></span>}
                                                </span>
                                            </p>

                                            {mission.careCenter[0] &&
                                                <p className="pt-2">
                                                    <span className="font-semibold pr-2">DIRECCIÓN DEL CENTRO DE ATENCIÓN:</span>
                                                    <span className="text-xs">
                                                        {mission.careCenter[0]?.location?.urb && <span className="font-semibold pl-2">URBANIZACIÓN: <span className="font-normal pl-1">{`${mission?.location?.urb},`}</span></span>}
                                                        {mission.careCenter[0]?.location?.sector && <span className="font-semibold pl-2">SECTOR:       <span className="font-normal pl-1">{`${mission?.location?.sector},`}</span></span>}
                                                        {mission.careCenter[0]?.location?.parish && <span className="font-semibold pl-2">PARROQUIA:    <span className="font-normal pl-1">{`${mission?.location?.parish},`}</span></span>}
                                                        {mission.careCenter[0]?.location?.municipality && <span className="font-semibold pl-2">MUNICIPIO:    <span className="font-normal pl-1">{`${mission?.location?.municipality},`}</span></span>}
                                                        {mission.careCenter[0]?.location?.state && <span className="font-semibold pl-2">ESTADO:       <span className="font-normal pl-1">{`${mission?.location?.state}`}`</span></span>}
                                                    </span>
                                                </p>
                                            }

                                            {mission?.missionDescription &&
                                                <p className="pt-2">
                                                    <span className="font-semibold pr-1">Nota:</span>
                                                    {mission?.missionDescription}
                                                </p>
                                            }
                                        </div>



                                        {mission.people.length > 0 &&
                                            <div className="pt-6">
                                                <span className="text-base font-semibold">PERSONAS:</span>

                                                <div className="pl-8">
                                                    {mission.people.map(person => (
                                                        <div>
                                                            <span className="pl-2"><span className="font-semibold pr-1">ESTADO: </span> {`${person.person_condition},`}</span>
                                                            <span className="pl-2"><span className="font-semibold pr-1">CONDICIÓN: </span> {`${person.condition},`}</span>
                                                            <span className="pl-2"><span className="font-semibold pr-1">NOMBRE: </span> {`${person.name},`}</span>
                                                            <span className="pl-2"><span className="font-semibold pr-1">GÉNERO: </span> {`${person.gender},`}</span>
                                                            <span className="pl-2"><span className="font-semibold pr-1">EDAD: </span> {`${person.age},`}</span>
                                                            <span className="pl-2"><span className="font-semibold pr-1">CI: </span> {`${person.document},`}</span>
                                                            <span className="pl-2"><span className="font-semibold pr-1">TELÉFONO: </span> {`${person.phone}`}</span>

                                                            {person.unit &&
                                                                <div className="pl-8">
                                                                    <span className="pl-2"><span className="font-semibold pr-1">VEHÍCULO DE TRASLADO: </span> {`, ${person.unit},`}</span>
                                                                </div>
                                                            }
                                                        </div>
                                                    ))
                                                    }
                                                </div>
                                            </div>
                                        }

                                        {mission.vehicles.length > 0 &&
                                            <div className="pt-6">
                                                <span className="text-base font-semibold">VEHÍCULOS:</span>

                                                <div className="pl-8">
                                                    {mission.vehicles.map(vehicle => (

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

                                        {mission.infrastructures.length > 0 &&
                                            <div className="pt-6">
                                                <span className="text-base font-semibold">INFRAESTRUCTURAS:</span>

                                                <div className="pl-8">
                                                    {mission.infrastructures.map(infrastructures => (
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

                                        {mission.authorities.length > 0 &&
                                            <div className="pt-6">
                                                <span className="text-base font-semibold">AUTORIDADES:</span>

                                                <div className="pl-8">
                                                    {mission.authorities.map(authority => (
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
                                        }F




                                        <div className="pt-5">
                                            <span className="font-semibold">RESUMEN:</span>
                                            <span className="px-2">ÁREAS OPERATIVAS:<span className="font-semibold pl-1">{mission?.operativeAreas?.filter(x => x)?.length}</span></span>
                                            <span className="px-2">UNIDADES:<span className="font-semibold pl-1">{mission?.units?.filter(x => x)?.length}</span></span>
                                            <span className="px-2">FUNCIONARIOS PRESENTES:<span className="font-semibold pl-1">{mission?.firefighters?.length}</span></span>
                                        </div>

                                        <div className="pt-2">
                                            <div className="space-x-2">
                                                <span className="font-semibold">ÁREAS OPERATIVAS:</span>
                                                <span>{mission?.operativeAreas?.join(" , ")}</span>
                                            </div>

                                            <div className="space-x-2">
                                                <span className="font-semibold">UNIDADES:</span>
                                                <span>{mission?.units?.join(" , ")}</span>
                                            </div>

                                            <div className="space-x-2">
                                                <span className="font-semibold">FUNCIONARIOS:</span>
                                                <span>{mission?.firefighters.map(firefighter => (
                                                    <div className="pl-8">
                                                        <span><span className="font-semibold pr-1">RANGO:</span>{`${firefighter.rank},`}</span>
                                                        <span className="pl-2"><span className="font-semibold pr-1">NOMBRE:</span>{`${firefighter.name},`}</span>
                                                        <span className="pl-2"><span className="font-semibold pr-1">CI:</span>{`${firefighter.document},`}</span>
                                                        <span className="pl-2"><span className="font-semibold pr-1">ROL:</span>{`${firefighter.role},`}</span>
                                                        <span className="pl-2"><span className="font-semibold pr-1">EQUIPO:</span>{`${firefighter.team}`}</span>
                                                    </div>
                                                ))}</span>
                                            </div>

                                            <div className="pt-5">
                                                <span className="font-semibold">PERSONAS SIN IDENTIFICACIÓN:</span>
                                                <span className="px-2">ILESOS:<span className="font-semibold pl-1">{mission?.unharmed}</span></span>
                                                <span className="px-2">HERIDOS:<span className="font-semibold pl-1">{mission?.injured}</span></span>
                                                <span className="px-2">TRANSPORTADOS:<span className="font-semibold pl-1">{mission?.transported}</span></span>
                                                <span className="px-2">FALLECIDOS:<span className="font-semibold pl-1">{mission?.deceased}</span></span>
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


type StationDetail = {
    abbreviation: string;
    name: string;
    locations: Array<{
        state?: string;
        municipality?: string;
        parish?: string;
        sector?: string;
        urb?: string;
        address?: string;
    }>;
    services: Array<{
        id?: string;
        type?: string;
        antaresDescription?: string;
    }>;
    firefighters: Array<{
        rank?: string;
        name?: string;
        document?: string;
        role?: string;
        team?: string;
    }>;
    units: Array<string>;
    operativeArea: Array<string>;
    people: Array<{
        condition?: string;
        name?: string;
        gender?: string;
        age?: string;
        document?: string;
        phone?: string;
        person_condition?: string;
        unit?: string;
        address?: string;
        building?: string;
        vehicle?: string;
    }>;
    infrastructures: Array<{
        type?: string;
        floor?: string;
        occupation?: string;
        levels?: string;
    }>;
    vehicles: Array<{
        plate?: string;
        make?: string;
        model?: string;
        year?: string;
        color?: string;
        vehicle_type?: string;
        motor_serial?: string;
    }>;
    careCenters: Array<{
        name?: string;
        abbreviation?: string;
        state?: string;
        municipality?: string;
        parish?: string;
        sector?: string;
        urb?: string;
    }>;
};

// Define the type for RelevantMissionDetail
type RelevantMissionDetail = {
    regionAreaId: string;
    regionAreaName: string;
    missionCode: string;
    missionId: string;
    missionDescription: string;
    missionDate: string;
    unharmed: string;
    injured: string;
    transported: string;
    deceased: string;
    isImportant: boolean;
    stations: StationDetail[];
};