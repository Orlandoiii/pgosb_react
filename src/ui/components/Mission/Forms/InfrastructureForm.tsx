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

interface InfrastructureFormProps {
    initValue?: TInfrastructure | null
    closeOverlay?: () => void
    add?: boolean
}

const areaCodes = ['N/A', 'Sin Pavimento', 'Inestable']

export default function InfrastructureForm({
    initValue,
    closeOverlay,
    add = true,
}: InfrastructureFormProps){
    const infrastructureActions = useMissionInfrastructureActions();
    const [isVisible, setIsVisible] = useState(true)
    const [loading, setLoading] = useState(false)

    const buttonText = initValue ? 'Actualizar' : 'Guardar'

    async function handleSubmitInternal(data: FieldValues) {
        console.log('submit')

        setLoading(true)

        try {
            console.log('data', data)
            const parsed = InfrastructureSchema.parse(data)
            console.log('parsed', parsed)
            var result: ResultErr<TInfrastructure>

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
                className="min-w-[54rem]"
                onClose={() => {
                    setIsVisible(false)
                }}
            >
                <CustomForm
                    schema={InfrastructureSchema}
                    initValue={{ ...initValue, missionId: initValue?.missionId }}
                    onSubmit={handleSubmitInternal}
                >
                    <FormTitle title="Datos de la Infraestructura" />

                    <div className="space-y-3 px-2 w-full max-w-[820px]">
                        <div className="md:flex md:md:items-start md:space-x-2">
                            <FormSelect<TInfrastructure>
                                fieldName={'buildType'}
                                description={'Tipo de infrastructura:'}
                                options={EnumToStringArray(InfrastructureType)}
                            />
                            {/* <FormSelect<TInfrastructure>
                                fieldName={'buildOccupation'}
                                description={'Ocupación:'}
                                options={areaCodes}
                            /> */}
                            <FormInput<TInfrastructure>
                                fieldName={'buildOccupation'}
                                description="Ocupación:"
                            />

                            {/* <FormSelect<TInfrastructure>
                                fieldName={'buildArea'}
                                description={'Area de ubicación:'}
                                options={areaCodes}
                            /> */}
                            <FormInput<TInfrastructure>
                                fieldName={'buildArea'}
                                description="Área de ubicación:"
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
                                options={EnumToStringArray(Goods)}
                            />
                            <FormInput<TInfrastructure>
                                fieldName={'levels'}
                                description="N° Niveles:"
                                mask={numberMask}
                            />
                            <FormInput<TInfrastructure>
                                fieldName={'people'}
                                description="N° personas:"
                                mask={numberMask}
                            />
                        </div>

                        <div className="md:flex md:md:items-start md:space-x-2">
                            {/* <FormSelect<TInfrastructure>
                                fieldName={'buildRoomType'}
                                description={'Tipo de habitación:'}
                                options={areaCodes}
                            /> */}
                            <FormInput<TInfrastructure>
                                fieldName={'buildRoomType'}
                                description="Tipo de habitación:"
                            />

                            <FormSelect<TInfrastructure>
                                fieldName={'buildFloor'}
                                description={'Pisos:'}
                                options={EnumToStringArray(FloorTypes)}
                            />
                            <FormSelect<TInfrastructure>
                                fieldName={'buildWall'}
                                description={'Paredes:'}
                                options={EnumToStringArray(WallTypes)}
                            />
                            <FormSelect<TInfrastructure>
                                fieldName={'buildRoof'}
                                description={'Techos:'}
                                options={EnumToStringArray(CeilingTypes)}
                            />
                        </div>

                        <div className="h-4"></div>

                        <div className="md:flex md:md:items-start md:space-x-2">
                            <FormInput<TInfrastructure>
                                fieldName={'observations'}
                                description="Dirección:"
                            />
                        </div>
                    </div>
                    <div className="h-8"></div>

                    <div className="flex flex-col space-y-4">
                        <div className="flex justify-end space-x-8">
                            <Button
                                colorType="bg-[#3C50E0]"
                                onClick={(e) => { }}
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
