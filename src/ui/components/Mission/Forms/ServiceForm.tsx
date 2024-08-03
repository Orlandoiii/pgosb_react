import React, { ReactElement, useState } from 'react'

import ModalContainer from '../../../core/modal/ModalContainer'
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
import { CreateCRUD, RequestResult } from '../../../../services/http'

function validateResponse(response: RequestResult<any>, target: string) {
    if (response.success)
        modalService.pushAlert('Complete', `${target} eliminada!`)
    else
        modalService.pushAlert(
            'Error',
            `No se pudo eliminar la ${target.toLowerCase()} por: `
        )
}

interface AuthorityFormProps {
    serviceId: number
    closeOverlay?: () => void
}

const AuthorityForm = ({ serviceId, closeOverlay }: AuthorityFormProps) => {
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

    return (
        <>
            <ModalLayout
                className=" max-h-[80vh] w-[80rem]"
                title={'Registro de Datos del Servicio'}
                onClose={closeOverlay}
            >
                <div className="space-y-10">
                    <AddableTable
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
        </>
    )
}

export default AuthorityForm
