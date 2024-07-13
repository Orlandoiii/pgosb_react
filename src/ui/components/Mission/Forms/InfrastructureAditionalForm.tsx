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
                            <Input
                                register={register as any}
                                validationRules={requiredRule as any}
                                errMessage={errors.bano?.message}
                                useStrongErrColor={isSubmitted}
                                label={'Valor Mueble'}
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
                                label={'Perdidas Mueble'}
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
                                label={'Valor Inmueble'}
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
                                label={'Perdidas Inmueble'}
                                inputName={'vehicle.year'}
                                useDotLabel={true}
                                value={''}
                                type={''}
                                onChangeEvent={() => {}}
                                onFocus={() => {}}
                                placeHolder="doe"
                            />
                        </div>

                        <div className="md:flex md:md:items-start md:space-x-2">
                            <Input
                                register={register as any}
                                validationRules={requiredRule as any}
                                errMessage={errors.bano?.message}
                                useStrongErrColor={isSubmitted}
                                label={'Habitaciones'}
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
                                label={'Baños'}
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
                                label={'Comedores'}
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
                                label={'Cocinas'}
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
                                label={'Sala-Comedor'}
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
                                label={'Garaje'}
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
                                label={'Oficina'}
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
                                label={'Ambiente'}
                                inputName={'vehicle.year'}
                                useDotLabel={true}
                                value={''}
                                type={''}
                                onChangeEvent={() => {}}
                                onFocus={() => {}}
                                placeHolder="doe"
                            />
                        </div>

                        <div className="h-4"></div>

                        <div className="md:flex md:md:items-start md:space-x-2">
                            <Input
                                register={register as any}
                                validationRules={requiredRule as any}
                                errMessage={errors.bano?.message}
                                useStrongErrColor={isSubmitted}
                                label={'Observaciones'}
                                inputName={'vehicle.year'}
                                useDotLabel={true}
                                value={''}
                                type={''}
                                onChangeEvent={() => {}}
                                onFocus={() => {}}
                                placeHolder="doe"
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
