import { FieldValues } from 'react-hook-form'
import React, { useEffect, useState } from 'react'

import FormTitle from '../../../core/titles/FormTitle'


import { EnumToStringArray } from '../../../../utilities/converters/enum_converter'
import { AreaCodes } from '../../../../domain/abstractions/enums/area_codes'

import LoadingModal from '../../../core/modal/LoadingModal'

import { modalService } from '../../../core/overlay/overlay_service.tsx'
import { ResultErr } from '../../../../domain/abstractions/types/resulterr.ts'
import { Genders } from '../../../../domain/abstractions/enums/genders.ts'
import { useActionModalAndCollection } from '../../../core/hooks/useActionModalAndCollection.ts'
import InfrastructureForm from './InfrastructureForm.tsx'
import { infrastructureCrud } from '../../../../domain/models/infrastructure/infrastructure.ts'
import VehicleForm from './VehicleForm.tsx'
import { vehicleCrud } from '../../../../domain/models/vehicle/vehicle_involved.ts'
import { UnitSimple } from '../../../../domain/models/unit/unit.ts'
import { get } from '../../../../services/http.tsx'
import { Condition } from '../../../../domain/abstractions/enums/condition.ts'
import { PersonState } from '../../../../domain/abstractions/enums/person_state.ts'
import ModalLayout from '../../../optimized/components/layouts/modal_layout.tsx'
import { useMissionPersonActions } from '../../../../domain/models/mission/person/use_collection.ts'
import { MissionPersonFront, MissionPersonFrontSchema } from '../../../../domain/models/mission/person/mission_person.ts'
import FormInput from '../../../optimized/components/form_inputs/form_input.tsx'
import FormSelect from '../../../optimized/components/form_inputs/form_select.tsx'
import Form from '../../../optimized/components/form/form.tsx'
import FormSubmit from '../../../optimized/components/form_inputs/form_submit.tsx'
import FormSelectWithSearch from '../../../optimized/components/form_inputs/form_select_with_search.tsx'

interface PersonFormProps {
    initValue?: MissionPersonFront | null
    closeOverlay?: () => void
    add?: boolean
}

