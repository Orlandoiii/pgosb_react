import React, { useEffect, useMemo, useRef, useState } from 'react'


import LoadingModal from '../../../core/modal/LoadingModal'
import { AddableTable } from '../../Temp/AddableTable'
import DateTimePicker from '../../../core/datetime_picker/DateTimePicker'
import TextInput from '../../../alter/components/inputs/text_input'

import { useMissionFirefighterCollection } from '../../../../domain/models/mission/firefighter/use_collection'
import { MissionFirefighterNameConverter } from '../../../../domain/models/mission/firefighter/mission_firefighter'

import { useMissionUnitCollection } from '../../../../domain/models/mission/unit/use_collection'
import { MissionUnitNameConverter } from '../../../../domain/models/mission/unit/mission_unit'

import { useMissionLocationCollection } from '../../../../domain/models/mission/location/use_collection'
import { useMissionAuthorityCollection } from '../../../../domain/models/mission/authority/use_collection'
import { useMissionInfrastructureCollection } from '../../../../domain/models/mission/infraestructure/use_collection'
import { useMissionVehicleCollection } from '../../../../domain/models/mission/vehicle/use_collection'
import { useMissionPersonCollection } from '../../../../domain/models/mission/person/use_collection'
import { useMissionServiceCollection } from '../../../../domain/models/mission/service/use_collection'
import { MissionServiceFront, MissionServiceFrontSchema, MissionServiceNameConverter } from '../../../../domain/models/mission/service/mission_service'
import { MissionLocationFront, MissionLocationNameConverter } from '../../../../domain/models/mission/location/mission_location'
import { MissionInfraestructureFront, MissionInfraestructureNameConverter } from '../../../../domain/models/mission/infraestructure/mission_infraestructure'
import { MissionVehicleFront, MissionVehicleNameConverter } from '../../../../domain/models/mission/vehicle/mission_vehicle'
import { MissionPersonFront, MissionPersonNameConverter } from '../../../../domain/models/mission/person/mission_person'
import { MissionAuthorityFront, MissionAuthorityNameConverter } from '../../../../domain/models/mission/authority/mission_authority'


import { Roles } from '../../../../domain/abstractions/enums/roles'
import { EnumToStringArray } from '../../../../utilities/converters/enum_converter'

import { MissionFront, MissionFrontSchema } from '../../../../domain/models/mission/mission'
import ModalLayout from '../../../optimized/components/layouts/modal_layout'
import Button from '../../../core/buttons/Button'

import Form from '../../../optimized/components/form/form'
import FormInput from '../../../optimized/components/form_inputs/form_input'
import FormToggle from '../../../optimized/components/form_inputs/form_toggle'
import FormSelectWithSearch from '../../../optimized/components/form_inputs/form_select_with_search'
import { useStationCollection } from '../../../../domain/models/mission/station/use_collection'
import { ApiStationType } from '../../../../domain/models/stations/station'
import { SelectWithSearch } from '../../../optimized/components/inputs/select_with_search'
import { OperativeAreas } from '../../../../domain/abstractions/enums/operative_areas'
import LocationForm from './LocationForm'
import InfrastructureForm from './InfrastructureForm'
import PersonForm from './PersonForm'
import VehicleForm from './VehicleForm'
import { AuthorityForm } from './AuthorityForm'
import { modalService } from '../../../core/overlay/overlay_service'
import { insert } from '../../../../services/http'
import FormSubmit from '../../../optimized/components/form_inputs/form_submit'
import { FormDatePicker } from '../../../optimized/components/form_inputs/form_date_picker'
import { formatDateString, parseDateString } from '../../../optimized/Utilities/date_string_formatter'
import Chips from '../../../alter/components/menus/chips'
import { Controller, UseFormSetValue } from 'react-hook-form'
import Chip from '../../../alter/components/data_presenters/chip'
import { useFormFieldContext } from '../../../optimized/components/form/form_context'
import { useMissionCollection } from '../../../../domain/models/mission/use_collection'
import { useAntaresCollection } from '../../../../domain/models/mission/antares/use_collection'
import { getDefaults } from '../../../core/context/CustomFormContext'
import FormTextArea from '../../../optimized/components/form_inputs/form_text_area'
import { TApiAntares } from '../../../../domain/models/antares/antares'

