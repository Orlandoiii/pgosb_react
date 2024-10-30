import React, { useMemo, useState } from 'react'


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
import { useMissionInfraestructureCollection } from '../../../../domain/models/mission/infraestructure/use_collection'
import { useMissionVehicleCollection } from '../../../../domain/models/mission/vehicle/use_collection'
import { useMissionPersonCollection } from '../../../../domain/models/mission/person/use_collection'
import { useMissionServiceCollection } from '../../../../domain/models/mission/service/use_collection'
import { MissionServiceNameConverter } from '../../../../domain/models/mission/service/mission_service'
import { MissionLocationFront, MissionLocationNameConverter } from '../../../../domain/models/mission/location/mission_location'
import { MissionInfraestructureNameConverter } from '../../../../domain/models/mission/infraestructure/mission_infraestructure'
import { MissionVehicleNameConverter } from '../../../../domain/models/mission/vehicle/mission_vehicle'
import { MissionPersonNameConverter } from '../../../../domain/models/mission/person/mission_person'
import { MissionAuthorityNameConverter } from '../../../../domain/models/mission/authority/mission_authority'


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

    // const [missionServices, missionServicesActions] = useMissionServiceCollection(initValue?.id ?? '')

    const [missionUnits, missionUnitsActions] = useMissionUnitCollection(initValue?.id ?? '')
    const [units] = useMissionUnitCollection('', 'ALL')
    const [missionFirefighters, missionFirefightersActions] = useMissionFirefighterCollection(initValue?.id ?? '')
    const [firefighters] = useMissionFirefighterCollection('', 'ALL')

    const [missionLocations, missionLocationsActions] = useMissionLocationCollection(initValue?.id ?? '')

    const [missionInfrastructures, missionInfrastructuresActions] = useMissionInfraestructureCollection(initValue?.id ?? '')
    const [missionVehicles, missionVehiclesActions] = useMissionVehicleCollection(initValue?.id ?? '')
    const [missionPeople, missionPeopleActions] = useMissionPersonCollection(initValue?.id ?? '')

    const [missionAuthorities, missionAuthoritiesActions] = useMissionAuthorityCollection(initValue?.id ?? '')

    const [stations, stationsActions, updatestations] = useStationCollection();

    const roles = useMemo(() => {
        if (missionFirefighters.length == 0 || missionFirefighters.filter(x => x.serviceRole.toLocaleLowerCase() == 'comandante').length == 0) return EnumToStringArray(Roles)
        else return [Roles.Auxiliary.toString(), Roles.Driver.toString()]
    }, [missionFirefighters])
    console.log(initValue?.id, missionFirefighters, missionUnits);

    const cancelReasons = useMemo(() => ["ALARMA FALSA", "ALARMA INFUNDADA", "ATENDIDO NO EFECTUADO", "ATENCION NO REALIZADA"], [])
    const operativeAreas = useMemo(() => EnumToStringArray(OperativeAreas), [])
    const levels = useMemo(() => ["NIVEL 1", "NIVEL 2", "NIVEL 3", "NIVEL 4"], [])
    // async function addNewAuthority() {
    //     var errorMessage: string = ''
    //     try {
    //         setLoading(true)

    //         const newAuthority = getDefaults<ApiMissionAuthorityType>(ApiMissionAuthoritySchema)
    //         newAuthority.mission_id = missionId

    //         const authorityResult = await missionAuthorityCrud.insert(
    //             newAuthority
    //         )

    //         if (authorityResult.success && authorityResult.result?.id) {
    //             modalService.pushModal(
    //                 AuthorityForm,
    //                 {
    //                     initValue: authorityResult.result,
    //                     closeOverlay: undefined,
    //                 },
    //                 new OverlayModalConfig(),
    //                 updateAuthoritiesData
    //             )
    //         } else if (!authorityResult.success)
    //             errorMessage =
    //                 'Lo sentimos tenemos problemas para agregar la autoridad'
    //         else if (!authorityResult.result?.id) {
    //             errorMessage = 'El Id no fue retornado en el agregar la autoridad'
    //         }
    //     } catch (error) {
    //         errorMessage =
    //             'Lo sentimos ocurrio un error inesperado al agregar la autoridad'
    //         console.error(error)
    //     } finally {
    //         setLoading(false)
    //     }
    //     if (errorMessage != '') modalService.pushAlert('Error', errorMessage)
    // }

    // async function openAuthority(authority: any) {
    //     const result = await missionAuthorityCrud.getById(authority)

    //     if (result.success && result.result) {
    //         modalService.pushModal(
    //             AuthorityForm,
    //             {
    //                 initValue: result.result,
    //                 closeOverlay: undefined,
    //             },
    //             new OverlayModalConfig(),
    //             updateAuthoritiesData
    //         )
    //     } else {
    //         modalService.pushAlert(
    //             'Error',
    //             `No se pudo abrir la autoridad por: ${result.error}`
    //         )
    //     }
    // }

    // async function deleteAuthority(authority: any) {
    //     const result = await missionAuthorityCrud.remove(authority)

    //     if (result.success) {
    //         modalService.toastSuccess("Autoridad eliminada")
    //         updateAuthoritiesData()
    //     }
    //     else modalService.pushAlert(
    //         'Error',
    //         `No se pudo abrir la autoridad por: ${result.error}`
    //     )
    // }

    async function submit(data: any) {

    }


    return (
        <>
            <ModalLayout
                isVisible={isVisible}
                className="min-w-[80vw]"
                title={'Registro de la Misión'}
                onClose={closeOverlay}
            >
                <Form className='relative' schema={MissionFrontSchema as any} initValue={initValue} onSubmit={submit} >
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
                                    //  setServiceDate(date);
                                }}
                                selected={new Date()}
                                height='h-10'
                                timeInterval={1}
                            />
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="font-semibold text-slate-700 text-xl">
                                Código:
                            </div>
                            <div className="bg-white px-4 py-2 rounded-md h-10">
                                {initValue?.code}
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
                            />
                        </div>

                        <div className='w-full'></div>
                    </div>

                    <div className="h-2"></div>


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

                    <AddableTable
                        title="Servicios"
                        data={missionUnits ?? []}
                        defaultSort={'id'}
                        idPropertyName="id"
                        nameConverter={MissionUnitNameConverter}

                        addButtonText="Agregar una unidad"
                        options={units}
                        optionsDescription={'Placa'}
                        valueKey={'id'}
                        displayKeys={['plate', 'unitType']}
                        // onAddButtonClick={servicesActions}
                        onDeleteButtonClick={missionUnitsActions.remove}
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
                            // onAddButtonClick={servicesActions}
                            onDeleteButtonClick={missionUnitsActions.remove}
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
                            // onAddButtonClick={servicesActions}
                            onDeleteButtonClick={missionFirefightersActions.remove}
                        ></AddableTable>
                    </div>

                    <div className="h-8"></div>

                    <div className='flex space-x-8'>
                        <div className="flex flex-auto space-x-1 w-24">
                            <FormSelectWithSearch<MissionFront, MissionLocationFront>
                                description="Ubicación de origen del servicio"
                                fieldName={'locationId'}
                                options={missionLocations}
                                valueKey={'id'}
                                displayKeys={['id', 'alias']}
                            />

                            <div className="flex-none pt-8 h-11">
                                <Button
                                    colorType="bg-[#3C50E0]"
                                    onClick={(e) => {
                                        // preLocationRef.current = locations;
                                        // lastLocationButtonPressedRef.current = 'ORIGEN'

                                        // locationActions.add()
                                        e.preventDefault()
                                        e.stopPropagation()
                                    }}
                                    children={'+'}
                                    width="w-10"
                                ></Button>
                            </div>
                        </div>

                        <div className="flex flex-auto space-x-1 w-24">
                            <FormSelectWithSearch<MissionFront, MissionLocationFront>
                                description="Ubicación de destino"
                                fieldName={'locationDestinyId'}
                                options={missionLocations}
                                valueKey={'id'}
                                displayKeys={['id', 'alias']}
                            />

                            <div className="flex-none pt-8 h-11">
                                <Button
                                    colorType="bg-[#3C50E0]"
                                    onClick={(e) => {
                                        // preLocationRef.current = locations;
                                        // lastLocationButtonPressedRef.current = 'DESTINO'

                                        // locationActions.add()
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

                    <div className='flex space-x-8'>
                        <SelectWithSearch
                            description="Áreas operativas"
                            options={operativeAreas}
                            selectionChange={(e) => {
                                if (e == '') return

                                // setValue('operativeAreas', (prevValue) => {
                                //     const newOperativeAreas = new Set(prevValue as string[] ?? []);
                                //     newOperativeAreas.add(e);
                                //     setExternal(Array.from(newOperativeAreas))
                                //     return Array.from(newOperativeAreas);
                                // });
                            }}
                        />
                        <div className='w-full'>

                        </div>
                    </div>

                    <div className="flex space-x-6 w-full">
                        <div className="w-32">
                            <FormSelectWithSearch<MissionFront, string>
                                description="Nivel"
                                fieldName={'level'}
                                options={levels}
                            />
                        </div>

                        <div className="w-40">
                            <FormInput<MissionFront>
                                description={'Cuadrante de Paz'}
                                fieldName={'peaceQuadrant'}
                            />
                        </div>

                        <div className=" w-64">
                            <FormSelectWithSearch<MissionFront, string>
                                description="Motivo de Cancelación"
                                fieldName={'cancelReason'}
                                options={cancelReasons}
                            />
                        </div>
                    </div>

                    {/* 
                <div className="h-8"></div>

                <AddableTable
                    title="Servicios"
                    data={missionServices ?? []}
                    defaultSort={'id'}
                    idPropertyName="id"
                    addButtonText="Agregar un servicio"
                    nameConverter={MissionServiceNameConverter}
                    // onAddButtonClick={servicesActions}
                    // onEditButtonClick={serviceActions.edit}
                    onDeleteButtonClick={missionServicesActions.remove}
                ></AddableTable> */}

                    <div className="h-8"></div>

                    <AddableTable
                        title="Ubicaciones"
                        data={missionLocations ?? []}
                        defaultSort={'state'}
                        idPropertyName="id"
                        addButtonText="Agregar una ubicación"
                        nameConverter={MissionLocationNameConverter}
                        // onAddButtonClick={locationActions.add}
                        // onEditButtonClick={locationActions.edit}
                        onDeleteButtonClick={missionLocationsActions.remove}
                    ></AddableTable>

                    <div className="h-8"></div>

                    <AddableTable
                        title="Infraestructuras"
                        data={missionInfrastructures ?? []}
                        idPropertyName="id"
                        addButtonText="Agregar una infraestructura"
                        nameConverter={MissionInfraestructureNameConverter}
                        // onAddButtonClick={infrastructureActions.add}
                        // onEditButtonClick={infrastructureActions.edit}
                        onDeleteButtonClick={missionInfrastructuresActions.remove}
                    />

                    <div className="h-8"></div>

                    <AddableTable
                        title="Vehiculos"
                        data={missionVehicles ?? []}
                        idPropertyName="id"
                        addButtonText="Agregar un vehiculo"
                        nameConverter={MissionVehicleNameConverter}
                        // onAddButtonClick={vehicleActions.add}
                        // onEditButtonClick={vehicleActions.edit}
                        onDeleteButtonClick={missionVehiclesActions.remove}
                    />

                    <div className="h-8"></div>

                    <AddableTable
                        title="Personas"
                        data={missionPeople ?? []}
                        idPropertyName="id"
                        addButtonText="Agregar una persona"
                        nameConverter={MissionPersonNameConverter}
                        // onAddButtonClick={personActions.add}
                        // onEditButtonClick={personActions.edit}
                        onDeleteButtonClick={missionPeopleActions.remove}
                    />

                    <AddableTable
                        title="Autoridades"
                        data={missionAuthorities ?? []}
                        defaultSort={'id'}
                        idPropertyName="id"
                        addButtonText="Agregar una autoridad"
                        nameConverter={MissionAuthorityNameConverter}
                        // onAddButtonClick={addNewAuthority}
                        // onEditButtonClick={openAuthority}
                        onDeleteButtonClick={missionAuthoritiesActions.remove}
                    ></AddableTable>


                </Form>
            </ModalLayout>
            <LoadingModal initOpen={loading} children={null} />

        </>
    )
}

export default MissionForm
