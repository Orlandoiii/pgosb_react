import { useForm } from "react-hook-form";

import Input from "../../../core/inputs/Input";
import { Select } from "../../../core/inputs/Selects";
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


    const { register, handleSubmit, formState } = useForm({ mode: "onChange", defaultValues: currentData });

    const { errors, isSubmitted } = formState;

    const [skills, setSkills] = useState(currentData?.skills ?? []);

    const [allergies, setAllergies] = useState(currentData?.allergies ?? []);


    const [bloodType, setBloodType] = useState(currentData?.blood_type ?? bloodTypes[0]);

    const [shirtSize, setShirtSize] = useState(currentData?.shirt_size ?? shirtSizes[0])

    const [pantsSize, setPantsSize] = useState(currentData?.pants_size ?? shirtSizes[0])


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
                    ...data, "blood_type": bloodType, "skills": skills, "allergies": allergies,
                    "shirt_size": shirtSize, "pants_size": pantsSize
                }

                handleSubmitInternal(newData)
            })}
            className="mx-auto my-10 w-full max-w-[365px] md:max-w-[100%]">

            <FormTitle title={"Habilidades y Alergias"} />

            <div className="space-y-2 md:space-y-0 md:flex md:justify-around md:items-baseline">

                <div className="w-full space-y-4 px-2 max-w-[720px]">

                    <AddInput

                        label={"Habilidades"}
                        inputName={"skills"}
                        useDotLabel={true}
                        placeHolder="Habilidad Ejem:Paramedico"
                        useStrongErrColor={isSubmitted}
                        items={skills}
                        setItems={setSkills}
                    />



                    <div className="md:flex md:items-baseline md:space-x-4">


                        <div className="md:flex-1">
                            <AddInput

                                label={"Alergias"}
                                inputName={"allergies"}
                                useDotLabel={true}
                                placeHolder="Alergia Ejem:Nuez"
                                useStrongErrColor={isSubmitted}
                                items={allergies}
                                setItems={setAllergies}
                            />
                        </div>

                        <div className="md:w-[20%]">
                            <Select label={"Tipo de Sangre"}
                                useDotLabel={true}
                                options={bloodTypes}
                                value={bloodType}
                                onChange={(v) => { setBloodType(v) }} openUp={true} />
                        </div>


                    </div>



                    <div className="md:flex md:space-x-2 md:justify-between">


                        <div className=" md:w-[15%]">
                            <Select

                                label={"Talla Camisa"}
                                useDotLabel={true}
                                options={shirtSizes}
                                value={shirtSize}
                                onChange={(v) => { setShirtSize(v) }}
                                openUp={true}

                            />
                        </div>

                        <div className=" md:w-[15%]">
                            <Select label={"Talla Pantalon"}

                                useDotLabel={true}
                                options={shirtSizes}
                                value={pantsSize}
                                onChange={(v) => { setPantsSize(v) }}
                                openUp={true}
                            />
                        </div>

                        <div className="md:w-[15%]">
                            <Input

                                register={register}
                                validationRules={requiredRule}

                                errMessage={errors.shoes_size?.message}
                                useStrongErrColor={isSubmitted}


                                label={"Talla Zapatos"}
                                inputName={"shoes_size"} useDotLabel={true}
                                placeHolder="37"

                            />
                        </div>

                        <div className="md:w-[10%]">
                            <Input label={"Altura"}

                                register={register}
                                validationRules={requiredRule}

                                errMessage={errors.height?.message}
                                useStrongErrColor={isSubmitted}

                                inputName={"height"} useDotLabel={true}
                                placeHolder="1.70"
                            />
                        </div>

                        <div className="md:w-[10%]">
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

                    </div>


                </div>

            </div>

            <FormHiddenButton clickNextRef={clickNextRef} clickSubmitRef={clickSubmitRef} />

        </form>
    )
}