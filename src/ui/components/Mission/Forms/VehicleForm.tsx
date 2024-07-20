import { FieldValues } from 'react-hook-form'
import React, { useReducer, useState } from 'react'

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

import { vehicleService } from '../../../../domain/models/vehicle/vehicle_involved'

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
    initValue?: TVehicleInvolved | null
    onClose: () => void
}

const AuthorityForm = ({
    serviceId,
    showModal,
    initValue,
    onClose,
}: AuthorityFormProps) => {
    const [notificationState, dispatch] = useReducer(
        notificationReducer,
        notificationInitialState
    )
    const [loading, setLoading] = useState(false)

    const areaCodes = EnumToStringArray(AreaCodes)

    async function handleSubmitInternal(data: FieldValues) {
        const parsed = VehicleInvolvedSchema.parse(data)
        parsed.serviceId = serviceId

        const result = await vehicleService.insert(parsed)

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
