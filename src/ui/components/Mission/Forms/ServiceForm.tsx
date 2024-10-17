import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { useActionModalAndCollection } from '../../../core/hooks/useActionModalAndCollection'
import {
    useCollection,
    useSimpleCollection,
} from '../../../core/hooks/useCollection'

import ModalLayout from '../../../core/layouts/modal_layout'
import LoadingModal from '../../../core/modal/LoadingModal'
import { AddableTable } from '../../Temp/AddableTable'
import Button from '../../../core/buttons/Button'
import {
    serviceCrud,
    serviceNameConverter,
    ServiceSchema,
    TService,
} from '../../../../domain/models/service/service'
import { getDefaults } from '../../../core/context/CustomFormContext'
import { AntaresFromApi, TAntares } from '../../../../domain/models/antares/antares'

import InfrastructureForm from './InfrastructureForm'
import {
    infrastructureCrud,
    infrastructureNameConverter,
} from '../../../../domain/models/infrastructure/infrastructure'

import VehicleForm from './VehicleForm'
import {
    vehicleCrud,
    vehicleNameConverter,
} from '../../../../domain/models/vehicle/vehicle_involved'

import PersonForm from './PersonForm'
import {
    personCrud,
    personNameConverter,
} from '../../../../domain/models/person/person_involved'
import { ResultErr } from '../../../../domain/abstractions/types/resulterr'
import AlertController from '../../../core/alerts/AlertController'
import {
    userNameConverter,
    UserSimple,
} from '../../../../domain/models/user/user'
import TextArea from '../../../core/inputs/TextArea'
import {
    unitNameConverter,
    UnitSimple,
} from '../../../../domain/models/unit/unit'
import LocationIcon from '../../../core/icons/LocationIcon'
import { get, getAll, post, remove } from '../../../../services/http'
import { SelectWithSearch } from '../../../alter/components/inputs/select_with_search'
import { EnumToStringArray } from '../../../../utilities/converters/enum_converter'
import { Roles } from '../../../../domain/abstractions/enums/roles'
import { OperativeAreas } from '../../../../domain/abstractions/enums/operative_areas'
import TextInput from '../../../alter/components/inputs/text_input'
import LocationForm from './LocationForm'
import { LocationCrud, ServiceLocationSchemaType } from '../../../../domain/models/location/location'
import { formatDateTime } from '../../../../utilities/formatters/date_formatter'
import Toggle from '../../../alter/components/buttons/toggle'
import _ from 'lodash'
import Chip from '../../../alter/components/data_presenters/chip'
import { modalService } from '../../../core/overlay/overlay_service'
import { ApiMissionAuthoritySummaryType, MissionAuthoritySummaryNameConverter } from '../../../../domain/models/authority/mission_authority'
import FormSelectWithSearch from '../../../alter/components/form_inputs/form_select_with_search'
import Form from '../../../alter/components/form/form'
import { StationSchemaBasicDataType } from '../../../../domain/models/stations/station'
import { HealthCareCenterSchemaBasicDataType } from '../../../../domain/models/healthcare_center/healthcare_center'
import FormInput from '../../../alter/components/form_inputs/form_input'
import FormTextArea from '../../../alter/components/form_inputs/form_text_area'
import FormToggle from '../../../alter/components/form_inputs/form_toggle'
import { useFormContext, useFormFieldContext } from '../../../alter/components/form/form_context'
import FormChips from '../../../alter/components/form_inputs/form_chips'
import { Controller } from 'react-hook-form'
import DateTimePicker from '../../../core/datetime_picker/DateTimePicker'

const alertController = new AlertController()

interface ServiceFormProps {
    missionId: string
    initValue?: TService
    closeOverlay?: () => void
}



