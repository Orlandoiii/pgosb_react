import { FieldValues } from 'react-hook-form'
import React, { useState } from 'react'

import FormTitle from '../../../core/titles/FormTitle'
import Button from '../../../core/buttons/Button'

import {
    TVehicleInvolved,
    VehicleInvolvedSchema,
} from '../../../../domain/models/vehicle/vehicle_involved'
import { EnumToStringArray } from '../../../../utilities/converters/enum_converter'
import { AreaCodes } from '../../../../domain/abstractions/enums/area_codes.ts'

import CustomForm from '../../../core/context/CustomFormContext.tsx'
import FormInput from '../../../core/inputs/FormInput.tsx'
import FormSelect from '../../../core/inputs/FormSelect.tsx'

import { vehicleCrud } from '../../../../domain/models/vehicle/vehicle_involved'

import LoadingModal from '../../../core/modal/LoadingModal'
import ModalLayout from '../../../core/layouts/modal_layout.tsx'
import { modalService } from '../../../core/overlay/overlay_service.tsx'
import { ResultErr } from '../../../../domain/abstractions/types/resulterr.ts'

interface VehicleFormProps {
    serviceId: string
    initValue?: TVehicleInvolved | null
    onClose?: (success: boolean) => void
    closeOverlay?: () => void
    add?: boolean
}

const VehicleForm = ({
    serviceId,
    initValue,
    onClose,
    closeOverlay,
    add = true,
}: VehicleFormProps) => {
    const [loading, setLoading] = useState(false)
    const areaCodes = EnumToStringArray(AreaCodes)
    const buttonText = initValue ? 'Actualizar' : 'Guardar'

    async function handleSubmitInternal(data: FieldValues) {
        setLoading(true)

        try {
            const parsed = VehicleInvolvedSchema.parse(data)

            var result: ResultErr<TVehicleInvolved>

            if (add) result = await vehicleCrud.insert(parsed)
            else result = await vehicleCrud.update(parsed)

            if (result.success) {
                modalService.pushAlert(
                    'Complete',
                    `Vehiculo ${buttonText.replace('dar', 'dado')}`,
                    undefined,
                    handleClose
                )
                if (onClose) onClose(true)
            } else {
                modalService.pushAlert(
                    'Error',
                    `No se pudo guardar el vehiculo por: ${result.result}`
                )
            }
        } catch (error) {
            modalService.pushAlert(
                'Error',
                `Error inesperado por: ${error.message}`
            )
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
            <ModalLayout title={'Registro de Vehiculo'} onClose={handleClose}>
                <CustomForm
                    schema={VehicleInvolvedSchema}
                    initValue={{ ...initValue, serviceId: serviceId }}
                    onSubmit={handleSubmitInternal}
                >
                    <FormTitle title="Datos del Vehiculo" />

                    <div className="w-full space-y-3 px-2 max-w-[820px]">
                        <div className="md:flex md:md:items-start md:space-x-2">
                            <FormInput<TVehicleInvolved>
                                fieldName={'licensePlate'}
                                description="Placa"
                            />

                            <FormSelect<TVehicleInvolved>
                                fieldName={'brand'}
                                description={'Label:'}
                                options={areaCodes}
                            />

                            <FormSelect<TVehicleInvolved>
                                fieldName={'model'}
                                description={'Modelo:'}
                                options={areaCodes}
                            />
                        </div>

                        <div className="md:flex md:md:items-start md:space-x-2">
                            <FormInput<TVehicleInvolved>
                                fieldName={'motorSerial'}
                                description="Serial del Motor"
                            />

                            <FormSelect<TVehicleInvolved>
                                fieldName={'type'}
                                description={'Tipo:'}
                                options={areaCodes}
                            />

                            <FormInput<TVehicleInvolved>
                                fieldName={'year'}
                                description="Año"
                            />

                            <FormInput<TVehicleInvolved>
                                fieldName={'color'}
                                description="Color"
                            />
                        </div>
                        <div className="h-4"></div>
                        <div className="md:flex md:md:items-start md:space-x-2">
                            <FormInput<TVehicleInvolved>
                                fieldName={'condition'}
                                description="Condición"
                            />
                        </div>
                    </div>
                    <div className="h-8"></div>

                    <div className="flex flex-col space-y-4">
                        <div className="flex justify-end space-x-8">
                            <Button
                                colorType="bg-[#3C50E0]"
                                onClick={() => {}}
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

export default VehicleForm
