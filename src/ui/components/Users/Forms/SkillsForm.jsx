import { useForm } from "react-hook-form";

import Input from "../../../core/inputs/Input";
import Select from "../../../core/inputs/Selects";
import { useContext, useState } from "react";
import AddInput from "../../../core/inputs/AddInput";
import FormHiddenButton from "../../../core/buttons/FormHiddenButton";
import { StepContext } from "../../Stepper/Stepper";
import FormTitle from "../../../core/titles/FormTitle";


const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const shirtSizes = ["XS", "S", "M", "L", "XL", "XXL"];


const requiredRule = {
    required: {
        value: true,
        message: "El campo es requerido",
    }
}

export default function SkillForm({ clickSubmitRef, onSubmit }) {

    const { clickNextRef, currentData, Next } = useContext(StepContext);


    const { register, handleSubmit, formState, setValue } = useForm({ mode: "onChange", defaultValues: currentData });

    const { errors, isSubmitted } = formState;

    const [skills, setSkills] = useState(currentData?.skills ?? []);

    const [allergies, setAllergies] = useState(currentData?.allergies ?? []);


    function handleSubmitInternal(data) {


        if (onSubmit)
            onSubmit(data);

        if (Next)
            Next(data);
    }

    return (

        <form
            noValidate

            onSubmit={handleSubmit((data) => {

                const newData = {
                    ...data, "skills": skills, "allergies": allergies,
                }

                handleSubmitInternal(newData)
            })}
            className="mx-auto my-4 w-full max-w-[380px] md:max-w-[100%] bg-transparent">

            {/* <FormTitle title={"Habilidades y Alergias"} /> */}

            <div className="space-y-2 md:space-y-0 md:flex md:justify-around md:items-baseline">

                <div className="w-full space-y-4 px-2 max-w-[720px]">

                    <AddInput

                        label={"Habilidades"}
                        inputName={"skills"}
                        useDotLabel={true}
                        placeHolder="Habilidad Ejem: Paramédico"
                        useStrongErrColor={isSubmitted}
                        items={skills}
                        setItems={setSkills}
                    />



                    <div className="md:flex md:items-baseline md:space-x-4">



                        <AddInput

                            label={"Alergias"}
                            inputName={"allergies"}
                            useDotLabel={true}
                            placeHolder="Alergia Ejem: Nuez"
                            useStrongErrColor={isSubmitted}
                            items={allergies}
                            setItems={setAllergies}
                        />





                    </div>



                    <div className="md:flex md:space-x-2 md:justify-between">

                        <div className="w-[50%] space-y-2">

                            <h2>Datos físicos</h2>


                            <div className="flex space-x-2 ">
                                <div className="md:w-[30%]">
                                    <Input label={"Altura"}

                                        register={register}
                                        validationRules={requiredRule}

                                        errMessage={errors.height?.message}
                                        useStrongErrColor={isSubmitted}

                                        inputName={"height"} useDotLabel={true}
                                        placeHolder="1.70"
                                    />
                                </div>

                                <div className="md:w-[30%]">
                                    <Input label={"Peso"}

                                        register={register}
                                        validationRules={requiredRule}

                                        errMessage={errors.weight?.message}
                                        useStrongErrColor={isSubmitted}

                                        inputName={"weight"}
                                        useDotLabel={true}
                                        placeHolder="70"

                                    />
                                </div>


                                <div className="md:w-[40%]">
                                    <Select
                                        label={"Tipo de Sangre"}
                                        inputName={"blood_type"}
                                        register={register}
                                        useDotLabel={true}
                                        options={bloodTypes}
                                        value={bloodTypes[0]}
                                        setValue={setValue}
                                        openUp={true} />
                                </div>
                            </div>



                        </div>


                        <div className="w-[50%] space-y-2">

                            <h2>Tallas</h2>

                            <div className="flex space-x-2">



                                <div className=" md:w-[33%]">
                                    <Select
                                        inputName={"shirt_size"}
                                        label={"Camisa"}
                                        useDotLabel={true}
                                        options={shirtSizes}
                                        value={shirtSizes[0]}
                                        register={register}
                                        setValue={setValue}
                                        openUp={true}

                                    />
                                </div>


                                <div className=" md:w-[33%]">
                                    <Select label={"Pantalón"}
                                        inputName={"pants_size"}
                                        register={register}
                                        setValue={setValue}
                                        useDotLabel={true}
                                        options={shirtSizes}
                                        value={shirtSizes[0]}
                                        openUp={true}
                                    />
                                </div>



                                <div className="md:w-[33%]">
                                    <Input

                                        register={register}
                                        validationRules={requiredRule}

                                        errMessage={errors.shoes_size?.message}
                                        useStrongErrColor={isSubmitted}


                                        label={"Zapatos"}
                                        inputName={"shoes_size"} useDotLabel={true}
                                        placeHolder="37"

                                    />
                                </div>
                            </div>




                        </div>





                    </div>


                </div>

            </div>

            <FormHiddenButton clickNextRef={clickNextRef} clickSubmitRef={clickSubmitRef} />

        </form>
    )
}