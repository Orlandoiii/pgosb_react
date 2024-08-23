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
import {
    missionCrud,
    MissionSchema,
    TMission,
} from '../../../../domain/models/mission/mission'
import TextInput from '../../../alter/components/inputs/text_input'
import { getDefaults } from '../../../core/context/CustomFormContext'
import { modalService } from '../../../core/overlay/overlay_service'

interface MissionFormProps {
    missionId: string
    missionCode: string
    initValue?: TMission
    onClose?: () => void
    closeOverlay?: () => void
}

const MissionForm = ({
    missionId,
    missionCode,
    onClose,
    initValue,
    closeOverlay,
}: MissionFormProps) => {
    const [loading, setLoading] = useState(false)
    const [alias, setAlias] = useState(initValue ? initValue.alias : '')

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

    async function updateService() {
        const missionResult = await missionCrud.getById(missionId)

        if (
            missionResult.success &&
            missionResult.result &&
            missionResult.result?.alias != alias
        ) {
            missionResult.result.alias = alias
            const updateResult = await missionCrud.update(missionResult.result)

            if (updateResult.success)
                modalService.toastSuccess('Misión actualizada!')
            else modalService.toastError('No se pudo actualizar la misión!')
        }
    }

    return (
        <>
            <ModalLayout
                className="max-h-[90vh] min-w-[70vw] max-w-[85vw]"
                title={'Registro de la Misión'}
                onClose={closeOverlay}
            >
                <div className="flex w-full justify-between">
                    <div className="flex space-x-4 items-center">
                        <div className="text-xl text-slate-700 font-semibold">
                            Alias:
                        </div>
                        <TextInput
                            value={alias}
                            onChange={(e) => setAlias(e.currentTarget.value)}
                            onBlur={updateService}
                        ></TextInput>
                    </div>

                    <div className="flex space-x-4 items-center">
                        <div className="text-xl text-slate-700 font-semibold">
                            Código:
                        </div>
                        <div className="h-10 py-2 px-4 bg-white rounded-md">
                            {missionCode}
                        </div>
                    </div>
                </div>

                <div className="h-8"></div>

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
