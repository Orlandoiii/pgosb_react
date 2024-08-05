import React, { useState } from 'react'

import TableDataGrid from '../../core/datagrid/TableDataGrid'
import testJson from '../../../mocks/operations.json'

import {
    MissionSchema,
    missionService,
    TMission,
} from '../../../domain/models/mission/mission'

import { getDefaults } from '../../core/context/CustomFormContext'
import { modalService } from '../../core/overlay/overlay_service'
import MissionForm from './Forms/MissionForm'
import LoadingModal from '../../core/modal/LoadingModal'

const MissionPage = () => {
    const [loading, setLoading] = useState(false)

    async function addNewMission() {
        var errorMessage: string = ''
        try {
            setLoading(true)

            const missionResult = await missionService.insert(
                getDefaults<TMission>(MissionSchema)
            )

            if (missionResult.success && missionResult.data?.id) {
                modalService.pushModal(MissionForm, {
                    missionId: missionResult.data?.id,
                    closeOverlay: undefined,
                })
            } else if (!missionResult.success)
                errorMessage =
                    'Lo sentimos tenemos problemas para agregar la misión'
            else if (!missionResult.data?.id) {
                errorMessage = 'El Id no fue retornado en el agregar la misión'
            }
        } catch (error) {
            errorMessage =
                'Lo sentimos ocurrio un error inesperado al agregar la misión'
            console.error(error)
        } finally {
            setLoading(false)
        }
        if (errorMessage != '') modalService.pushAlert('Error', errorMessage)
    }

    function onUpdate() {}

    return (
        <>
            <TableDataGrid
                rawData={testJson}
                onAdd={addNewMission}
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

            <LoadingModal initOpen={loading} children={null} />
        </>
    )
}

export default MissionPage
