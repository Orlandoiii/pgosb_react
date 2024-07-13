import { FieldValues, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'

import {
    Authority,
    AuthorityValidator,
} from '../../../../domain/models/authority/authority'
import FormTitle from '../../../core/titles/FormTitle'
import ModalContainer from '../../../core/modal/ModalContainer'
import { Genders } from '../../../../domain/abstractions/enums/genders'
import Button from '../../../core/buttons/Button'

import Input2 from '../../../../ui/components/Temp/Input2'
import Select2 from '../../../../ui/components/Temp/Select2'
import { AddableTable } from '../../Temp/AddableTable '

import PersonForm from '../Forms/PersonForm'
import VehicleForm from '../Forms/VehicleForm'

const requiredRule = {
    required: {
        value: false,
        message: 'El campo es requerido',
    },
}

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

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting, isSubmitted },
        reset,
    } = useForm<Authority>({
        resolver: zodResolver(AuthorityValidator),
    })

    async function handleSubmitInternal(data: FieldValues) {
        await new Promise((resolve) => setTimeout(() => {}, 1000))
        if (true) {
            reset()
        }
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
                        onAddButtonClick={() => {}}
                    ></AddableTable>

                    <AddableTable
                        title="Bomberos"
                        addButtonText="Agregar un bombero"
                        onAddButtonClick={() => {}}
                    ></AddableTable>

                    <AddableTable
                        title="Infraestructuras"
                        addButtonText="Agregar una infraestructura"
                        onAddButtonClick={() => {}}
                    ></AddableTable>

                    <AddableTable
                        title="Vehiculos"
                        addButtonText="Agregar un vehiculo"
                        onAddButtonClick={() => {}}
                    ></AddableTable>
                </div>
            </ModalContainer>

            {/* {openModal && modalType == ServiceModals.Unit &&
            
        }

{openModal && modalType == ServiceModals.Firefighter &&
            
        }

{openModal && modalType == ServiceModals.Infrastructure &&
            
        } */}

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
