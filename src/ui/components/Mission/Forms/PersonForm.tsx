import { FieldValues } from 'react-hook-form'
import React, { useEffect, useState } from 'react'

import FormTitle from '../../../core/titles/FormTitle'
import Button from '../../../core/buttons/Button'

import {
    TPersonInvolved,
    PersonInvolvedSchema,
} from '../../../../domain/models/person/person_involved'
import { EnumToStringArray } from '../../../../utilities/converters/enum_converter'
import { AreaCodes } from '../../../../domain/abstractions/enums/area_codes'

import CustomForm from '../../../core/context/CustomFormContext.tsx'
import FormInput from '../../../core/inputs/FormInput.tsx'
import FormSelect from '../../../core/inputs/FormSelect.tsx'

import { personCrud } from '../../../../domain/models/person/person_involved'

import LoadingModal from '../../../core/modal/LoadingModal'

import { modalService } from '../../../core/overlay/overlay_service.tsx'
import ModalLayout from '../../../core/layouts/modal_layout.tsx'
import { ResultErr } from '../../../../domain/abstractions/types/resulterr.ts'
import { Genders } from '../../../../domain/abstractions/enums/genders.ts'
import { DocumentTypes } from '../../../../domain/abstractions/enums/document_types.ts'
import FormSelectSearch from '../../../core/inputs/FormSelectSearch.tsx'
import { useActionModalAndCollection } from '../../../core/hooks/useActionModalAndCollection.ts'
import InfrastructureForm from './InfrastructureForm.tsx'
import { infrastructureCrud } from '../../../../domain/models/infrastructure/infrastructure.ts'
import VehicleForm from './VehicleForm.tsx'
import { vehicleCrud } from '../../../../domain/models/vehicle/vehicle_involved.ts'
import { UnitSimple } from '../../../../domain/models/unit/unit.ts'
import { get } from '../../../../services/http.tsx'
import { useSimpleCollection } from '../../../core/hooks/useCollection.ts'
import { Condition } from '../../../../domain/abstractions/enums/condition.ts'
import { PersonState } from '../../../../domain/abstractions/enums/person_state.ts'
import { documentIdMask, numberMask } from '../../../core/inputs/Common/Mask.ts'
import logger from '../../../../logic/Logger/logger.js'

interface PersonFormProps {
    serviceId: string
    initValue?: TPersonInvolved | null
    onClose?: (success: boolean) => void
    closeOverlay?: () => void
    add?: boolean
}

const PersonForm = ({
    serviceId,
    initValue,
    onClose,
    closeOverlay,
    add = true,
}: PersonFormProps) => {
    const [serviceUnits, setServiceUnits] = useState<UnitSimple[]>([])
    const [loading, setLoading] = useState(false)

    const [infrastructureActions, infrastructures] =
        useActionModalAndCollection(
            InfrastructureForm,
            infrastructureCrud,
            { serviceId: serviceId },
            serviceId
        )

    const [vehicleActions, vehicles] = useActionModalAndCollection(
        VehicleForm,
        vehicleCrud,
        { serviceId: serviceId },
        serviceId
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


    const buttonText = initValue ? 'Actualizar' : 'Guardar'

    async function updateUnits() {
        const result = await get<UnitSimple[]>(
            `mission/service/unit/${serviceId}`
        )
        if (result.success && result.result) setServiceUnits(result.result)
        console.log(result)
    }


    async function handleSubmitInternal(data: FieldValues) {
        setLoading(true)

        try {
            const parsed = PersonInvolvedSchema.parse(data)

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


            var result: ResultErr<TPersonInvolved>

            if (add) result = await personCrud.insert(parsed)
            else result = await personCrud.update(parsed)

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
        if (onClose) onClose(false)
    }

    return (
        <>
            <ModalLayout
                className="max-w-[85vw]"
                title={'Registro de Persona'}
                onClose={handleClose}
            >
                <CustomForm
                    schema={PersonInvolvedSchema}
                    initValue={{ ...initValue, serviceId: serviceId }}
                    onSubmit={handleSubmitInternal}
                >
                    <div className="md:flex md:md:items-start md:space-x-2 pb-8">
                        <FormSelectSearch<TPersonInvolved>
                            fieldName={'vehicleId'}
                            description={'Vehiculo Involucrado:'}
                            initialValue={vehicle ?? ""}
                            options={vehicles.map(
                                (x) => `${x.id} - ${x.licensePlate}`
                            )}
                        />
                        <FormSelectSearch<TPersonInvolved>
                            fieldName={'infrastructureId'}
                            description={'Infraestructura Involucrada:'}
                            initialValue={infrastructure ?? ""}
                            options={infrastructures.map((x) => String(x.id))}
                        />
                        <FormSelectSearch<TPersonInvolved>
                            fieldName={'unitId'}
                            description={'Vehiculo de Traslado:'}
                            initialValue={unit ?? ""}
                            options={serviceUnits.map((x) => x.plate)}
                        />
                    </div>

                    <FormTitle title="Datos de la persona" />

                    <div className="space-y-3 px-2 w-full max-w-[820px]">
                        <div className="md:flex md:md:items-start md:space-x-2">
                            <FormInput<TPersonInvolved>
                                fieldName={'firstName'}
                                description="Nombre:"
                            />

                            <FormInput<TPersonInvolved>
                                fieldName={'lastName'}
                                description="Apellido:"
                            />

                            <div className="w-[30rem]">
                                <FormSelect<TPersonInvolved>
                                    fieldName={'gender'}
                                    description={'Genero:'}
                                    options={EnumToStringArray(Genders)}
                                />
                            </div>

                            <div className="w-44">
                                <FormInput<TPersonInvolved>
                                    fieldName={'age'}
                                    description="Edad:"
                                    mask={numberMask}
                                />
                            </div>
                        </div>

                        <div className="md:flex md:md:items-start md:space-x-2">
                            <div className="w-full">
                                <FormInput<TPersonInvolved>
                                    fieldName={'idDocument'}
                                    description="Documento de Identidad:"
                                    mask={documentIdMask}
                                />
                            </div>

                            <FormInput<TPersonInvolved>
                                mask={numberMask}
                                fieldName={'phoneNumber'}
                                description="Número de Teléfono:"
                            />
                        </div>

                        <div className="md:flex md:md:items-start md:space-x-2">
                            <FormSelect<TPersonInvolved>
                                fieldName={'employmentStatus'}
                                description={'Estado físico:'}
                                options={EnumToStringArray(PersonState)}
                            />

                            <FormInput<TPersonInvolved>
                                fieldName={'pathology'}
                                description="Patología:"
                            />
                        </div>

                        <FormSelect<TPersonInvolved>
                            fieldName={'condition'}
                            description={'Condición:'}
                            options={EnumToStringArray(Condition)}
                        />

                        <div className="h-4"></div>

                        <div className="md:flex md:md:items-start md:space-x-2">
                            <FormInput<TPersonInvolved>
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

                        <FormInput<TPersonInvolved>
                            fieldName={'address'}
                            description="Dirección:"
                        />
                    </div>

                    <div className="h-8"></div>

                    <div className="flex flex-col space-y-4">
                        <div className="flex justify-end space-x-8">
                            <Button
                                colorType="bg-[#3C50E0]"
                                onClick={() => { }}
                                children={buttonText}
                            ></Button>
                        </div>
                    </div>
                </CustomForm>
            </ModalLayout>

            <LoadingModal initOpen={loading} children={null} />
        </>
    )
}

export default PersonForm
