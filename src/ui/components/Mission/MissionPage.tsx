import React, { useReducer, useState } from 'react'

import TableDataGrid from '../../core/datagrid/TableDataGrid'
import testJson from '../../../mocks/operations.json'

import {
    MissionSchema,
    missionService,
    TMission,
} from '../../../domain/models/mission/mission'

import { getDefaults } from '../../core/context/CustomFormContext'
import ServiceForm from './Forms/ServiceForm'
import {
    ServiceSchema,
    serviceService,
    TService,
} from '../../../domain/models/service/service'
import { CreateElementFunction } from '../../core/overlay/models/overlay_item'
import { modalService } from '../../core/overlay/overlay_service'

const MissionPage = () => {
    const [loading, setLoading] = useState(false)

    const [missionId, setMissionId] = useState(0)
    const [serviceId, setServiceId] = useState(0)

    async function addNewMission() {
        var errorMessage: string = ''
        try {
            setLoading(true)

            const missionResult = await missionService.insert(
                getDefaults<TMission>(MissionSchema)
            )

            if (missionResult.success && missionResult.data?.id) {
                const defaultValue = getDefaults<TService>(ServiceSchema)
                defaultValue.missionId = missionResult.data.id

                const resultService = await serviceService.insert(defaultValue)
                if (resultService.success && resultService.data?.id) {
                    setMissionId(missionResult.data.id)
                    setServiceId(missionResult.data?.id)

                    openServiceModal(ServiceForm, { serviceId: serviceId })
                    return
                } else if (!resultService.success)
                    errorMessage =
                        'Lo sentimos tenemos problemas para agregar el servicio'
                else if (!resultService.data?.id)
                    errorMessage =
                        'El Id no fue retornado en el agregar el servicio'
            } else if (!missionResult.success)
                errorMessage =
                    'Lo sentimos tenemos problemas para agregar la misión'
            else if (!missionResult.data?.id)
                errorMessage = 'El Id no fue retornado en el agregar la misión'
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

    function openServiceModal<P>(element: CreateElementFunction<P>, props: P) {
        modalService.pushModal(element, { ...props, closeOverlay: undefined })
    }

    return (
        <>
            <TableDataGrid
                rawData={testJson}
                onAdd={() => openServiceModal(ServiceForm, { serviceId: 122 })}
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
            <button onClick={addNewMission}>Agregar</button>
        </>
    )
}

export default MissionPage
