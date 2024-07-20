import React, { useState } from 'react'

import ModalContainer from '../../../core/modal/ModalContainer'
import { AddableTable } from '../../Temp/AddableTable '

import PersonForm from '../Forms/PersonForm'
import VehicleForm from '../Forms/VehicleForm'
import InfrastructureForm from './InfrastructureForm'

import { infrastructureService } from '../../../../domain/models/infrastructure/infrastructure'
import { personService } from '../../../../domain/models/person/person_involved'
import { vehicleService } from '../../../../domain/models/vehicle/vehicle_involved'

interface AuthorityFormProps {
    serviceId: number
    showModal: boolean
    onClose: () => void
}

enum ServiceModals {
    None,
    Unit,
    Firefighter,
    Infrastructure,
    Vehicle,
    Person,
    Authority,
}

const AuthorityForm = ({
    serviceId,
    showModal,
    onClose,
}: AuthorityFormProps) => {
    var [modalType, setModalType] = useState(ServiceModals.None)
    var [openModal, setOpenModal] = useState(false)

    function setModal(type: ServiceModals) {
        setOpenModal(true)
        setModalType(type)
    }

    return (
        <>
            <ModalContainer
                showX={false}
                downStikyChildren={''}
                show={showModal}
                onClose={() => onClose()}
                title="Registro de Datos del Servicio"
            >
                <div className="space-y-10">
                    <AddableTable
                        title="Unidades"
                        addButtonText="Agregar una unidad"
                        onAddButtonClick={() => setModal(ServiceModals.Unit)}
                    ></AddableTable>

                    <AddableTable
                        title="Bomberos"
                        addButtonText="Agregar un bombero"
                        onAddButtonClick={() =>
                            setModal(ServiceModals.Firefighter)
                        }
                    ></AddableTable>

                    <AddableTable
                        title="Infraestructuras"
                        addButtonText="Agregar una infraestructura"
                        onAddButtonClick={() =>
                            setModal(ServiceModals.Infrastructure)
                        }
                    ></AddableTable>

                    <AddableTable
                        title="Vehiculos"
                        addButtonText="Agregar un vehiculo"
                        onAddButtonClick={() => setModal(ServiceModals.Vehicle)}
                    ></AddableTable>

                    {/* <AddableTable
                        title="Autoridades"
                        addButtonText="Agregar una autoridad"
                        onAddButtonClick={() =>
                            setModal(ServiceModals.Authority)
                        }
                    ></AddableTable> */}
                </div>
            </ModalContainer>

            {/* {openModal && modalType == ServiceModals.Unit &&
            
        }

{openModal && modalType == ServiceModals.Firefighter &&
            
        } */}

            {/* {openModal && modalType == ServiceModals.Infrastructure && (
                <InfrastructureForm
                    serviceId={serviceId}
                    showModal={openModal}
                    onClose={() => setOpenModal(false)}
                ></InfrastructureForm>
            )} */}

            {openModal && modalType == ServiceModals.Vehicle && (
                <VehicleForm
                    serviceId={serviceId}
                    showModal={openModal}
                    onClose={() => setOpenModal(false)}
                ></VehicleForm>
            )}

            {openModal && modalType == ServiceModals.Person && (
                <PersonForm
                    serviceId={serviceId}
                    showModal={openModal}
                    onClose={() => setOpenModal(false)}
                ></PersonForm>
            )}

            {/* {openModal && modalType == ServiceModals.Authority && (
                <AuthorityForm
                    showModal={openModal}
                    onClose={() => setOpenModal(false)}
                ></AuthorityForm>
            )} */}
        </>
    )
}

export default AuthorityForm