export default function PersonForm({
    initValue,
    closeOverlay,
    add = true,
}: PersonFormProps) {
    const personActions = useMissionPersonActions();
    const [isVisible, setIsVisible] = useState(true)
    const [loading, setLoading] = useState(false)

    const [serviceUnits, setServiceUnits] = useState<UnitSimple[]>([])

    const [infrastructureActions, infrastructures] =
        useActionModalAndCollection(
            InfrastructureForm,
            infrastructureCrud,
            { missionId: initValue?.missionId } as any,
            initValue?.missionId ?? ""
        )

    const [vehicleActions, vehicles] = useActionModalAndCollection(
        VehicleForm,
        vehicleCrud,
        { missionId: initValue?.missionId } as any,
        initValue?.missionId ?? ""
    )

    const [unit, setUnit] = useState('')
    const [infrastructure, setInfrastructure] = useState('')
    const [vehicle, setVehicle] = useState('')

    useEffect(() => {
        updateUnits()
    }, [])

    useEffect(() => {
        if (initValue && serviceUnits && serviceUnits.length > 0) {
            const x = serviceUnits.filter((x) =>
                x.id == initValue!.unitId)[0];

            if (x)
                setUnit(`${x.plate}`)
        }
    }, [serviceUnits])

    useEffect(() => {
        if (initValue && infrastructures && infrastructures.length > 0) {
            const x = infrastructures.filter(
                (x) => x.id == initValue!.infrastructureId
            )[0]

            if (x)
                setInfrastructure(`${x.id}`)
        }
    }, [infrastructures])

    useEffect(() => {
        if (initValue && vehicles && vehicles.length > 0) {
            const x = vehicles.filter((x) => x.id == initValue!.vehicleId)[0]
            if (x)
                setVehicle(`${x.id} - ${x.licensePlate}`)
        }
    }, [vehicles])


    const buttonText = add ? 'Guardar' : 'Actualizar'

    async function updateUnits() {
        const result = await get<UnitSimple[]>(
            `mission/service/unit/${initValue?.missionId}`
        )
        if (result.success && result.result) setServiceUnits(result.result)
        console.log(result)
    }


    async function handleSubmitInternal(data: FieldValues) {
        setLoading(true)

        try {
            const parsed = MissionPersonFrontSchema.parse(data)

            //SE MAPEA ID PORQUE ES LO QUE ESPERA EL BACKEND 
            if (parsed.vehicleId && parsed.vehicleId != "" && parsed.vehicleId != initValue?.vehicleId) {
                parsed.vehicleId = parsed.vehicleId.split(" - ")[0].trim()
            }

            //SE MAPEA ID PORQUE ES LO QUE ESPERA EL BACKEND 
            if (parsed.unitId && parsed.unitId != "" && parsed.unitId != initValue?.unitId) {
                parsed.unitId = serviceUnits.filter(x => x.plate == parsed.unitId)?.[0]?.id
            }

            //SIN CAMBIOS PORQUE ES EL ID
            parsed.infrastructureId = parsed.infrastructureId;


            var result: ResultErr<MissionPersonFront>

            if (add) result = await personActions.insertFront(parsed)
            else result = await personActions.updateFront(parsed)

            if (result.success) {
                modalService.toastSuccess(
                    `Persona ${buttonText.replace('dar', 'dada')}`
                )
                handleClose()
            } else
                modalService.toastError(
                    `No se pudo guardar la persona por: ${result.result}`
                )
        } catch (error) {
            modalService.toastError(`Error inesperado por: ${error.message}`)
        } finally {
            setLoading(false)
        }
    }

    function handleClose() {
        if (closeOverlay) closeOverlay()
    }

    return (
        <>
            <ModalLayout
                title={'Registro de Persona'}
                isVisible={isVisible}
                onClosed={closeOverlay}
                onClose={() => {
                    setIsVisible(false)
                }}
            >
                <Form
                    schema={MissionPersonFrontSchema}
                    initValue={{ ...initValue, serviceId: initValue?.missionId }}
                    onSubmit={handleSubmitInternal}
                >
                    <div className="md:flex md:md:items-start md:space-x-2 pb-8">
                        <FormSelectWithSearch<MissionPersonFront, any>
                            fieldName={'vehicleId'}
                            description={'Vehiculo Involucrado:'}
                            options={vehicles.map(
                                (x) => `${x.id} - ${x.licensePlate}`
                            )}
                        />
                        <FormSelectWithSearch<MissionPersonFront, any>
                            fieldName={'infrastructureId'}
                            description={'Infraestructura Involucrada:'}
                            options={infrastructures.map((x) => String(x.id))}
                        />
                        <FormSelectWithSearch<MissionPersonFront, any>
                            fieldName={'unitId'}
                            description={'Vehiculo de Traslado:'}
                            options={serviceUnits.map((x) => x.plate)}
                        />
                    </div>

                    <FormTitle title="Datos de la persona" />

                    <div className="space-y-3 px-2 w-full max-w-[820px]">
                        <div className="md:flex md:md:items-start md:space-x-2">
                            <FormInput<MissionPersonFront>
                                fieldName={'firstName'}
                                description="Nombre:"
                            />

                            <FormInput<MissionPersonFront>
                                fieldName={'lastName'}
                                description="Apellido:"
                            />

                            <div className="w-[30rem]">
                                <FormSelect<MissionPersonFront, any>
                                    fieldName={'gender'}
                                    description={'Genero:'}
                                    options={EnumToStringArray(Genders)}
                                />
                            </div>

                            <div className="w-44">
                                <FormInput<MissionPersonFront>
                                    fieldName={'age'}
                                    description="Edad:"
                                />
                            </div>
                        </div>

                        <div className="md:flex md:md:items-start md:space-x-2">
                            <div className="w-full">
                                <FormInput<MissionPersonFront>
                                    fieldName={'idDocument'}
                                    description="Documento de Identidad:"
                                />
                            </div>

                            <FormInput<MissionPersonFront>
                                fieldName={'phoneNumber'}
                                description="Número de Teléfono:"
                            />
                        </div>

                        <div className="md:flex md:md:items-start md:space-x-2">
                            <FormSelect<MissionPersonFront, any>
                                fieldName={'employmentStatus'}
                                description={'Estado físico:'}
                                options={EnumToStringArray(PersonState)}
                            />

                            <FormInput<MissionPersonFront>
                                fieldName={'pathology'}
                                description="Patología:"
                            />
                        </div>

                        <FormSelect<MissionPersonFront, any>
                            fieldName={'condition'}
                            description={'Condición:'}
                            options={EnumToStringArray(Condition)}
                        />

                        <div className="h-4"></div>

                        <div className="md:flex md:md:items-start md:space-x-2">
                            <FormInput<MissionPersonFront>
                                fieldName={'observations'}
                                description="Observaciones:"
                            />
                        </div>
                    </div>

                    <div className="h-8"></div>

                    <FormTitle title="Dirección de Domicilio" />

                    <div className="space-y-3 px-2 w-full max-w-[820px]">
                        {/* <div className="md:flex md:md:items-start md:space-x-2">
                            <FormInput<TPersonInvolved>
                                fieldName={'state'}
                                description="Estado:"
                            />

                            <FormInput<TPersonInvolved>
                                fieldName={'municipality'}
                                description="Municipio:"
                            />

                            <FormInput<TPersonInvolved>
                                fieldName={'parish'}
                                description="Parroquia:"
                            />
                        </div> */}

                        <FormInput<MissionPersonFront>
                            fieldName={'address'}
                            description="Dirección:"
                        />
                    </div>

                    <div className="h-8"></div>

                    <div className="flex flex-col space-y-4">
                        <div className="flex justify-end space-x-8">
                            <FormSubmit
                                colorType="bg-[#3C50E0]"
                                description={buttonText}
                            />
                        </div>
                    </div>
                </Form>
            </ModalLayout>

            <LoadingModal initOpen={loading} children={null} />
        </>
    )
}
