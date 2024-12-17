import { FieldValues } from 'react-hook-form'
import React, { useState } from 'react'

import FormTitle from '../../../core/titles/FormTitle'
import Button from '../../../core/buttons/Button'

import CustomForm from '../../../core/context/CustomFormContext.tsx'

import LoadingModal from '../../../core/modal/LoadingModal.tsx'
import { modalService } from '../../../core/overlay/overlay_service.tsx'
import { ResultErr } from '../../../../domain/abstractions/types/resulterr.ts'
import { EnumToStringArray } from '../../../../utilities/converters/enum_converter.tsx'
import { InfrastructureType } from '../../../../domain/abstractions/enums/infrastructure_types.ts'
import { Goods } from '../../../../domain/abstractions/enums/goods.ts'
import { FloorTypes } from '../../../../domain/abstractions/enums/floor_types.ts'
import { WallTypes } from '../../../../domain/abstractions/enums/wall_types.ts'
import { CeilingTypes } from '../../../../domain/abstractions/enums/ceiling_types.ts'
import { numberMask } from '../../../core/inputs/Common/Mask.ts'
import ModalLayout from '../../../optimized/components/layouts/modal_layout.tsx'
import { useMissionInfrastructureActions } from '../../../../domain/models/mission/infraestructure/use_collection.ts'
import { MissionInfraestructureFront, MissionInfraestructureFrontSchema } from '../../../../domain/models/mission/infraestructure/mission_infraestructure.ts'
import Form from '../../../optimized/components/form/form.tsx'
import FormSelect from '../../../optimized/components/form_inputs/form_select.tsx'
import FormInput from '../../../optimized/components/form_inputs/form_input.tsx'
import FormSubmit from '../../../optimized/components/form_inputs/form_submit.tsx'

interface InfrastructureFormProps {
    initValue?: MissionInfraestructureFront | null
    closeOverlay?: () => void
    add?: boolean
}

const areaCodes = ['N/A', 'SIN PAVIMENTO', 'INESTABLE']

export default function InfrastructureForm({
    initValue,
    closeOverlay,
    add = true,
}: InfrastructureFormProps) {
    const infrastructureActions = useMissionInfrastructureActions();
    const [isVisible, setIsVisible] = useState(true)
    const [loading, setLoading] = useState(false)

    const buttonText = initValue ? 'Actualizar' : 'Guardar'

    async function handleSubmitInternal(data: FieldValues) {
        console.log('submit')

        setLoading(true)

        try {
            const parsed = MissionInfraestructureFrontSchema.parse(data)
            var result: ResultErr<MissionInfraestructureFront>

            if (add) result = await infrastructureActions.insertFront(parsed)
            else result = await infrastructureActions.updateFront(parsed)

            if (result.success) {
                modalService.toastSuccess(
                    `Infraestructura ${buttonText.replace('dar', 'dada')}`
                )
                closeOverlay?.()
            } else
                modalService.toastError(
                    `No se pudo guardar la infraestructura por: ${result.result}`
                )
        } catch (error) {
            modalService.toastError(`Error inesperado por: ${error.message}`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <ModalLayout
                title={'Registro de Infrastructura'}
                isVisible={isVisible}
                onClosed={closeOverlay}
                className="min-w-[70vw]"
                onClose={() => {
                    setIsVisible(false)
                }}
            >
                <Form
                    schema={MissionInfraestructureFrontSchema}
                    initValue={{ ...initValue, missionId: initValue?.missionId }}
                    onSubmit={handleSubmitInternal}
                >
                    <FormTitle title="Datos de la Infraestructura" />

                    <div className="space-y-3 px-2 w-full">
                        <div className="md:flex md:md:items-start md:space-x-2">
                            <FormSelect<MissionInfraestructureFront, any>
                                fieldName={'buildType'}
                                description={'Tipo de infrastructura'}
                                options={EnumToStringArray(InfrastructureType)}
                            />
                            {/* <FormSelect<TInfrastructure>
                                fieldName={'buildOccupation'}
                                description={'Ocupación:'}
                                options={areaCodes}
                            /> */}
                            <FormInput<MissionInfraestructureFront>
                                fieldName={'buildOccupation'}
                                description="Ocupación"
                            />

                            {/* <FormSelect<TInfrastructure>
                                fieldName={'buildArea'}
                                description={'Area de ubicación:'}
                                options={areaCodes}
                            /> */}
                            <FormInput<MissionInfraestructureFront>
                                fieldName={'buildArea'}
                                description="Área de ubicación"
                            />

                            <FormSelect<MissionInfraestructureFront, any>
                                fieldName={'buildAccess'}
                                description={'Acceso'}
                                options={areaCodes}
                            />
                        </div>

                        <div className="md:flex md:md:items-start md:space-x-2">
                            <FormSelect<MissionInfraestructureFront, any>
                                fieldName={'goodsType'}
                                description={'Tipo de bienes'}
                                options={EnumToStringArray(Goods)}
                            />
                            <FormInput<MissionInfraestructureFront>
                                fieldName={'levels'}
                                description="N° Niveles"
                                type={'Number'}
                            />
                            <FormInput<MissionInfraestructureFront>
                                fieldName={'people'}
                                description="N° personas"
                                type={'Number'}
                            />
                        </div>

                        <div className="md:flex md:md:items-start md:space-x-2">
                            {/* <FormSelect<TInfrastructure>
                                fieldName={'buildRoomType'}
                                description={'Tipo de habitación:'}
                                options={areaCodes}
                            /> */}
                            <FormInput<MissionInfraestructureFront>
                                fieldName={'buildRoomType'}
                                description="Tipo de habitación"
                            />

                            <FormSelect<MissionInfraestructureFront, any>
                                fieldName={'buildFloor'}
                                description={'Pisos'}
                                options={EnumToStringArray(FloorTypes)}
                            />
                            <FormSelect<MissionInfraestructureFront, any>
                                fieldName={'buildWall'}
                                description={'Paredes'}
                                options={EnumToStringArray(WallTypes)}
                            />
                            <FormSelect<MissionInfraestructureFront, any>
                                fieldName={'buildRoof'}
                                description={'Techos'}
                                options={EnumToStringArray(CeilingTypes)}
                            />
                        </div>

                        <div className="h-4"></div>

                        <div className="md:flex md:md:items-start md:space-x-2">
                            <FormInput<MissionInfraestructureFront>
                                fieldName={'observations'}
                                description="Dirección"
                            />
                        </div>
                    </div>
                    <div className="h-8"></div>

                    <div className="flex flex-col space-y-4">
                        <div className="flex justify-end space-x-8">
                            <FormSubmit
                                colorType="bg-[#3C50E0]"
                                description={'Aceptar'}
                            />
                        </div>
                    </div>
                </Form>
            </ModalLayout>

            <LoadingModal initOpen={loading} children={null} />
        </>
    )
}