interface MissionFormProps {
    isVisible: boolean
    initValue?: MissionFront | null
    closeOverlay?: () => void
}

const MissionForm = ({
    isVisible,
    initValue,
    closeOverlay,
}: MissionFormProps) => {
    const [loading, setLoading] = useState(false)
    const [locationsLoading, setLocationsLoading] = useState(true)

    const [_, missionsActions] = useMissionCollection()

    const [missionServices, missionServicesActions, updateMissionServices] = useMissionServiceCollection(initValue?.id ?? '')

    const [missionUnits, missionUnitsActions, updateUnits] = useMissionUnitCollection(initValue?.id ?? '')
    const [units] = useMissionUnitCollection('', 'ALL', 'unit')
    const [missionFirefighters, missionFirefightersActions, updateFirefighters] = useMissionFirefighterCollection(initValue?.id ?? '')
    const [firefighters] = useMissionFirefighterCollection('', 'SIMPLE', 'user')

    const [missionLocations, missionLocationsActions, updateMissionLocations] = useMissionLocationCollection(initValue?.id ?? '')
    const [locationModalData, setLocationModalData] = useState<MissionLocationFront>()
    const [locationModalOpen, setLocationModalOpen] = useState(false)

    const [missionInfrastructures, missionInfrastructuresActions, updateMissionInfrastructure] = useMissionInfrastructureCollection(initValue?.id ?? '')
    const [infrastructureModalData, setInfrastructureModalData] = useState<MissionInfraestructureFront>()
    const [infrastructureModalOpen, setInfrastructureModalOpen] = useState(false)

    const [missionVehicles, missionVehiclesActions, updateMissionVehicle] = useMissionVehicleCollection(initValue?.id ?? '')
    const [vehicleModalData, setVehicleModalData] = useState<MissionVehicleFront>()
    const [vehicleModalOpen, setVehicleModalOpen] = useState(false)

    const [missionPeople, missionPeopleActions, updateMissionPeople] = useMissionPersonCollection(initValue?.id ?? '')
    const [personModalData, setPersonModalData] = useState<MissionPersonFront>()
    const [personModalOpen, setPersonModalOpen] = useState(false)

    const [missionAuthorities, missionAuthoritiesActions, updateMissionAuthorities] = useMissionAuthorityCollection(initValue?.id ?? '')
    const [authorityModalData, setAuthorityModalData] = useState<MissionAuthorityFront>()
    const [authorityModalOpen, setAuthorityModalOpen] = useState(false)

    const [stations] = useStationCollection();
    const [antares] = useAntaresCollection();

    const [manualDate, setManualDate] = useState<Date>(initValue?.manualMissionDate ? parseDateString(initValue?.manualMissionDate) : new Date())
    const [currentOperativeAreas, setCurrentOperativeAreas] = useState<string[]>(initValue?.operativeAreas ? initValue?.operativeAreas : [])
    const roles = useMemo(() => {
        if (missionFirefighters.length == 0 || missionFirefighters.filter(x => x.serviceRole?.toLocaleLowerCase() == 'comandante').length == 0) return EnumToStringArray(Roles)
        else return [Roles.Auxiliary.toString(), Roles.Driver.toString()]
    }, [missionFirefighters])

    const cancelReasons = useMemo(() => ["ALARMA FALSA", "ALARMA INFUNDADA", "ATENDIDO NO EFECTUADO", "ATENCION NO REALIZADA"], [])
    const operativeAreas = useMemo(() => EnumToStringArray(OperativeAreas), [])
    const levels = useMemo(() => ["NIVEL 1", "NIVEL 2", "NIVEL 3", "NIVEL 4"], [])

    const [action, setAction] = useState<'add' | 'update' | undefined>(undefined);

    const [originLocation, setOriginLocation] = useState<string>(initValue?.locationId ? initValue.locationId : "");
    const [destinationLocation, setDestinationLocation] = useState<string>(initValue?.locationDestinyId ? initValue.locationDestinyId : "");

    const [addingLocationFor, setAddingLocationFor] = useState<'origin' | 'destination' | undefined>(undefined);

    console.log("Opened", originLocation, addingLocationFor);
    

    useEffect(() => {
        setTimeout(() => {
            setLocationsLoading(false);
        }, 1500);
    }, [])

    async function submit(data: MissionFront) {
        console.log("submited", data);

        data.manualMissionDate = formatDateString(manualDate)
        data.operativeAreas = currentOperativeAreas;
        data.locationId = originLocation;
        data.description = destinationLocation;

        const result = await missionsActions.updateFront(data);
        if (result.success) modalService.toastSuccess("Missión actualizada!");
        else modalService.toastError("No se pudo actualizar la missión");
    }

    return (
        <>
            <ModalLayout
                isVisible={isVisible}
                className="min-w-[80vw]"
                title={'Registro de la Misión'}
                onClose={closeOverlay}
            >
                <Form className='relative' schema={MissionFrontSchema as any} initValue={initValue} onSubmit={submit}>
                    <div className="flex space-x-6 w-full">
                        <div className="flex items-center space-x-4">
                            <div className="font-semibold text-slate-700 text-xl">
                                Alias:
                            </div>

                            <FormInput<MissionFront>
                                fieldName={'alias'} />
                        </div>

                        <div className="flex items-center space-x-4 flex-none w-72">
                            <div className="font-semibold text-slate-700 text-xl">
                                Fecha:
                            </div>

                            <DateTimePicker
                                onChange={(date) => {
                                    if (date) setManualDate(date);
                                }}
                                selected={manualDate}
                                height='h-10'
                                timeInterval={1}
                            />
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="font-semibold text-slate-700 text-xl">
                                Código:
                            </div>
                            <div className="bg-white px-4 py-2 rounded-md h-10 font-semibold text-lg">
                                {initValue?.id}
                            </div>
                        </div>

                        <div className="flex">
                            <FormToggle<MissionFront>
                                width="w-44"
                                height="h-11"
                                fieldName={'isImportant'}
                                option1="Relevante"
                                option2="No Relevante"
                            />
                        </div>

                        <div className="flex">
                            <FormToggle<MissionFront>
                                width="w-48"
                                height="h-11"
                                fieldName={'pendingForData'}
                                option1="Faltan Datos"
                                option2="Datos Completos"
                            />
                        </div>
                    </div>

                    <div className="h-12"></div>

                    <div className="flex space-x-8 w-full">
                        <div className="flex-auto w-full">
                            <FormSelectWithSearch<MissionFront, ApiStationType>
                                description="Estación"
                                fieldName={'stationId'}
                                options={stations}
                                valueKey={'id'}
                                displayKeys={['abbreviation', 'name']}
                                fatherLoading={stations.length < 1}
                            />
                        </div>
                        <AddServiceComponent options={antares} selectedChanged={async (id) => {
                            if (id) {
                                let defaultValue = getDefaults<MissionServiceFront>(MissionServiceFrontSchema)
                                defaultValue.missionId = initValue!.id
                                defaultValue.antaresId = id

                                const result = await missionServicesActions.insertFront(defaultValue)
                                if (result.success) modalService.toastSuccess("Servicio agregado")
                                else {
                                    modalService.toastError("No se pudo agregar el servicio!")
                                    console.error("No se pudo agregar el servicio por: ", result.error);
                                }
                            }
                        }} />

                        <div className='w-44 flex-none'></div>
                    </div>

                    <div className="h-2"></div>


                    <div className=' absolute top-0 left-0 w-full h-full pointer-events-none pt-32'>
                        <div className='relative h-full w-full flex'>
                            <div className='w-full'></div>
                            <div className="sticky h-fit z-50 top-[-48px] right-6 pointer-events-auto">
                                <FormSubmit
                                    height='h-12'
                                    width='w-44'
                                    colorType="bg-[#3C50E0]"
                                    description={"Guardar"}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="h-8"></div>

                    <AddableTable
                        title="Servicios"
                        data={missionServices ?? []}
                        defaultSort={'id'}
                        defaultSortAsc={true}
                        idPropertyName="id"
                        nameConverter={MissionServiceNameConverter}

                        addButtonText=""
                        options={antares}
                        optionsDescription={'Antares'}
                        valueKey={'id'}
                        displayKeys={['id', 'description']}
                        // onAddOption={(id, _) => {
                        //     console.log(id);

                        //     if (id) {
                        //         let defaultValue = getDefaults<MissionServiceFront>(MissionServiceFrontSchema)
                        //         defaultValue.missionId = initValue!.id
                        //         defaultValue.antaresId = id

                        //         missionServicesActions.insertFront(defaultValue)
                        //     }
                        // }}
                        onDeleteButtonClick={missionServicesActions.remove}
                    ></AddableTable>

                    <div className="h-8"></div>

                    <div className='flex space-x-8'>
                        <AddableTable
                            title="Unidades"
                            data={missionUnits ?? []}
                            defaultSort={'id'}
                            idPropertyName="id"
                            nameConverter={MissionUnitNameConverter}

                            addButtonText="Agregar una unidad"
                            options={units}
                            optionsDescription={'Placa'}
                            valueKey={'id'}
                            displayKeys={['plate', 'unitType']}
                            onAddOption={async (id) => {
                                const unit = units.filter(x => x.id == id)[0]
                                if (unit && initValue?.id) {
                                    unit.missionId = initValue?.id;
                                    let result = await insert("mission/unit", { mission_id: initValue.id, unit_id: unit.id })

                                    if (result.success) {
                                        modalService.toastSuccess("Unidad agregada")
                                        updateUnits()
                                    }
                                    else {
                                        modalService.toastError("No se pudo agregar la unidad")
                                        console.log(result.error);
                                    }
                                }
                                else {
                                    modalService.toastError("Unidad no encontrado")
                                }
                            }}
                            onDeleteButtonClick={async (id) => {
                                let result = await missionUnitsActions.remove(id)
                                if (result.success) updateUnits()
                            }}
                        ></AddableTable>

                        <AddableTable
                            title="Bomberos"
                            data={missionFirefighters ?? []}
                            defaultSort={'id'}
                            idPropertyName="id"
                            nameConverter={MissionFirefighterNameConverter}

                            addButtonText="Agregar un bombero"
                            options={firefighters}
                            optionsDescription={'Usuario'}
                            valueKey={'id'}
                            displayKeys={['personalCode', 'legalId']}

                            options2={roles}
                            optionsDescription2={'Rol'}
                            preSelectFirstOption2={true}
                            onAddOption={async (id, rank) => {
                                const firefighter = firefighters.filter(x => x.id == id)[0]
                                if (firefighter && rank && initValue?.id) {
                                    firefighter.rank = rank
                                    firefighter.missionId = initValue?.id

                                    let result = await insert("mission/firefighter", { mission_id: initValue.id, user_id: firefighter.id, service_role: rank })
                                    if (result.success) {
                                        modalService.toastSuccess("Bombero agregado")
                                        updateFirefighters()
                                    }
                                    else {
                                        modalService.toastError("No se pudo agregar al bombero")
                                        console.log(result.error);
                                    }
                                }
                                else {
                                    modalService.toastError("Bombero no encontrado")
                                }
                            }}
                            onDeleteButtonClick={async (id) => {
                                let result = await missionFirefightersActions.remove(id)
                                if (result.success) updateFirefighters()
                            }}
                        ></AddableTable>
                    </div>

                    <div className="h-8"></div>

                    <div className='flex space-x-8'>
                        <div className="flex flex-auto space-x-1 w-24">
                            <SelectWithSearch<MissionLocationFront>
                                description="Ubicación de origen"
                                valueKey={'id'}
                                displayKeys={['id', 'alias']}
                                options={missionLocations}
                                isLoading={locationsLoading}
                                selectedOption={originLocation}
                                selectionChange={(value) => setOriginLocation(value ?? "")}
                            />

                            <div className="flex-none pt-8 h-11">
                                <Button
                                    colorType="bg-[#3C50E0]"
                                    onClick={(e) => {
                                        // preLocationRef.current = locations;
                                        // lastLocationButtonPressedRef.current = 'ORIGEN'

                                        // locationActions.add()
                                        setLocationModalOpen(true)
                                        setAction('add')

                                        setAddingLocationFor("origin");

                                        e.preventDefault()
                                        e.stopPropagation()
                                    }}
                                    children={'+'}
                                    width="w-10"
                                ></Button>
                            </div>
                        </div>

                        <div className="flex flex-auto space-x-1 w-24">
                            <SelectWithSearch<MissionLocationFront>
                                description="Ubicación de destino"
                                valueKey={'id'}
                                displayKeys={['id', 'alias']}
                                options={missionLocations}
                                isLoading={locationsLoading}
                                selectedOption={destinationLocation}
                                selectionChange={(value) => setDestinationLocation(value ?? "")}
                            />

                            <div className="flex-none pt-8 h-11">
                                <Button
                                    colorType="bg-[#3C50E0]"
                                    onClick={(e) => {
                                        // preLocationRef.current = locations;
                                        // lastLocationButtonPressedRef.current = 'ORIGEN'

                                        // locationActions.add()
                                        setLocationModalOpen(true)
                                        setAction('add')

                                        setAddingLocationFor("destination");

                                        e.preventDefault()
                                        e.stopPropagation()
                                    }}
                                    children={'+'}
                                    width="w-10"
                                ></Button>
                            </div>
                        </div>
                    </div>

                    <div className="h-8"></div>

                    <div className='flex space-x-8 w-full'>
                        <AddOperativeAreaComponent options={operativeAreas} setExternal={setCurrentOperativeAreas} />
                    </div>

                    <div className="flex space-x-6 w-full">
                        <div className="w-32">
                            <FormSelectWithSearch<MissionFront, string>
                                description="Nivel"
                                fieldName={'level'}
                                options={levels}
                                addClearButton={true}
                            />
                        </div>

                        <div className="w-40">
                            <FormInput<MissionFront>
                                description={'Cuadrante de Paz'}
                                fieldName={'peaceQuadrant'}
                            />
                        </div>

                        <div className=" w-72">
                            <FormSelectWithSearch<MissionFront, string>
                                description="Motivo de Cancelación"
                                fieldName={'cancelReason'}
                                options={cancelReasons}
                                addClearButton={true}
                            />
                        </div>
                    </div>

                    <div className='h-8'></div>
                    <div className='space-y-2'>
                        <div className="font-semibold text-slate-700 text-xl">Bitacora / Descripción</div>
                        <div className='h-40 w-full'>
                            <FormTextArea<MissionFront>
                                description={''}
                                fieldName={'description'}
                            />
                        </div>
                    </div>

                    <div className='h-4'></div>
                    <div className="flex space-x-6 h-20 w-full">
                        <FormInput<MissionFront>
                            description={'Ilesos'}
                            fieldName={'unharmed'}
                            type={'Number'}
                        />
                        <FormInput<MissionFront>
                            description={'Heridos'}
                            fieldName={'injured'}
                            type={'Number'}
                        />
                        <FormInput<MissionFront>
                            description={'Transportados'}
                            fieldName={'transported'}
                            type={'Number'}
                        />
                        <FormInput<MissionFront>
                            description={'Fallecidos'}
                            fieldName={'deceased'}
                            type={'Number'}
                        />
                    </div>

                    <div className="h-8"></div>

                    <AddableTable
                        title="Ubicaciones"
                        data={missionLocations ?? []}
                        defaultSort={'state'}
                        idPropertyName="id"
                        addButtonText="Agregar una ubicación"
                        nameConverter={MissionLocationNameConverter}
                        onAddButtonClick={() => {
                            setLocationModalOpen(true)
                            setAction('add')
                        }}
                        onEditButtonClick={async (id) => {
                            const location = await missionLocationsActions.getById(id)
                            if (location.success && location.result) {
                                setLocationModalData(location.result)
                                setLocationModalOpen(true)
                                setAction('update')
                            }
                        }}
                        onDeleteButtonClick={async (id) => {
                            let result = await missionLocationsActions.remove(id)
                            if (result.success) updateMissionLocations()
                        }}
                    ></AddableTable>

                    <div className="h-8"></div>

                    <AddableTable
                        title="Infraestructuras"
                        data={missionInfrastructures ?? []}
                        idPropertyName="id"
                        addButtonText="Agregar una infraestructura"
                        nameConverter={MissionInfraestructureNameConverter}
                        onAddButtonClick={() => {
                            setInfrastructureModalOpen(true)
                            setAction('add')
                        }}
                        onEditButtonClick={async (id) => {
                            const infrastructure = await missionInfrastructuresActions.getById(id)
                            if (infrastructure.success && infrastructure.result) {
                                setInfrastructureModalData(infrastructure.result)
                                setInfrastructureModalOpen(true)
                                setAction('update')
                            }
                        }}
                        onDeleteButtonClick={async (id) => {
                            let result = await missionInfrastructuresActions.remove(id)
                            if (result.success) updateMissionInfrastructure()
                        }}
                    />

                    <div className="h-8"></div>

                    <AddableTable
                        title="Vehiculos"
                        data={missionVehicles ?? []}
                        idPropertyName="id"
                        addButtonText="Agregar un vehiculo"
                        nameConverter={MissionVehicleNameConverter}
                        onAddButtonClick={() => {
                            setVehicleModalOpen(true)
                            setAction('add')
                        }}
                        onEditButtonClick={async (id) => {
                            const vehicle = await missionVehiclesActions.getById(id)
                            if (vehicle.success && vehicle.result) {
                                setVehicleModalData(vehicle.result)
                                setVehicleModalOpen(true)
                                setAction('update')
                            }
                        }}
                        onDeleteButtonClick={async (id) => {
                            let result = await missionVehiclesActions.remove(id)
                            if (result.success) updateMissionVehicle()
                        }}
                    />

                    <div className="h-8"></div>

                    <AddableTable
                        title="Personas"
                        data={missionPeople ?? []}
                        idPropertyName="id"
                        addButtonText="Agregar una persona"
                        nameConverter={MissionPersonNameConverter}
                        onAddButtonClick={() => {
                            setPersonModalOpen(true)
                            setAction('add')
                        }}
                        onEditButtonClick={async (id) => {
                            const person = await missionPeopleActions.getById(id)
                            if (person.success && person.result) {
                                setPersonModalData(person.result)
                                setPersonModalOpen(true)
                                setAction('update')
                            }
                        }}
                        onDeleteButtonClick={async (id) => {
                            let result = await missionPeopleActions.remove(id)
                            if (result.success) updateMissionPeople()
                        }}
                    />

                    <AddableTable
                        title="Autoridades"
                        data={missionAuthorities ?? []}
                        defaultSort={'id'}
                        idPropertyName="id"
                        addButtonText="Agregar una autoridad"
                        nameConverter={MissionAuthorityNameConverter}
                        onAddButtonClick={async () => {
                            const result = await missionAuthoritiesActions.insertFront({ missionId: initValue!.id } as any)

                            if (result.success) {
                                setAuthorityModalData(result.result)
                                setAuthorityModalOpen(true)
                                setAction('add')
                            } else modalService.toastError("No se pudo crear la autoridad")

                        }}
                        onEditButtonClick={async (id) => {
                            const authority = await missionAuthoritiesActions.getById(id)
                            if (authority.success && authority.result) {
                                setAuthorityModalData(authority.result)
                                setAuthorityModalOpen(true)
                                setAction('update')
                            }
                        }}
                        onDeleteButtonClick={async (id) => {
                            let result = await missionAuthoritiesActions.remove(id)
                            if (result.success) updateMissionAuthorities()
                        }}
                    ></AddableTable>
                </Form>
            </ModalLayout>
            <LoadingModal initOpen={loading} children={null} />

            {locationModalOpen &&
                <LocationForm
                    initValue={action == "add" ? { missionId: initValue!.id } : { ...locationModalData, missionId: initValue!.id }}
                    add={action == "add"}
                    locationAdded={(location) => {
                        if (addingLocationFor == 'origin') setOriginLocation(location.id ?? "0")
                        else if (addingLocationFor == 'destination') setDestinationLocation(location.id ?? "0")

                        setAddingLocationFor(undefined)
                        updateMissionLocations()
                    }}
                    closeOverlay={() => {
                        updateMissionLocations()
                        setLocationModalOpen(false)
                    }
                    } />}

            {infrastructureModalOpen &&
                <InfrastructureForm
                    initValue={action == "add" ? { missionId: initValue!.id } : { ...infrastructureModalData, missionId: initValue!.id } as any}
                    add={action == "add"}
                    closeOverlay={() => {
                        updateMissionInfrastructure()
                        setInfrastructureModalOpen(false)
                    }
                    } />}

            {vehicleModalOpen &&
                <VehicleForm
                    initValue={action == "add" ? { missionId: initValue!.id } : { ...vehicleModalData, missionId: initValue!.id } as any}
                    add={action == "add"}
                    closeOverlay={() => {
                        updateMissionVehicle()
                        setVehicleModalOpen(false)
                    }
                    } />}

            {personModalOpen &&
                <PersonForm
                    initValue={action == "add" ? { missionId: initValue!.id } : { ...personModalData, missionId: initValue!.id } as any}
                    add={action == "add"}
                    closeOverlay={() => {
                        updateMissionPeople()
                        setPersonModalOpen(false)
                    }
                    } />}

            {authorityModalOpen &&
                <AuthorityForm
                    initValue={{ ...authorityModalData, missionId: initValue!.id } as any}
                    closeOverlay={() => {
                        updateMissionAuthorities()
                        setAuthorityModalOpen(false)
                    }
                    } />}
        </>
    )
}

