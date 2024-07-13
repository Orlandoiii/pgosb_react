import { FieldValues, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'

import {
    Infrastructure,
    InfrastructureValidator,
} from '../../../../domain/models/infrastructure/infrastructure'
import FormTitle from '../../../core/titles/FormTitle'
import ModalContainer from '../../../core/modal/ModalContainer'
import Input from '../../../core/inputs/Input'
import { Genders } from '../../../../domain/abstractions/enums/genders'
import { Select } from '../../../core/inputs/Selects'
import Button from '../../../core/buttons/Button'

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

const genders = [Genders.Male, Genders.Female]
const areaCodes = ['0212', '0412', '0414', '0424']

const AuthorityForm = ({ showModal, onClose }: AuthorityFormProps) => {
    const [areaCode, setAreaCode] = useState(areaCodes[0])
    const [type, setType] = useState(genders[0])

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, isSubmitted },
        reset,
    } = useForm<Infrastructure>({
        resolver: zodResolver(InfrastructureValidator),
    })

    async function handleSubmitInternal(data: FieldValues) {
        await new Promise((resolve) => setTimeout(() => {}, 1000))
        if (true) {
            reset()
            setType(genders[1])
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
                <form
                    className="mx-auto mb-5 w-full max-w-[500px] md:max-w-[100%]"
                    onSubmit={handleSubmit(handleSubmitInternal)}
                    noValidate
                >
                    <FormTitle title="Datos del Vehiculo" />

                    <div className="w-full space-y-3 px-2 max-w-[820px]">
                        <div className="md:flex md:md:items-start md:space-x-2">
                            <Select
                                label={'Tipo de Infrastructura'}
                                useDotLabel={true}
                                options={areaCodes}
                                value={type}
                                onChange={(v) => {
                                    setType(v)
                                }}
                                type={''}
                                onChangeRaw={() => {}}
                                openUp={false}
                            />

                            <Select
                                label={'Ocupación'}
                                useDotLabel={true}
                                options={areaCodes}
                                value={type}
                                onChange={(v) => {
                                    setType(v)
                                }}
                                type={''}
                                onChangeRaw={() => {}}
                                openUp={false}
                            />

                            <Select
                                label={'Ubicación'}
                                useDotLabel={true}
                                options={areaCodes}
                                value={type}
                                onChange={(v) => {
                                    setType(v)
                                }}
                                type={''}
                                onChangeRaw={() => {}}
                                openUp={false}
                            />

                            <Select
                                label={'Acceso'}
                                useDotLabel={true}
                                options={areaCodes}
                                value={type}
                                onChange={(v) => {
                                    setType(v)
                                }}
                                type={''}
                                onChangeRaw={() => {}}
                                openUp={false}
                            />
                        </div>

                        <div className="md:flex md:md:items-start md:space-x-2">
                            <Input
                                register={register as any}
                                validationRules={requiredRule as any}
                                errMessage={errors.bano?.message}
                                useStrongErrColor={isSubmitted}
                                label={'N° Niveles'}
                                inputName={'vehicle.year'}
                                useDotLabel={true}
                                value={''}
                                type={''}
                                onChangeEvent={() => {}}
                                onFocus={() => {}}
                                placeHolder="doe"
                            />

                            <Input
                                register={register as any}
                                validationRules={requiredRule as any}
                                errMessage={errors.bano?.message}
                                useStrongErrColor={isSubmitted}
                                label={'N° Habitaciones'}
                                inputName={'vehicle.color'}
                                useDotLabel={true}
                                value={''}
                                type={''}
                                onChangeEvent={() => {}}
                                onFocus={() => {}}
                                placeHolder="0000000"
                            />

                            <Input
                                register={register as any}
                                validationRules={requiredRule as any}
                                errMessage={errors.bano?.message}
                                useStrongErrColor={isSubmitted}
                                label={'N° Adultos'}
                                inputName={'vehicle.color'}
                                useDotLabel={true}
                                value={''}
                                type={''}
                                onChangeEvent={() => {}}
                                onFocus={() => {}}
                                placeHolder="0000000"
                            />

                            <Input
                                register={register as any}
                                validationRules={requiredRule as any}
                                errMessage={errors.bano?.message}
                                useStrongErrColor={isSubmitted}
                                label={'N° Menores'}
                                inputName={'vehicle.color'}
                                useDotLabel={true}
                                value={''}
                                type={''}
                                onChangeEvent={() => {}}
                                onFocus={() => {}}
                                placeHolder="0000000"
                            />

                            <Input
                                register={register as any}
                                validationRules={requiredRule as any}
                                errMessage={errors.bano?.message}
                                useStrongErrColor={isSubmitted}
                                label={'N° Trabajadores'}
                                inputName={'vehicle.color'}
                                useDotLabel={true}
                                value={''}
                                type={''}
                                onChangeEvent={() => {}}
                                onFocus={() => {}}
                                placeHolder="0000000"
                            />

                            <Input
                                register={register as any}
                                validationRules={requiredRule as any}
                                errMessage={errors.bano?.message}
                                useStrongErrColor={isSubmitted}
                                label={'N° Edificación'}
                                inputName={'vehicle.color'}
                                useDotLabel={true}
                                value={''}
                                type={''}
                                onChangeEvent={() => {}}
                                onFocus={() => {}}
                                placeHolder="0000000"
                            />
                        </div>

                        <div className="h-8"></div>

                        <FormTitle title="Dirección de Domicilio" />

                        <div className="md:flex md:md:items-start md:space-x-2">
                            <Select
                                label={'Paredes'}
                                useDotLabel={true}
                                options={areaCodes}
                                value={type}
                                onChange={(v) => {
                                    setType(v)
                                }}
                                type={''}
                                onChangeRaw={() => {}}
                                openUp={false}
                            />
                            <Select
                                label={'Pisos'}
                                useDotLabel={true}
                                options={areaCodes}
                                value={type}
                                onChange={(v) => {
                                    setType(v)
                                }}
                                type={''}
                                onChangeRaw={() => {}}
                                openUp={false}
                            />
                            <Select
                                label={'Techos'}
                                useDotLabel={true}
                                options={areaCodes}
                                value={type}
                                onChange={(v) => {
                                    setType(v)
                                }}
                                type={''}
                                onChangeRaw={() => {}}
                                openUp={false}
                            />
                        </div>
                    </div>
                    <div className="h-8"></div>

                    <div className="flex flex-col space-y-4">
                        <div className="flex justify-end space-x-8">
                            <Button
                                colorType="bg-[#3C50E0]"
                                onClick={() => {}}
                                onClickRaw={() => {}}
                                children={'Aceptar'}
                            ></Button>
                        </div>
                    </div>
                </form>
            </ModalContainer>
        </>
    )
}

export default AuthorityForm