const LocationAutoSetComponent = ({ locations, preLocationRef, lastLocationButtonPressedRef, currentLocationId, currentLocationIdDestination }:
    {
        locations: ServiceLocationSchemaType[],
        preLocationRef: React.MutableRefObject<ServiceLocationSchemaType[]>,
        lastLocationButtonPressedRef: React.MutableRefObject<string | null>,
        currentLocationId: string,
        currentLocationIdDestination: string,

    }) => {

    const { setValue } = useFormContext<TService>()


    const buttonRef = useRef<HTMLButtonElement>(null)

    useEffect(() => {

        if (!locations || locations.length == 0) return;


        if (preLocationRef.current?.length == locations.length) return;

        const newLocation = locations.find(location =>
            !preLocationRef.current?.some(preLocation => preLocation.id === location.id)
        );

        preLocationRef.current = locations;

        if (!newLocation) {
            return
        }

        if (lastLocationButtonPressedRef.current == 'ORIGEN' &&
            currentLocationId != newLocation?.id) {

            lastLocationButtonPressedRef.current = null
            setValue("locationId", newLocation?.id ?? '')
            buttonRef.current?.click()
            return
        }

        if (lastLocationButtonPressedRef.current == 'DESTINO' &&
            currentLocationIdDestination != newLocation?.id) {

            lastLocationButtonPressedRef.current = null
            setValue("locationDestinyId", newLocation?.id ?? '')
            buttonRef.current?.click()
            return
        }
    }, [locations])
    return (<>
        <button ref={buttonRef} className='h-0 w-0 hidden' />
    </>)
}


