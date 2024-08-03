import { FieldValues } from 'react-hook-form'
import React, { useState } from 'react'

import {
    TInfrastructure,
    InfrastructureSchema,
} from '../../../../domain/models/infrastructure/infrastructure'
import FormTitle from '../../../core/titles/FormTitle'
import Button from '../../../core/buttons/Button'

import CustomForm from '../../../core/context/CustomFormContext.tsx'
import FormInput from '../../../core/inputs/FormInput.tsx'
import FormSelect from '../../../core/inputs/FormSelect.tsx'

import { infrastructureService } from '../../../../domain/models/infrastructure/infrastructure'
import ModalLayout from '../../../core/layouts/modal_layout.tsx'
import LoadingModal from '../../../core/modal/LoadingModal.tsx'
import { modalService } from '../../../core/overlay/overlay_service.tsx'

interface InfrastructureFormProps {
    serviceId: number
    initValue?: TInfrastructure | null
    onClose?: (success: boolean) => void
    closeOverlay?: () => void
}

const areaCodes = ['0212', '0412', '0414', '0424']

const InfrastructureForm = ({
    serviceId,
    initValue,
    onClose,
    closeOverlay,
}: InfrastructureFormProps) => {
    const [loading, setLoading] = useState(false)
    const buttonText = initValue ? 'Actualizar' : 'Guardar'

    async function handleSubmitInternal(data: FieldValues) {
        setLoading(true)

        try {
            const parsed = InfrastructureSchema.parse(data)
            const result = await infrastructureService.insert(parsed)

            if (result.success) {
                modalService.pushAlert(
                    'Complete',
                    `Infraestructura ${buttonText.replace('ar', 'ada')}`
                )
                if (onClose) onClose(true)
            } else {
                modalService.pushAlert(
                    'Error',
                    `No se pudo guardar la infrastructura por: ${result.data}`
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
            <ModalLayout
                title={'Registro de Infrastructura'}
                onClose={handleClose}
            >
                <CustomForm
                    schema={InfrastructureSchema}
                    initValue={{ ...initValue, serviceId }}
                    onSubmit={handleSubmitInternal}
                >
                    <FormTitle title="Datos del Vehiculo" />

                    <div className="w-full space-y-3 px-2 max-w-[820px]">
                        <div className="md:flex md:md:items-start md:space-x-2">
                            <FormSelect<TInfrastructure>
                                fieldName={'buildType'}
                                description={'Tipo de infrastructura:'}
                                options={areaCodes}
                            />
                            <FormSelect<TInfrastructure>
                                fieldName={'buildOccupation'}
                                description={'Ocupación:'}
                                options={areaCodes}
                            />
                            <FormSelect<TInfrastructure>
                                fieldName={'buildArea'}
                                description={'Area de ubicación:'}
                                options={areaCodes}
                            />
                            <FormSelect<TInfrastructure>
                                fieldName={'buildAccess'}
                                description={'Acceso:'}
                                options={areaCodes}
                            />
                        </div>

                        <div className="md:flex md:md:items-start md:space-x-2">
                            <FormSelect<TInfrastructure>
                                fieldName={'goodsType'}
                                description={'Tipo de bienes:'}
                                options={areaCodes}
                            />
                            <FormInput<TInfrastructure>
                                fieldName={'levels'}
                                description="N° Niveles:"
                            />
                            <FormInput<TInfrastructure>
                                fieldName={'people'}
                                description="N° personas:"
                            />
                        </div>

                        <div className="md:flex md:md:items-start md:space-x-2">
                            <FormSelect<TInfrastructure>
                                fieldName={'buildRoomType'}
                                description={'Tipo de habitación:'}
                                options={areaCodes}
                            />
                            <FormSelect<TInfrastructure>
                                fieldName={'buildFloor'}
                                description={'Pisos:'}
                                options={areaCodes}
                            />
                            <FormSelect<TInfrastructure>
                                fieldName={'buildWall'}
                                description={'Paredes:'}
                                options={areaCodes}
                            />
                            <FormSelect<TInfrastructure>
                                fieldName={'buildRoof'}
                                description={'Techos:'}
                                options={areaCodes}
                            />
                        </div>

                        <div className="h-8"></div>

                        <FormTitle title="Dirección de Domicilio" />

                        <div className="md:flex md:md:items-start md:space-x-2">
                            <FormInput<TInfrastructure>
                                fieldName={'observations'}
                                description="Observaciones:"
                            />
                        </div>
                    </div>
                    <div className="h-8"></div>

                    <div className="flex flex-col space-y-4">
                        <div className="flex justify-end space-x-8">
                            <Button
                                colorType="bg-[#3C50E0]"
                                onClick={() => {}}
                                children={'Aceptar'}
                            ></Button>
                        </div>
                    </div>
                </CustomForm>
            </ModalLayout>

            <LoadingModal initOpen={loading} children={null} />
        </>
    )
}

export default InfrastructureForm
