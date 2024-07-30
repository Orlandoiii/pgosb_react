import React, { useReducer, useState } from 'react'

import TableDataGrid from '../../core/datagrid/TableDataGrid'
import testJson from '../../../mocks/operations.json'

import {
    MissionSchema,
    missionService,
    TMission,
} from '../../../domain/models/mission/mission'
import MissionForm from './Forms/MissionForm'

import { getDefaults } from '../../core/context/CustomFormContext'
import LoadingModal from '../../core/modal/LoadingModal'
import NotificationModal from '../../core/alerts/NotificationModal'
import LayoutContexProvider from '../../core/context/LayoutContext'
import ServiceForm from './Forms/ServiceForm'
import {
    ServiceSchema,
    serviceService,
    TService,
} from '../../../domain/models/service/service'

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

const MissionPage = () => {
    const [notificationState, dispatch] = useReducer(
        notificationReducer,
        notificationInitialState
    )
    const [loading, setLoading] = useState(false)

    const [openAddForm, setOpenAddForm] = useState(false)
    const [missionId, setMissionId] = useState(0)
    const [serviceId, setServiceId] = useState(0)

    async function addNewMission() {
        setLoading(true)
        try {
            console.log(
                `AQUI ${JSON.stringify(getDefaults<TMission>(MissionSchema as any) as TMission)}`
            )
            const result = await missionService.insert(
                getDefaults<TMission>(MissionSchema as any) as TMission
            )

            //remover this!!!!!
            setOpenAddForm(true)
            
            if (result.success) {
                if (result.data?.id) {
                    setMissionId(result.data.id)
                    setOpenAddForm(true)

                    const defaultValue = getDefaults<TService>(
                        ServiceSchema as any
                    ) as TService
                    defaultValue.missionId = result.data.id

                    const resultService =
                        await serviceService.insert(defaultValue)
                    if (resultService.success) {
                        if (result.data?.id) {
                            setServiceId(result.data?.id)
                            setOpenAddForm(true)
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
                    console.error(
                        'El Id no fue retornado en el insert de la mision'
                    )
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
            console.log(`Catch de error`)
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    function onUpdate() {}
    return (
        <>
            {/* <LayoutContexProvider layoutName={"mission_layout"}> */}
            <TableDataGrid
                rawData={testJson}
                onAdd={() => {
                    addNewMission()
                }}
                onDoubleClickRow={() => {}}
                permissions={{
                    add: true,
                    delete: true,
                    export: true,
                    print: true,
                    update: true,
                }}
                onDelete={() => {}}
                onUpdate={onUpdate}
            />
            {/* </LayoutContexProvider> */}

            <button onClick={addNewMission}>Agregar</button>

            {openAddForm && (
                <ServiceForm
                    serviceId={serviceId}
                    showModal={openAddForm}
                    onClose={() => setOpenAddForm(false)}
                ></ServiceForm>
            )}

            {/* <LoadingModal initOpen={loading} children={null} /> */}
            {/* <NotificationModal
                show={notificationState.open}
                children={null}
                // initType={notificationState.type as any}
                // title={notificationState.title}
                initMessage={notificationState.message}
            /> */}
        </>
    )
}

export default MissionPage
