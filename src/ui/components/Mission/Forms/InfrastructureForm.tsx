import { FieldValues } from 'react-hook-form'
import React, { useReducer, useState } from 'react'

import {
    TInfrastructure,
    InfrastructureSchema,
} from '../../../../domain/models/infrastructure/infrastructure'
import FormTitle from '../../../core/titles/FormTitle'
import ModalContainer from '../../../core/modal/ModalContainer'
import Button from '../../../core/buttons/Button'

import CustomForm from '../../../core/context/CustomFormContext.tsx'
import FormInput from '../../../core/inputs/FormInput.tsx'
import FormSelect from '../../../core/inputs/FormSelect.tsx'

import { infrastructureService } from '../../../../domain/models/infrastructure/infrastructure'

import LoadingModal from '../../../core/modal/LoadingModal'
import NotificationModal from '../../../core/alerts/NotificationModal'

import { getDefaults } from '../../../core/context/CustomFormContext'

const notificationInitialState = {
    open: false,
    message: '',
    type: 'info',
    title: '',
}

function notificationReducer(state, action) {
    switch (action.type) {
        case 'notification/open':
            return {
                ...state,
                open: true,
                title: action.payload.title,
                message: action.payload.message,
                type: action.payload.type,
            }
        case 'notification/close':
            return {
                ...state,
                open: false,
            }
    }

    return state
}

interface AuthorityFormProps {
    serviceId: number
    showModal: boolean
    initValue?: TInfrastructure | null
    onClose: () => void
}
const [notificationState, dispatch] = useReducer(
    notificationReducer,
    notificationInitialState
)
const [loading, setLoading] = useState(false)

const areaCodes = ['0212', '0412', '0414', '0424']

const AuthorityForm = ({
    serviceId,
    showModal,
    initValue,
    onClose,
}: AuthorityFormProps) => {
    async function handleSubmitInternal(data: FieldValues) {
        const parsed = InfrastructureSchema.parse(data)
        parsed.serviceId = serviceId

        const result = await infrastructureService.insert(parsed)

        if (result.success) onClose()
        else {
            dispatch({
                type: 'notification/open',
                payload: {
                    type: 'error',
                    title: 'Oohh Error!!!',
                    message:
                        'Lo sentimos tenemos problemas para agregar el vehiculo',
                },
            })
            console.error(result.error)
        }
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
                    schema={InfrastructureSchema}
                    initValue={initValue}
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
                                onClickRaw={() => {}}
                                children={'Aceptar'}
                            ></Button>
                        </div>
                    </div>
                </CustomForm>
            </ModalContainer>

            <LoadingModal initOpen={loading} children={null} />
            <NotificationModal
                show={notificationState.open}
                children={null}
                // initType={notificationState.type as any}
                // title={notificationState.title}
                initMessage={notificationState.message}
            />
        </>
    )
}

export default AuthorityForm
