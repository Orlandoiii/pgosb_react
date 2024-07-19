import React, { useState } from 'react'

import ModalContainer from '../../../core/modal/ModalContainer'
import { AddableTable } from '../../Temp/AddableTable '

import PersonForm from '../Forms/PersonForm'
import VehicleForm from '../Forms/VehicleForm'
import InfrastructureForm from './InfrastructureForm'

interface AuthorityFormProps {
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

const AuthorityForm = ({ showModal, onClose }: AuthorityFormProps) => {
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
                title="Registro de Autoridade u Organismo Presente"
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

                    <AddableTable
                        title="Autoridades"
                        addButtonText="Agregar una autoridad"
                        onAddButtonClick={() =>
                            setModal(ServiceModals.Authority)
                        }
                    ></AddableTable>
                </div>
            </ModalContainer>

            {/* {openModal && modalType == ServiceModals.Unit &&
            
        }

{openModal && modalType == ServiceModals.Firefighter &&
            
        } */}

            {openModal && modalType == ServiceModals.Infrastructure && (
                <InfrastructureForm
                    showModal={openModal}
                    onClose={() => setOpenModal(false)}
                ></InfrastructureForm>
            )}

            {openModal && modalType == ServiceModals.Vehicle && (
                <VehicleForm
                    showModal={openModal}
                    onClose={() => setOpenModal(false)}
                ></VehicleForm>
            )}

            {openModal && modalType == ServiceModals.Person && (
                <PersonForm
                    showModal={openModal}
                    onClose={() => setOpenModal(false)}
                ></PersonForm>
            )}

            {openModal && modalType == ServiceModals.Authority && (
                <AuthorityForm
                    showModal={openModal}
                    onClose={() => setOpenModal(false)}
                ></AuthorityForm>
            )}
        </>
    )
}

export default AuthorityForm
