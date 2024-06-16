import { useContext, useState } from "react";
import { StepContext } from "../../Stepper/Stepper";
import { useForm } from "react-hook-form";
import FormTitle from "../../../core/titles/FormTitle";
import Input from "../../../core/inputs/Input";
import FormHiddenButton from "../../../core/buttons/FormHiddenButton";

const requiredRule = {
    required: {
        value: false,
        message: "El campo es requerido",
    }
}

export default function DataForm({ clickSubmitRef, onSubmit }) {
    const { clickNextRef, currentData, Next } = useContext(StepContext);

    const { register, handleSubmit, formState } = useForm({
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

                    const newData = { ...data }


                    handleSubmitInternal(newData)
                })}

            className="mx-auto my-10 w-full max-w-[500px] md:max-w-[100%]">

            <FormTitle title={"Caracteristicas del Vehiculo"} />

            <div className="space-y-2 md:space-y-0 md:flex md:justify-around md:items-baseline">

                <div className="w-full space-y-3 px-2 max-w-[720px]">

                    <div className="md:flex md:space-x-2">


                        <Input

                            register={register}
                            validationRules={requiredRule}

                            errMessage={errors.use?.message}
                            useStrongErrColor={isSubmitted}

                            label={"Uso/Proposito"}
                            inputName={"use"}
                            useDotLabel={true}
                            placeHolder="Para transporte de personal"

                        />

                    </div>


                    <div className="md:flex md:space-x-2">

                        <div className="md:w-[20%]">
                            <Input

                                register={register}
                                validationRules={requiredRule}

                                errMessage={errors.person_capacity?.message}
                                useStrongErrColor={isSubmitted}

                                label={"Cap. Personas"}
                                inputName={"person_capacity"}
                                useDotLabel={true}
                                placeHolder="8"

                            />
                        </div>

                        <div className="">
                            <Input

                                register={register}
                                validationRules={requiredRule}

                                errMessage={errors.hurt_capacity?.message}
                                useStrongErrColor={isSubmitted}

                                label={"Cap. Heridos"}
                                inputName={"hurt_capacity"}
                                useDotLabel={true}
                                placeHolder="4"

                            />

                        </div>


                        <div className="">
                            <Input

                                register={register}
                                validationRules={requiredRule}

                                errMessage={errors.doors?.message}
                                useStrongErrColor={isSubmitted}

                                label={"Nro. Puertas"}
                                inputName={"doors"}
                                useDotLabel={true}
                                placeHolder="4"

                            />
                        </div>


                        <div className="">
                            <Input

                                register={register}
                                validationRules={requiredRule}

                                errMessage={errors.performance?.message}
                                useStrongErrColor={isSubmitted}

                                label={"Rendimiento"}
                                inputName={"performance"}
                                useDotLabel={true}
                                placeHolder="10 Km/L"

                            />
                        </div>


                    </div>



                    <div className="md:flex md:space-x-2">

                        <Input

                            register={register}
                            validationRules={requiredRule}

                            errMessage={errors.load_capacity?.message}
                            useStrongErrColor={isSubmitted}

                            label={"Cap. Carga"}
                            inputName={"load_capacity"}
                            useDotLabel={true}
                            placeHolder="10.000 Kg"

                        />


                        <Input

                            register={register}
                            validationRules={requiredRule}

                            errMessage={errors.liters_capacity?.message}
                            useStrongErrColor={isSubmitted}

                            label={"Cap. Litros"}
                            inputName={"liters_capacity"}
                            useDotLabel={true}
                            placeHolder="10.000 L"

                        />

                        <Input

                            register={register}
                            validationRules={requiredRule}

                            errMessage={errors.init_kilometer?.message}
                            useStrongErrColor={isSubmitted}

                            label={"Kilometraje Inicial"}
                            inputName={"init_kilometer"}
                            useDotLabel={true}
                            placeHolder="10.0000 KM"

                        />






                    </div>




                </div>

            </div>

            <FormHiddenButton clickNextRef={clickNextRef} clickSubmitRef={clickSubmitRef} />

        </form>
    )
}