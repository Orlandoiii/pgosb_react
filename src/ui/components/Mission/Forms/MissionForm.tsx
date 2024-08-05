import React, { useState } from 'react'

import { AddableTable } from '../../Temp/AddableTable '

import { serviceService } from '../../../../domain/models/service/service'
import ServiceForm from './ServiceForm'

import { modalService } from '../../../core/overlay/overlay_service'
import ModalLayout from '../../../core/layouts/modal_layout'
import { CreateCRUD, getAll, RequestResult } from '../../../../services/http'
import LoadingModal from '../../../core/modal/LoadingModal'

function validateResponse(response: RequestResult<any>, target: string) {
    if (response.success)
        modalService.pushAlert('Complete', `${target} eliminada!`)
    else
        modalService.pushAlert(
            'Error',
            `No se pudo eliminar la ${target.toLowerCase()} por: `
        )
}

interface MissionFormProps {
    missionId: string
    onClose?: () => void
    closeOverlay?: () => void
}

const MissionForm = ({
    missionId,
    onClose,
    closeOverlay,
}: MissionFormProps) => {
    const [loading, setLoading] = useState(false)

    async function addNewService() {
        modalService.pushModal(ServiceForm, {
            missionId: missionId,
            antaresCollection: [],
            closeOverlay: undefined,
        })
    }

    async function deleteHandle(
        service: CreateCRUD<any>,
        id: string,
        target: string
    ) {
        validateResponse(await service.remove(id), target)
    }

    async function editHandle(
        service: CreateCRUD<any>,
        id: string,
        openMoal: (any) => void
    ) {
        const result = await service.getById(id)
        if (result.success) {
        } else
            modalService.pushAlert('Error', `No se pudo encontrar el registro`)
    }

    return (
        <>
            <ModalLayout
                className=" max-h-[80vh] w-[80vw]"
                title={'Registro de la Misión'}
                onClose={closeOverlay}
            >
                <AddableTable
                    title="Servicios"
                    data={[]}
                    idPropertyName="id"
                    addButtonText="Agregar un servicio"
                    onAddButtonClick={addNewService}
                    onEditButtonClick={(id) => {
                        editHandle(serviceService, id, ServiceForm)
                    }}
                    onDeleteButtonClick={(id) => {
                        deleteHandle(serviceService, id, 'Infraestructura')
                    }}
                ></AddableTable>
            </ModalLayout>
            <LoadingModal initOpen={loading} children={null} />
        </>
    )
}

export default MissionForm
