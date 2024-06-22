import { useForm } from "react-hook-form";

import Input from "../../../core/inputs/Input";
import  Select  from "../../../core/inputs/Selects";
import { useContext } from "react";
import { StepContext } from "../../Stepper/Stepper";
import FormHiddenButton from "../../../core/buttons/FormHiddenButton";
import FormTitle from "../../../core/titles/FormTitle";

const genders = ["M", "F"];

const civilStatusList = ["Solter@", "Casad@", "Divorciad@", "Viud@"]


const requiredRule = {
    required: {
        value: false,
        message: "El campo es requerido",
    }
}

export default function InfoPersonalForm({ clickSubmitRef, onSubmit }) {

    const { clickNextRef, currentData, Next } = useContext(StepContext);

    const { register, handleSubmit, formState, setValue } = useForm({
        mode: "onChange",
        defaultValues: currentData,
    });

    const { errors, isSubmitted } = formState;



    function handleSubmitInternal(data) {

        if (onSubmit)
            onSubmit(data);

        if (Next)
            Next(data);
    }

    return (

        <form
            noValidate

            onSubmit={
                handleSubmit((data) => {
                    handleSubmitInternal(data)
                })}

            className="mx-auto my-10 w-full max-w-[500px] md:max-w-[100%]">

            <FormTitle title={"Datos basicos del usuario"} />

            <div className="space-y-2 md:space-y-0 md:flex md:justify-around md:items-baseline">

                <div className="w-full space-y-3 px-2 max-w-[720px]">

                    <div className="md:flex md:space-x-2">
                        <Input

                            register={register}
                            validationRules={requiredRule}

                            errMessage={errors.user_name?.message}
                            useStrongErrColor={isSubmitted}

                            label={"Usuario"}
                            inputName={"user_name"}
                            useDotLabel={true}
                            placeHolder="jondoe"

                        />


                        <Input
                            register={register}
                            validationRules={requiredRule}

                            errMessage={errors.email?.message}
                            useStrongErrColor={isSubmitted}

                            label={"Email"}
                            inputName={"email"}
                            useDotLabel={true}
                            placeHolder="jondoe@example.com" />

                        <div className="md:w-[20%]">
                            <Select
                                inputName={"gender"}
                                register={register}
                                setValue={setValue}
                                label={"Genero"}
                                useDotLabel={true}
                                options={genders}
                                value={genders[0]}
                                openUp={false} />
                        </div>

                    </div>


                    <div className="md:flex  md:space-x-2">


                        <Input

                            register={register}
                            validationRules={requiredRule}

                            errMessage={errors.first_name?.message}
                            useStrongErrColor={isSubmitted}


                            label={"Nombre"}
                            inputName={"first_name"}
                            useDotLabel={true}
                            placeHolder="Jon" />


                        <Input

                            register={register}
                            validationRules={requiredRule}

                            errMessage={errors.last_name?.message}
                            useStrongErrColor={isSubmitted}


                            label={"Apellido"}
                            inputName={"last_name"}
                            useDotLabel={true}
                            placeHolder="Doe" />


                        <div className="w-[45%]">
                            <Input

                                register={register}
                                validationRules={requiredRule}

                                errMessage={errors.birth_date?.message}
                                useStrongErrColor={isSubmitted}

                                label={"Fe. Nacimiento"}
                                inputName={"birth_date"}
                                useDotLabel={true}
                                placeHolder="01-01-0001" />

                        </div>


                    </div>

                    <div className="md:flex md:space-x-2">


                        <Input

                            register={register}
                            validationRules={requiredRule}

                            errMessage={errors.phone?.message}
                            useStrongErrColor={isSubmitted}

                            label={"Telefono"}
                            inputName={"phone"}
                            useDotLabel={true}
                            placeHolder="02129998877" />

                        <Input
                            register={register}
                            validationRules={requiredRule}

                            errMessage={errors.secondary_phone?.message}
                            useStrongErrColor={isSubmitted}

                            label={"Telefono 2"}
                            inputName={"secondary_phone"}
                            useDotLabel={true}
                            placeHolder="02129998877" />

                        <div className="md:w-[27%]">
                            <Input

                                register={register}
                                validationRules={requiredRule}

                                errMessage={errors.zip_code?.message}
                                useStrongErrColor={isSubmitted}

                                label={"Cod. Area"}
                                inputName={"zip_code"}
                                useDotLabel={true}
                                placeHolder="0244" />

                        </div>

                    </div>


                    <div className="md:flex md:space-x-2">


                        <div className="w-[30%]">
                            <Select

                                inputName={"civil_state"}
                                label={"Estado Civil"}
                                useDotLabel={true}
                                options={civilStatusList}
                                value={civilStatusList[0]}
                                register={register}
                                setValue={setValue}
                                openUp={true} />
                        </div>

                        <Input
                            register={register}
                            validationRules={requiredRule}

                            errMessage={errors.residence?.message}
                            useStrongErrColor={isSubmitted}

                            label={"Residencia"}
                            inputName={"residence"}
                            useDotLabel={true} />

                    </div>
                </div>

            </div>

            <FormHiddenButton clickNextRef={clickNextRef} clickSubmitRef={clickSubmitRef} />

        </form>
    )
}