import React, { useEffect, useState } from 'react'

import TableDataGrid from '../../core/datagrid/TableDataGrid'

import {
    MissionSchema,
    missionCrud,
    TMission,
} from '../../../domain/models/mission/mission'

import { getDefaults } from '../../core/context/CustomFormContext'
import { modalService } from '../../core/overlay/overlay_service'
import MissionForm from './Forms/MissionForm'
import LoadingModal from '../../core/modal/LoadingModal'
import LayoutContexProvider from '../../core/context/LayoutContext'
import {
    serviceCrud,
    TApiService,
    ServiceToApi,
    TService,
} from '../../../domain/models/service/service'
import { OverlayModalConfig } from '../../core/overlay/models/overlay_item'

const MissionPage = () => {
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState<TApiService[]>([])

    useEffect(() => {
        updateServices()
    }, [])

    async function updateServices() {
        const result = await serviceCrud.getAll()
        if (result.success && result.result) {
            const yeee: TApiService[] = result.result.map(
                (item) => ServiceToApi(item).result!
            )

            setData(yeee)
        }
    }

    async function addNewMission() {
        var errorMessage: string = ''
        try {
            setLoading(true)

            const missionResult = await missionCrud.insert(
                getDefaults<TMission>(MissionSchema)
            )

            if (missionResult.success && missionResult.result?.id) {
                modalService.pushModal(
                    MissionForm,
                    {
                        missionId: missionResult.result?.id,
                        closeOverlay: undefined,
                    },
                    new OverlayModalConfig(),
                    updateServices
                )
            } else if (!missionResult.success)
                errorMessage =
                    'Lo sentimos tenemos problemas para agregar la misión'
            else if (!missionResult.result?.id) {
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
        <LayoutContexProvider layoutName={'service_layout'}>
            <TableDataGrid
                rawData={data}
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
        </LayoutContexProvider>
    )
}

export default MissionPage