export default MissionForm


interface AddOperativeAreaComponentProps {
    options: string[]
    setExternal: React.Dispatch<React.SetStateAction<string[]>>
}
function AddOperativeAreaComponent({ options, setExternal }: AddOperativeAreaComponentProps) {
    const { setValue, control } = useFormFieldContext<MissionFront>('operativeAreas')

    return <Controller
        name={"operativeAreas"}
        control={control}
        render={({ field }) => {

            return <div className='flex items-center space-x-6 w-full'>
                <div className="flex-none w-1/2">
                    <SelectWithSearch
                        description="Áreas operativas"
                        options={options}
                        selectionChange={(e) => {
                            if (e == '') return

                            let newOperativeAreas = field.value as string[]
                            newOperativeAreas.push(e);

                            field.onChange(Array.from(newOperativeAreas))
                            setExternal(Array.from(newOperativeAreas))
                        }}
                        showSelected={false}
                    />
                </div>

                <div className="flex flex-wrap gap-y-2 space-x-4 w-full translate-y-3">
                    {field.value && (field.value as string[]).length > 0 && field.value.map((item) => (
                        <Chip
                            text={item}
                            onDelete={(e) => {
                                field.onChange((field.value as string[]).filter(x => x !== e))
                                setExternal((field.value as string[]).filter(x => x !== e))
                            }}
                        ></Chip>
                    ))}
                </div>
            </div>
        }}
    ></Controller>
}

interface AddServiceComponentProps {
    options: TApiAntares[]
    selectedChanged: (string) => void
}

function AddServiceComponent({ options, selectedChanged }: AddServiceComponentProps) {
    const { setValue, control } = useFormFieldContext<MissionFront>('operativeAreas')

    return <Controller
        name={"operativeAreas"}
        control={control}
        render={({ field }) => {

            return <div className='flex items-center w-full'>
                <div className="flex-none w-full">
                    <SelectWithSearch
                        description="Antares"
                        options={options}
                        valueKey={'id'}
                        displayKeys={['id', 'description']}
                        selectionChange={(e) => {
                            if (e == '') return
                            selectedChanged(e)
                        }}
                        showSelected={false}
                    />
                </div>
            </div>
        }}
    ></Controller>
}