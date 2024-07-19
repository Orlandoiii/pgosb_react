import { FieldValues } from 'react-hook-form'
import React from 'react'

import FormTitle from '../../../core/titles/FormTitle'
import ModalContainer from '../../../core/modal/ModalContainer'
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

interface AuthorityFormProps {
    showModal: boolean
    initValue?: TVehicleInvolved | null
    onClose: () => void
}

const AuthorityForm = ({
    showModal,
    initValue,
    onClose,
}: AuthorityFormProps) => {
    const areaCodes = EnumToStringArray(AreaCodes)

    async function handleSubmitInternal(data: FieldValues) {
        await new Promise((resolve) => setTimeout(() => {}, 1000))
    }

    return (
        <>
            <ModalContainer
                showX={false}
                downStikyChildren={''}
                show={showModal}
                onClose={() => onClose()}
                title="Registro de Autoridade u Organismo Presente"
            >
                <CustomForm
                    schema={VehicleInvolvedSchema}
                    initValue={initValue}
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
                                onClickRaw={() => {}}
                                children={'Aceptar'}
                            ></Button>
                        </div>
                    </div>
                </CustomForm>
            </ModalContainer>
        </>
    )
}

export default AuthorityForm
