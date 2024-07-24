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

    async function addNewMission() {
        console.log('Iniciando add de mision')
        setLoading(true)
        try {
            const result = await missionService.insert(
                getDefaults<TMission>(MissionSchema as any) as TMission
            )

            if (result.success) {
                if (result.data?.id) {
                    setMissionId(result.data.id)
                    setOpenAddForm(true)
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

    function onUpdate() { }
    return (
        <>
            {/* <LayoutContexProvider layoutName={"mission_layout"}> */}
                <TableDataGrid
                    rawData={testJson}
                    onAdd={() => {
                        addNewMission()
                    }}
                    onDoubleClickRow={() => { }}
                    permissions={''}
                    onDelete={() => { }}
                    onUpdate={onUpdate}
                />
            {/* </LayoutContexProvider> */}


            <button onClick={addNewMission}>Agregar</button>

            {openAddForm && (
                <MissionForm
                    missionId={missionId}
                    showModal={openAddForm}
                    onClose={() => setOpenAddForm(false)}
                ></MissionForm>
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