const ServiceForm = ({
    missionId,
    initValue,
    closeOverlay,
}: ServiceFormProps) => {
    const [initialValue, setInitialValue] = useState({
        ...initValue,
        missionId,
        manualServiceDate: initValue ? initValue.manualServiceDate : new Date().toLocaleString('es-VE', {
            timeZone: 'America/Caracas',
            hour12: false
        }),
        pendingForData: initValue ? initValue.pendingForData : true
    })




    const [serviceId, setServiceId] = useState(initialValue ? initialValue?.id ?? '-1' : '-1')

    const [autorities, setAutorities] = useState<ApiMissionAuthoritySummaryType[]>([])
    const [serviceAuthorities, setServiceAuthorities] = useState<ApiMissionAuthoritySummaryType[]>([])



    const [serviceDate, setServiceDate] = useState<Date | null>(() => {

        if (initialValue && initialValue.manualServiceDate) {

            // Parse the date string in the format "DD-MM-YYYY HH:mm:ss"
            try {
                const parts = initialValue.manualServiceDate.split(/[-\s:]/);

                if (parts.length === 6) {
                    const [day, month, year, hours, minutes, seconds] = parts;
                    const date = new Date(+year, +month - 1, +day, +hours, +minutes, +seconds);
                    if (!isNaN(date.getTime())) {
                        return date;
                    }
                }
            } catch (error) {
                console.error("Error parsing date:", error);
                return new Date();
            }

        }
        return new Date();
    });



    const preLocationRef = useRef<ServiceLocationSchemaType[]>([])
    const lastLocationButtonPressedRef = useRef<string | null>(null)



    const [isImportant, setIsImportant] = useState<boolean>(
        initialValue ? initialValue.isImportant ?? false : false
    )

    const [operativeAreas, setOperativeAreas] = useState<string[]>(
        initialValue ? initialValue.operativeAreas ?? [] : []
    )
    console.log("Set newOperativeAreas", operativeAreas);


    const [locationActions, locations] = useActionModalAndCollection(
        LocationForm,
        LocationCrud,
        { missionId: missionId },
        missionId
    )

    const [infrastructureActions, infrastructures] =
        useActionModalAndCollection(
            InfrastructureForm,
            infrastructureCrud,
            { serviceId: serviceId ?? '' },
            serviceId ?? ''
        )
    const [vehicleActions, vehicles] = useActionModalAndCollection(
        VehicleForm,
        vehicleCrud,
        { serviceId: serviceId ?? '' },
        serviceId ?? ''
    )
    const [personActions, people] = useActionModalAndCollection(
        PersonForm,
        personCrud,
        { serviceId: serviceId ?? '' },
        serviceId ?? ''
    )

    const usersCollection: UserSimple[] = useSimpleCollection('user')
    const unitsCollection: UnitSimple[] = useSimpleCollection('unit')

    const [serviceUsers, setServiceUsers] = useState<UserSimple[]>([])
    const [serviceUnits, setServiceUnits] = useState<UnitSimple[]>([])


    const [loading, setLoading] = useState(false)

    const operativeAreasCollection = useMemo(() => EnumToStringArray(OperativeAreas), [])
    const roles = useMemo(() => {
        if (serviceUsers.length == 0 || serviceUsers.filter(x => x.service_role.toLocaleLowerCase() == 'comandante').length == 0) return EnumToStringArray(Roles)
        else return [Roles.Auxiliary.toString(), Roles.Driver.toString()]
    }, [serviceUsers])


    console.log("roles", roles);


    useEffect(() => {
        updateUnits()
        updateUsers()
        updateServiceAuthorities()

    }, [])

    function updateAuthoritiesData() {
        async function update() {
            setLoading(true)

            const result = await get<ApiMissionAuthoritySummaryType[]>(`mission/authority/summary/${missionId}`)

            if (result.success && result.result) setAutorities(result.result)
            else setAutorities([])

            setLoading(false)
        }

        update();
    }


    async function updateUnits() {
        const result = await get<UnitSimple[]>(
            `mission/service/unit/${serviceId}`
        )
        if (result.success && result.result) setServiceUnits(result.result)
        console.log(result)
    }

    async function updateUsers() {
        const result = await get<UserSimple[]>(
            `mission/service/user/${serviceId}`
        )
        if (result.success && result.result) setServiceUsers(result.result)
        console.log(result)
    }

    const [count, setCount] = useState(0)

    const getAntares = useCallback(async () => {
        const response = await getAll<TAntares>(
            'mission/antares',
            AntaresFromApi
        )
        if (response.success && response.result)
            return response.result
        else return []
    }, [])

    const getStations = useCallback(async () => {
        const response = await getAll<StationSchemaBasicDataType>(
            'station'
        )
        if (response.success && response.result)
            return response.result
        else return []
    }, [])

    const getCareCenters = useCallback(async () => {
        const response = await getAll<HealthCareCenterSchemaBasicDataType>(
            'center'
        )
        console.log("centers", response.result);

        if (response.success && response.result)
            return response.result
        else return []
    }, [])



    let debounceUpdate = _.debounce(function () {
        setCount(count + 1)
    }, 1000)

    useEffect(() => {
        updateAuthoritiesData()
        updateServiceAuthorities()
    }, [])

    async function addAuthority(authority: string) {
        const authorityResult = await post("mission/authority/service/create", { mission_id: missionId, service_id: serviceId, authority_id: authority })

        if (authorityResult.success) {
            modalService.toastSuccess("Autoridad agregada")
            updateServiceAuthorities()
        }
        else modalService.toastError("No se pudo agregar la autoridad")
    }

    async function deleteAuthority(authority: string) {
        const authorityResult = await remove("mission/authority/service", authority.split(" - ")[0])

        if (authorityResult.success) {
            modalService.toastSuccess("Autoridad eliminada")
            updateServiceAuthorities()
        }
        else modalService.toastError("No se pudo eliminar la autoridad")
    }

    async function updateServiceAuthorities() {
        const authorityResult = await get<ApiMissionAuthoritySummaryType[]>(`mission/authority/service/group/${serviceId}`)

        if (authorityResult.success && authorityResult.result) {
            setServiceAuthorities(authorityResult.result)
        }
    }

    function formIsEnable(): boolean {
        return serviceId != '-1'
    }


    const levels = useMemo(() => ["NIVEL 1", "NIVEL 2", "NIVEL 3", "NIVEL 4"], [])
    const cancelReasons = useMemo(() => ["ALARMA FALSA", "ALARMA INFUNDADA", "ATENDIDO NO EFECTUADO", "ATENCION NO REALIZADA"], [])

    async function addUnitHandler(unit: string, ignore: any) {

        const service = await serviceCrud.getById(serviceId ?? '')

        if (service.success && service.result && service.result.units) {
            if (!service.result.units.includes(unit)) {
                service.result.units.push(unit)

                const resultService = await serviceCrud.update(service.result)
                if (resultService.success) {
                    alertController.notifySuccess('Unidad guardada')
                    updateUnits()
                }
            } else
                alertController.notifyInfo(
                    'La unidad ya se encuentra registrada en el servicio'
                )
        }
    }

    async function deleteUnitHandler(unit: string) {
        const service = await serviceCrud.getById(serviceId ?? '')

        if (service.success && service.result && service.result.units) {
            service.result.units = service.result.units.filter((x) => x != unit)

            const resultService = await serviceCrud.update(service.result)
            if (resultService.success) {
                alertController.notifySuccess('Unidad eliminada')
                updateUnits()
            }
        }
    }

    async function addUserHandler(unit: string, rol: string) {

        const newUser = usersCollection.filter(x => x.id == unit)[0]

        if (
            serviceUsers.filter((x) => x.personal_code == newUser.personal_code && x.legal_id == newUser.legal_id)
                .length > 0
        ) {
            alertController.notifyInfo(
                'El bombero ya se encuentra registrado en el servicio'
            )
            return
        }

        const service = await post('mission/firefighter/create', {
            mission_id: missionId,
            service_id: serviceId,
            user_id: unit,
            service_role: rol,
        })

        if (service.success) {
            modalService.toastSuccess('Bombero guardado!')
            updateUsers()
        } else
            modalService.toastError(
                'Ocurrió un error al intentar guardar el bombero!'
            )
    }

    async function deleteUserHandler(unit: string) {
        const result = await remove('mission/firefighter', unit)
        if (result.success) {
            alertController.notifySuccess('Usuario eliminado')
            updateUsers()
        } else alertController.notifyError('No se pudo eliminar el usuario ...')
    }

    async function submit(data: TService) {

        if (serviceDate) {
            // Format the date to "DD-MM-YYYY HH:mm:ss"

            const formattedDate = serviceDate.toLocaleString('es-VE', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
                timeZone: 'America/Caracas'
            }).replace(/\//g, '-').replace(',', '').trim();

            data.manualServiceDate = formattedDate;
        }
        data.operativeAreas = operativeAreas;
        console.log("submited", data, serviceId);

        let resultService: ResultErr<TService>
        let errorMessage: string = ''

        if (serviceId == '-1') {
            let defaultValue = getDefaults<TService>(ServiceSchema)

            defaultValue = { ...defaultValue, ...data }

            if (defaultValue.antaresId == "" || defaultValue.stationId == "") {
                alertController.notifyError("Debe seleccionar una estación y un antares")
                return
            }

            resultService = await serviceCrud.insert({ ...defaultValue, ...data })
        }
        else {

            //Fix para seguir actualizando despues del insert inciial
            if (data?.id == null || data?.id == "" || data?.id == "-1") {
                data.id = serviceId
            }
            resultService = await serviceCrud.update(data)
        }

        if (resultService! && resultService.success) {
            alertController.notifySuccess(
                serviceId == '-1' ? 'Servicio guardado' : 'Servicio actualizado'
            )

            if (serviceId == '-1') setServiceId(resultService.result!.id)

            return
        } else if (!resultService!.success)
            errorMessage = `Lo sentimos tenemos problemas para ${serviceId == '-1' ? 'agregar' : 'guardar'} el servicio`
        else if (serviceId == '-1' && !resultService!.result?.id)
            errorMessage =
                'El Id no fue retornado en el agregar el servicio'

        if (errorMessage != '') alertController.notifyError(errorMessage)
    }




    return (
        <>
            <ModalLayout
                className="min-w-[80vw]"
                title={'Registro de Datos del Servicio'}
                onClose={closeOverlay}
            >
                <Form schema={ServiceSchema as any} initValue={initialValue as any} onSubmit={submit} className='relative' >
                    <div className="flex space-x-8 w-full">
                        <div className="flex items-center space-x-4 flex-none w-72">
                            <div className="font-semibold text-slate-700 text-xl">
                                Fecha:
                            </div>

                            <DateTimePicker
                                onChange={(date) => {
                                    setServiceDate(date);
                                }}
                                selected={serviceDate}
                                height='h-10'
                                timeInterval={1}
                            />
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="font-semibold text-slate-700 text-xl">
                                Código:
                            </div>
                            <div className="bg-white px-4 py-2 rounded-md h-10 font-semibold text-md">
                                {serviceId}
                            </div>
                        </div>

                        <div className="flex">
                            <FormToggle<TService>
                                width="w-44"
                                height="h-11"
                                fieldName={'isImportant'}
                                option1="Relevante"
                                option2="No Relevante"
                            />
                        </div>

                        <div className="flex">
                            <FormToggle<TService>
                                width="w-48"
                                height="h-11"
                                fieldName={'pendingForData'}
                                option1="Faltan Datos"
                                option2="Datos Completos"
                            />
                        </div>
                    </div>

                    <div className="h-4"></div>



                    <div className=' absolute top-0 left-0 w-full h-full pointer-events-none'>
                        <div className='relative h-full w-full flex'>
                            <div className='w-full'></div>
                            <div className="sticky h-fit z-50 top-[-48px] right-6 pointer-events-auto">
                                <Button
                                    height='h-12'
                                    width='w-44'
                                    colorType="bg-[#3C50E0]"

                                >
                                    <span className='text-lg font-semibold'>Guardar</span>
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="h-8"></div>

                    <div className="flex items-center space-x-8 xl:space-x-6 w-full">
                        <div className="w-full">
                            <div className="flex space-x-4 w-full">
                                <div className="flex-auto w-64">
                                    <FormSelectWithSearch<TService, StationSchemaBasicDataType>
                                        description="Estación"
                                        fieldName={'stationId'}
                                        options={getStations}
                                        valueKey={'id'}
                                        displayKeys={['abbreviation', 'name']}
                                    />
                                </div>

                                <div className="flex-auto w-64">
                                    <FormSelectWithSearch<TService, TAntares>
                                        description="Antares"
                                        fieldName={'antaresId'}
                                        options={getAntares}
                                        valueKey={'id'}
                                        displayKeys={['id', 'description']}
                                    />
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="h-4"></div>

                    <div className="flex space-x-6 pt-4 w-full">
                        <div className="w-full">
                            <div className="space-y-10 w-full">
                                <div className='flex w-full space-x-8'>
                                    <AddableTable
                                        enable={formIsEnable()}
                                        title="Unidades"
                                        data={serviceUnits}
                                        optionsDescription={'Placa'}
                                        options={unitsCollection}
                                        valueKey={'id'}
                                        displayKeys={['plate', 'unit_type']}
                                        nameConverter={unitNameConverter}
                                        onAddOption={addUnitHandler}
                                        onDeleteButtonClick={deleteUnitHandler}
                                        idPropertyName="id"
                                        addButtonText="Agregar una unidad"
                                    ></AddableTable>

                                    <AddableTable
                                        enable={formIsEnable()}
                                        title="Bomberos"
                                        data={serviceUsers}
                                        optionsDescription={'Usuario'}
                                        nameConverter={userNameConverter}
                                        options={usersCollection}
                                        valueKey={'id'}
                                        displayKeys={['personal_code', 'legal_id']}
                                        optionsDescription2={'Rol'}
                                        options2={roles}
                                        preSelectFirstOption2={true}
                                        onAddOption={addUserHandler}
                                        onDeleteButtonClick={deleteUserHandler}
                                        defaultSort={'id'}
                                        idPropertyName="id"
                                        addButtonText="Agregar un bombero"
                                    />
                                </div>

                                <div className='flex space-x-6'>
                                    <div className="flex flex-auto space-x-1 w-24">
                                        <FormSelectWithSearch<TService, ServiceLocationSchemaType>
                                            description="Ubicación de origen del servicio"
                                            fieldName={'locationId'}
                                            options={locations}
                                            valueKey={'id'}
                                            displayKeys={['id', 'alias']}
                                        />

                                        <div className="flex-none pt-8 h-11">
                                            <Button
                                                colorType="bg-[#3C50E0]"
                                                onClick={(e) => {
                                                    preLocationRef.current = locations;
                                                    lastLocationButtonPressedRef.current = 'ORIGEN'

                                                    locationActions.add()
                                                    e.preventDefault()
                                                    e.stopPropagation()
                                                }}
                                                children={'+'}
                                                width="w-10"
                                            ></Button>
                                        </div>
                                    </div>

                                    <div className="flex flex-auto space-x-1 w-24">
                                        <FormSelectWithSearch<TService, ServiceLocationSchemaType>
                                            description="Ubicación de destino"
                                            fieldName={'locationDestinyId'}
                                            options={locations}
                                            valueKey={'id'}
                                            displayKeys={['id', 'alias']}
                                        />

                                        <div className="flex-none pt-8 h-11">
                                            <Button
                                                colorType="bg-[#3C50E0]"
                                                onClick={(e) => {
                                                    preLocationRef.current = locations;
                                                    lastLocationButtonPressedRef.current = 'DESTINO'

                                                    locationActions.add()
                                                    e.preventDefault()
                                                    e.stopPropagation()
                                                }}
                                                children={'+'}
                                                width="w-10"
                                            ></Button>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-6">
                                    <AddOperativeAreaComponent options={operativeAreasCollection} setExternal={setOperativeAreas} />
                                </div>



                                <div className='flex justify-between'>
                                    <div className='flex space-x-4'>
                                        <div className="w-32">
                                            <FormSelectWithSearch<TService, string>
                                                description="Nivel"
                                                fieldName={'level'}
                                                options={levels}
                                            />
                                        </div>

                                        <div className="w-40">
                                            <FormInput<TService>
                                                description={'Cuadrante de Paz'}
                                                fieldName={'peaceQuadrant'}
                                            />
                                        </div>

                                        <div className="w-72">
                                            <FormSelectWithSearch<TService, string>
                                                description="Motivo de Cancelación"
                                                fieldName={'cancelReason'}
                                                options={cancelReasons}
                                            />
                                        </div>
                                    </div>



                                </div>


                                <div className={`h-48 w-full space-y-4 ${formIsEnable() ? '' : 'pointer-events-none opacity-50 select-none'}`}>
                                    <span className="font-semibold text-slate-700 text-xl">
                                        Descripción / Bitacora
                                    </span>

                                    <FormTextArea<TService>
                                        description={''}
                                        fieldName={'description'}
                                        disable={!formIsEnable()}
                                    />
                                </div>

                                <div className='h-4'></div>


                                <div className={`w-full space-y-4 ${formIsEnable() ? '' : 'pointer-events-none opacity-50 select-none'}`}>
                                    <span className="font-semibold text-slate-700 text-xl">
                                        Personas sin documetación
                                    </span>
                                    <div className='flex w-full items-center space-x-4'>
                                        <FormInput<TService>
                                            description={'Ilesos'}
                                            fieldName={'unharmed'}
                                            disable={!formIsEnable()}
                                            type={'Integer'}
                                        />
                                        <FormInput<TService>
                                            description={'Lesionados'}
                                            fieldName={'injured'}
                                            disable={!formIsEnable()}
                                            type={'Integer'}
                                        />
                                        <FormInput<TService>
                                            description={'Trasladados'}
                                            fieldName={'transported'}
                                            disable={!formIsEnable()}
                                            type={'Integer'}
                                        />
                                        <FormInput<TService>
                                            description={'Fallecidos'}
                                            fieldName={'deceased'}
                                            disable={!formIsEnable()}
                                            type={'Integer'}
                                        />
                                    </div>
                                </div>

                                <AddableTable
                                    enable={formIsEnable()}
                                    title="Infraestructuras"
                                    data={infrastructures}
                                    idPropertyName="id"
                                    addButtonText="Agregar una infraestructura"
                                    nameConverter={infrastructureNameConverter}
                                    onAddButtonClick={infrastructureActions.add}
                                    onEditButtonClick={infrastructureActions.edit}
                                    onDeleteButtonClick={
                                        infrastructureActions.delete
                                    }
                                />

                                <AddableTable
                                    enable={formIsEnable()}
                                    title="Vehiculos"
                                    data={vehicles}
                                    idPropertyName="id"
                                    addButtonText="Agregar un vehiculo"
                                    nameConverter={vehicleNameConverter}
                                    onAddButtonClick={vehicleActions.add}
                                    onEditButtonClick={vehicleActions.edit}
                                    onDeleteButtonClick={vehicleActions.delete}
                                />

                                <AddableTable
                                    enable={formIsEnable()}
                                    title="Personas"
                                    data={people}
                                    idPropertyName="id"
                                    addButtonText="Agregar una persona"
                                    nameConverter={personNameConverter}
                                    onAddButtonClick={personActions.add}
                                    onEditButtonClick={personActions.edit}
                                    onDeleteButtonClick={personActions.delete}
                                />

                                <AddableTable
                                    enable={formIsEnable()}
                                    title="Autoridades"
                                    data={serviceAuthorities}
                                    optionsDescription={'Alias'}
                                    options={autorities}
                                    valueKey={'id'}
                                    displayKeys={['id', 'alias']}
                                    nameConverter={MissionAuthoritySummaryNameConverter}
                                    onAddOption={addAuthority}
                                    onDeleteButtonClick={deleteAuthority}
                                    idPropertyName="id"
                                    addButtonText="Agregar una autoridad"
                                ></AddableTable>
                            </div>
                        </div>
                    </div>



                    <LocationAutoSetComponent locations={locations} preLocationRef={preLocationRef}
                        lastLocationButtonPressedRef={lastLocationButtonPressedRef}
                        currentLocationId={initialValue.locationId ?? ''}
                        currentLocationIdDestination={initialValue.locationDestinyId ?? ''}

                    />

                </Form>
            </ModalLayout>

            <LoadingModal initOpen={loading} children={null} />
        </>
    )
}
export default ServiceForm

interface AddOperativeAreaComponentProps {
    options: string[]
    setExternal: React.Dispatch<React.SetStateAction<string[]>>
}
function AddOperativeAreaComponent({ options, setExternal }: AddOperativeAreaComponentProps) {
    const { setValue, control } = useFormFieldContext<TService>('operativeAreas')

    return <Controller
        name={"operativeAreas"}
        control={control}
        render={({ field }) => {

            return <div className='flex items-center space-x-6'>
                <div className="flex-none w-64">
                    <SelectWithSearch
                        description="Áreas operativas"
                        options={options}
                        clearAfterSelect={true}
                        selectionChange={(e) => {
                            if (e == '') return

                            setValue('operativeAreas', (prevValue) => {
                                const newOperativeAreas = new Set(prevValue as string[] ?? []);
                                newOperativeAreas.add(e);
                                setExternal(Array.from(newOperativeAreas))
                                return Array.from(newOperativeAreas);
                            });
                        }}
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