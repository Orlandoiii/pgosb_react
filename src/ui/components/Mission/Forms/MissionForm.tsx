import React, { useReducer, useState } from 'react'

import ModalContainer from '../../../core/modal/ModalContainer'
import { AddableTable } from '../../Temp/AddableTable '

import {
    ServiceSchema,
    serviceService,
    TService,
} from '../../../../domain/models/service/service'
import ServiceForm from './ServiceForm'

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
    missionId: number
    showModal: boolean
    onClose: () => void
}

const AuthorityForm = ({
    missionId,
    showModal,
    onClose,
}: AuthorityFormProps) => {
    const [notificationState, dispatch] = useReducer(
        notificationReducer,
        notificationInitialState
    )
    const [openModal, setOpenModal] = useState(false)
    const [loading, setLoading] = useState(false)
    const [serviceId, setServiceId] = useState(0)

    async function addNewService() {
        setLoading(true)
        try {
            const defaultValue = getDefaults<TService>(
                ServiceSchema as any
            ) as TService
            defaultValue.missionId = missionId

            console.log(`request servicio: ${JSON.stringify(defaultValue)}`)
            const result = await serviceService.insert(defaultValue)

            console.error(`response service: ${result}`)

            if (result.success) {
                if (result.data?.id) {
                    setServiceId(result.data?.id)
                    setOpenModal(true)
                } else {
                    dispatch({
                        type: 'notification/open',
                        payload: {
                            type: 'error',
                            title: 'Oohh Error!!!',
                            message:
                                'El Id no fue retornado en el insert del servicio',
                        },
                    })
                    console.error('')
                }
            } else {
                dispatch({
                    type: 'notification/open',
                    payload: {
                        type: 'error',
                        title: 'Oohh Error!!!',
                        message:
                            'Lo sentimos tenemos problemas para agregar la misión',
                    },
                })
                console.error(result.error)
            }
        } catch (error) {
            dispatch({
                type: 'notification/open',
                payload: {
                    type: 'error',
                    title: 'Oohh Error!!!',
                    message:
                        'Lo sentimos tenemos problemas para agregar la misión',
                },
            })
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <ModalContainer
                showX={true}
                downStikyChildren={''}
                show={showModal}
                onClose={() => onClose()}
                title="Registro de Servicios"
            >
                <div className="space-y-10">
                    <AddableTable
                        title="Unidades"
                        data={[]}
                        idPropertyName="id"
                        addButtonText="Agregar una unidad"
                        onAddButtonClick={() => addNewService()}
                    ></AddableTable>
                </div>
            </ModalContainer>
        </>
    )
}

export default AuthorityForm
