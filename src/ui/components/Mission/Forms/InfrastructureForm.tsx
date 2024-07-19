import { FieldValues } from 'react-hook-form'
import React from 'react'

import {
    TInfrastructure,
    InfrastructureValidator,
} from '../../../../domain/models/infrastructure/infrastructure'
import FormTitle from '../../../core/titles/FormTitle'
import ModalContainer from '../../../core/modal/ModalContainer'
import Button from '../../../core/buttons/Button'

import CustomForm from '../../../core/context/CustomFormContext.tsx'
import FormInput from '../../../core/inputs/FormInput.tsx'
import FormSelect from '../../../core/inputs/FormSelect.tsx'

interface AuthorityFormProps {
    showModal: boolean
    initValue?: TInfrastructure | null
    onClose: () => void
}

const areaCodes = ['0212', '0412', '0414', '0424']

const AuthorityForm = ({
    showModal,
    initValue,
    onClose,
}: AuthorityFormProps) => {
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
                    schema={InfrastructureValidator}
                    initValue={initValue}
                    onSubmit={handleSubmitInternal}
                >
                    <FormTitle title="Datos del Vehiculo" />

                    <div className="w-full space-y-3 px-2 max-w-[820px]">
                        <div className="md:flex md:md:items-start md:space-x-2">
                            <FormSelect<TInfrastructure>
                                fieldName={'build_type'}
                                description={'Tipo de infrastructura:'}
                                options={areaCodes}
                            />
                            <FormSelect<TInfrastructure>
                                fieldName={'build_occupation'}
                                description={'Ocupación:'}
                                options={areaCodes}
                            />
                            <FormSelect<TInfrastructure>
                                fieldName={'build_area'}
                                description={'Area de ubicación:'}
                                options={areaCodes}
                            />
                            <FormSelect<TInfrastructure>
                                fieldName={'build_access'}
                                description={'Acceso:'}
                                options={areaCodes}
                            />
                        </div>

                        <div className="md:flex md:md:items-start md:space-x-2">
                            <FormSelect<TInfrastructure>
                                fieldName={'goods_type'}
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
                                fieldName={'build_room_type'}
                                description={'Tipo de habitación:'}
                                options={areaCodes}
                            />
                            <FormSelect<TInfrastructure>
                                fieldName={'build_floor'}
                                description={'Pisos:'}
                                options={areaCodes}
                            />
                            <FormSelect<TInfrastructure>
                                fieldName={'build_wall'}
                                description={'Paredes:'}
                                options={areaCodes}
                            />
                            <FormSelect<TInfrastructure>
                                fieldName={'build_roof'}
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
