import React, { useEffect, useState } from 'react'
import { AddableTable } from '../../Temp/AddableTable '

import PersonForm from '../Forms/PersonForm'
import VehicleForm from '../Forms/VehicleForm'
import InfrastructureForm from './InfrastructureForm'

import { infrastructureService } from '../../../../domain/models/infrastructure/infrastructure'
import { personService } from '../../../../domain/models/person/person_involved'
import { vehicleService } from '../../../../domain/models/vehicle/vehicle_involved'
import { modalService } from '../../../core/overlay/overlay_service'
import { CreateElementFunction } from '../../../core/overlay/models/overlay_item'
import ModalLayout from '../../../core/layouts/modal_layout'
import { CreateCRUD, getAll, RequestResult } from '../../../../services/http'
import SelectSearch from '../../../core/inputs/SelectSearch'
import {
    AntaresFromApi,
    TAntares,
} from '../../../../domain/models/antares/antares'
import {
    ServiceSchema,
    serviceService,
    TService,
} from '../../../../domain/models/service/service'
import LoadingModal from '../../../core/modal/LoadingModal'
import { getDefaults } from '../../../core/context/CustomFormContext'
import Button from '../../../core/buttons/Button'

function validateResponse(response: RequestResult<any>, target: string) {
    if (response.success)
        modalService.pushAlert('Complete', `${target} eliminada!`)
    else
        modalService.pushAlert(
            'Error',
            `No se pudo eliminar la ${target.toLowerCase()} por: `
        )
}

interface ServiceFormProps {
    missionId: string
    antaresCollection: TAntares[]
    closeOverlay?: () => void
}

const ServiceForm = ({ missionId, closeOverlay }: ServiceFormProps) => {
    const [loading, setLoading] = useState(false)

    const [antaresCollection, setAntaresCollection] = useState<TAntares[]>([])
    const [antares, setAntares] = useState('')

    const [savedAntares, setSavedAntares] = useState('')
    const [serviceId, setServiceId] = useState('')

    useEffect(() => {
        const getAntares = async () => {
            const response = await getAll<TAntares>(
                'mission/antares',
                AntaresFromApi
            )
            if (response.success && response.data)
                setAntaresCollection(response.data)
        }
        getAntares()
    }, [])

    function openModal<P>(element: CreateElementFunction<P>, props: P) {
        modalService.pushModal(element, { ...props, closeOverlay: undefined })
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

                resultService = await serviceService.insert(defaultValue)
            } else {
                const service = await serviceService.getById(serviceId)

                if (service.success && service.data) {
                    service.data.antaresId = antaresId

                    resultService = await serviceService.update(service.data)
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
    console.log(antares != '' && antares != savedAntares)

    return (
        <>
            <ModalLayout
                className=" max-h-[80vh] w-[80rem]"
                title={'Registro de Datos del Servicio'}
                onClose={closeOverlay}
            >
                <div className="flex space-x-4">
                    <SelectSearch
                        inputName={'model'}
                        label={'Modelo'}
                        options={antaresCollection.map(
                            (item) => item.description
                        )}
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
                <div className="space-y-10">
                    <AddableTable
                        enable={formIsEnable()}
                        title="Unidades"
                        data={[
                            {
                                id: 123,
                                name: 'David',
                                job: 'Desarrollador',
                                edad: 28,
                            },
                        ]}
                        idPropertyName="id"
                        addButtonText="Agregar una unidad"
                        onAddButtonClick={() =>
                            openModal(InfrastructureForm, {
                                serviceId: serviceId,
                            })
                        }
                    ></AddableTable>

                    <AddableTable
                        enable={formIsEnable()}
                        title="Bomberos"
                        data={[]}
                        idPropertyName="id"
                        addButtonText="Agregar un bombero"
                        onAddButtonClick={() =>
                            openModal(InfrastructureForm, {
                                serviceId: serviceId,
                            })
                        }
                    ></AddableTable>

                    <AddableTable
                        enable={formIsEnable()}
                        title="Infraestructuras"
                        data={[]}
                        idPropertyName="id"
                        addButtonText="Agregar una infraestructura"
                        onAddButtonClick={() =>
                            openModal(InfrastructureForm, {
                                serviceId: serviceId,
                            })
                        }
                        onEditButtonClick={(id) => {
                            editHandle(
                                infrastructureService,
                                id,
                                InfrastructureForm
                            )
                        }}
                        onDeleteButtonClick={(id) => {
                            deleteHandle(
                                infrastructureService,
                                id,
                                'Infraestructura'
                            )
                        }}
                    ></AddableTable>

                    <AddableTable
                        enable={formIsEnable()}
                        title="Vehiculos"
                        data={[]}
                        idPropertyName="id"
                        addButtonText="Agregar un vehiculo"
                        onAddButtonClick={() =>
                            openModal(VehicleForm, { serviceId: serviceId })
                        }
                        onEditButtonClick={(id) => {
                            editHandle(vehicleService, id, VehicleForm)
                        }}
                        onDeleteButtonClick={(id) => {
                            deleteHandle(vehicleService, id, 'Vehiculo')
                        }}
                    ></AddableTable>

                    <AddableTable
                        enable={formIsEnable()}
                        title="Personas"
                        data={[]}
                        idPropertyName="id"
                        addButtonText="Agregar una persona"
                        onAddButtonClick={() =>
                            openModal(PersonForm, { serviceId: serviceId })
                        }
                        onEditButtonClick={(id) => {
                            editHandle(personService, id, PersonForm)
                        }}
                        onDeleteButtonClick={(id) => {
                            deleteHandle(personService, id, 'Persona')
                        }}
                    ></AddableTable>
                </div>
            </ModalLayout>

            <LoadingModal initOpen={loading} children={null} />
        </>
    )
}

export default ServiceForm
