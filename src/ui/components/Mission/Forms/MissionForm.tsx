import React, { useState } from 'react'

import { useActionModalAndCollection } from '../../../core/hooks/useActionModalAndCollection'
import ModalLayout from '../../../core/layouts/modal_layout'
import LoadingModal from '../../../core/modal/LoadingModal'
import { AddableTable } from '../../Temp/AddableTable'

import ServiceForm from './ServiceForm'
import {
    serviceCrud,
    serviceNameConverter,
} from '../../../../domain/models/service/service'
import LocationForm from './LocationForm'
import {
    LocationCrud,
    LocationNameConverter,
} from '../../../../domain/models/location/location'

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

    const [serviceActions, services] = useActionModalAndCollection(
        ServiceForm,
        serviceCrud,
        { missionId: missionId },
        missionId
    )

    const [locationActions, locations] = useActionModalAndCollection(
        LocationForm,
        LocationCrud,
        { missionId: missionId },
        missionId
    )

    return (
        <>
            <ModalLayout
                className="max-h-[90vh] min-w-[70vw] max-w-[85vw]"
                title={'Registro de la Misión'}
                onClose={closeOverlay}
            >
                <AddableTable
                    title="Ubicaciones"
                    data={locations}
                    defaultSort={'state'}
                    idPropertyName="id"
                    addButtonText="Agregar una ubicación"
                    nameConverter={LocationNameConverter}
                    onAddButtonClick={locationActions.add}
                    onEditButtonClick={locationActions.edit}
                    onDeleteButtonClick={locationActions.delete}
                ></AddableTable>

                <div className="h-8"></div>

                <AddableTable
                    title="Servicios"
                    data={services}
                    defaultSort={'id'}
                    idPropertyName="id"
                    addButtonText="Agregar un servicio"
                    nameConverter={serviceNameConverter}
                    onAddButtonClick={serviceActions.add}
                    onEditButtonClick={serviceActions.edit}
                    onDeleteButtonClick={serviceActions.delete}
                ></AddableTable>
            </ModalLayout>
            <LoadingModal initOpen={loading} children={null} />
        </>
    )
}

export default MissionForm
