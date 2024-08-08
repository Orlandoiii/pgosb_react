import React, { useState } from 'react'

import { modalService } from '../../../core/overlay/overlay_service'

import { useActionModalAndCollection } from '../../../core/hooks/useActionModalAndCollection'
import { useCollection } from '../../../core/hooks/useCollection'

import SelectSearch from '../../../core/inputs/SelectSearch'
import ModalLayout from '../../../core/layouts/modal_layout'
import LoadingModal from '../../../core/modal/LoadingModal'
import { AddableTable } from '../../Temp/AddableTable '
import Button from '../../../core/buttons/Button'
import {
    serviceCrud,
    ServiceSchema,
    TService,
} from '../../../../domain/models/service/service'
import { getDefaults } from '../../../core/context/CustomFormContext'
import { FromApi } from '../../../../domain/models/antares/antares'

import InfrastructureForm from './InfrastructureForm'
import { infrastructureCrud, infrastructureNameConverter } from '../../../../domain/models/infrastructure/infrastructure'

import VehicleForm from './VehicleForm'
import { vehicleCrud, vehicleNameConverter } from '../../../../domain/models/vehicle/vehicle_involved'

import PersonForm from './PersonForm'
import { personCrud, personNameConverter } from '../../../../domain/models/person/person_involved'

interface ServiceFormProps {
    missionId: string
    closeOverlay?: () => void
}

const ServiceForm = ({ missionId, closeOverlay }: ServiceFormProps) => {
    const antaresCollection = useCollection('mission/antares', FromApi)
    const [serviceId, setServiceId] = useState('')

    const [infrastructureActions, infrastructures] =
        useActionModalAndCollection(
            InfrastructureForm,
            infrastructureCrud,
            { serviceId: serviceId },
            serviceId
        )
    const [vehicleActions, vehicles] = useActionModalAndCollection(
        VehicleForm,
        vehicleCrud,
        { serviceId: serviceId },
        serviceId
    )
    const [personActions, people] = useActionModalAndCollection(
        PersonForm,
        personCrud,
        { serviceId: serviceId },
        serviceId
    )

    const [loading, setLoading] = useState(false)
    const [antares, setAntares] = useState('')
    const [savedAntares, setSavedAntares] = useState('')

    function AntaresBlurHandler() {
        const selectedAntares = antaresCollection.filter(
            (item) => item.description === antares
        )[0]

        if (selectedAntares) {
            if (savedAntares != '') return
            safeOrUpdateService(selectedAntares.id)
        } else setAntares('')
    }

    function antaresButtonClicked() {
        const selectedAntares = antaresCollection.filter(
            (item) => item.description === antares
        )[0]
        safeOrUpdateService(selectedAntares.id)
    }

    async function safeOrUpdateService(antaresId: string) {
        if (antares === '') return
        const add = serviceId === ''

        var errorMessage: string = ''
        try {
            setLoading(true)
            var resultService
            if (add) {
                const defaultValue = getDefaults<TService>(ServiceSchema)
                defaultValue.missionId = missionId
                defaultValue.antaresId = antaresId

                resultService = await serviceCrud.insert(defaultValue)
            } else {
                const service = await serviceCrud.getById(serviceId)

                if (service.success && service.result) {
                    service.result.antaresId = antaresId

                    resultService = await serviceCrud.update(service.result)
                }
            }
            if (resultService.success) {
                setServiceId(resultService.data?.id)
                setSavedAntares(antares)
                return
            } else if (!resultService.success)
                errorMessage = `Lo sentimos tenemos problemas para ${add ? 'agregar' : 'guardar'} el servicio`
            else if (add && !resultService.data?.id)
                errorMessage =
                    'El Id no fue retornado en el agregar el servicio'
        } catch (error) {
            errorMessage = `Lo sentimos ocurrio un error inesperado al ${add ? 'agregar' : 'guardar'} la misión`
            console.error(error)
        } finally {
            setLoading(false)
        }
        if (errorMessage != '') modalService.pushAlert('Error', errorMessage)
    }

    function formIsEnable(): boolean {
        return savedAntares != '' && antares === savedAntares
    }

    const antaresNames = antaresCollection.map((item) => item.description)
    console.log('antaresNames', antaresNames)

    return (
        <>
            <ModalLayout
                className=" max-h-[80vh] min-w-[60vw] max-w-[90vw]"
                title={'Registro de Datos del Servicio'}
                onClose={closeOverlay}
            >
                <div className="flex space-x-4">
                    <SelectSearch
                        inputName={'model'}
                        label={'Modelo'}
                        options={antaresNames}
                        searhValue={antares}
                        setSearhValue={setAntares}
                        onBlur={AntaresBlurHandler}
                        openUp={false}
                    />

                    <div className="mt-8 h-11">
                        <Button
                            enable={antares != '' && antares != savedAntares}
                            colorType="bg-[#3C50E0]"
                            onClick={antaresButtonClicked}
                            children={'Guardar'}
                        ></Button>
                    </div>
                </div>
                <div className="space-y-10 w-full">
                    <AddableTable
                        enable={formIsEnable()}
                        title="Unidades"
                        data={[]}
                        idPropertyName="id"
                        addButtonText="Agregar una unidad"
                        onAddButtonClick={infrastructureActions.add}
                    ></AddableTable>

                    <AddableTable
                        enable={formIsEnable()}
                        title="Bomberos"
                        data={[]}
                        defaultSort={''}
                        idPropertyName="id"
                        addButtonText="Agregar un bombero"
                        onAddButtonClick={infrastructureActions.add}
                    ></AddableTable>

                    <AddableTable
                        enable={formIsEnable()}
                        title="Infraestructuras"
                        data={infrastructures}
                        idPropertyName="id"
                        addButtonText="Agregar una infraestructura"
                        nameConverter={infrastructureNameConverter}
                        onAddButtonClick={infrastructureActions.add}
                        onEditButtonClick={infrastructureActions.edit}
                        onDeleteButtonClick={infrastructureActions.delete}
                    ></AddableTable>

                    <AddableTable
                        enable={formIsEnable()}
                        title="Vehiculos"
                        data={vehicles}
                        idPropertyName="id"
                        addButtonText="Agregar un vehiculo"
                        nameConverter={vehicleNameConverter}
                        onAddButtonClick={vehicleActions.add}
                        onEditButtonClick={vehicleActions.edit}
                        onDeleteButtonClick={vehicleActions.delete}
                    ></AddableTable>

                    <AddableTable
                        enable={formIsEnable()}
                        title="Personas"
                        data={people}
                        idPropertyName="id"
                        addButtonText="Agregar una persona"
                        nameConverter={personNameConverter}
                        onAddButtonClick={personActions.add}
                        onEditButtonClick={personActions.edit}
                        onDeleteButtonClick={personActions.delete}
                    ></AddableTable>
                </div>
            </ModalLayout>

            <LoadingModal initOpen={loading} children={null} />
        </>
    )
}
export default ServiceForm
