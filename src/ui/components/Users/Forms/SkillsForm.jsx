import { useForm } from "react-hook-form";

import Input from "../../../core/inputs/Input";
import { Select } from "../../../core/inputs/Selects";
import { useState } from "react";
import AddInput from "../../../core/inputs/AddInput";


const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const shirtSizes = ["XS", "S", "M", "L", "XL", "XXL"];



const testValidationRules = {
    required: {
        value: true,
        message: "El campo es requerido",
    }
}


export default function SkillForm({ submitTriggerRef }) {

    const { register, handleSubmit, formState } = useForm({ mode: "onChange" });

    const { errors, isSubmitted } = formState;

    const [skills, setSkills] = useState([]);

    const [allergies, setAllergies] = useState([]);


    const [bloodType, setBloodType] = useState(bloodTypes[0]);

    const [shirtSize, setShirtSize] = useState(shirtSizes[0])

    const [pantsSize, setPantsSize] = useState(shirtSizes[0])


    function handleSubmitInternal(data) {

    }

    return (

        <form
            noValidate

            onSubmit={handleSubmit((data) => { handleSubmitInternal(data) })}
            className="mx-auto my-10 w-full max-w-[365px] md:max-w-[100%]">

            <h2 className="text-sm text-center mb-4 uppercase">Habilidades y Alergias</h2>

            <div className="space-y-2 md:space-y-0 md:flex md:justify-around md:items-baseline">

                <div className="w-full space-y-4 px-2 max-w-[720px]">

                    <AddInput

                        label={"Habilidades"}
                        inputName={"skill"}
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
                                inputName={"allergie"}
                                useDotLabel={true}
                                placeHolder="Alergia Ejem:Nuez"
                                useStrongErrColor={isSubmitted}
                                items={allergies}
                                setItems={setAllergies}
                            />
                        </div>

                        <div className="md:w-[20%]">
                            <Select label={"Tipo de Sangre"} useDotLabel={true} options={bloodTypes}
                                value={bloodType} onChange={(v) => { setBloodType(v) }} openUp={true} />
                        </div>


                    </div>



                    <div className="md:flex md:space-x-2 md:justify-between">


                        <div className=" md:w-[15%]">
                            <Select label={"Talla Camisa"} useDotLabel={true} options={shirtSizes}
                                value={shirtSize} onChange={(v) => { setShirtSize(v) }}
                                openUp={true}
                            />
                        </div>

                        <div className=" md:w-[15%]">
                            <Select label={"Talla Pantalon"} useDotLabel={true} options={shirtSizes}
                                value={pantsSize} onChange={(v) => { setPantsSize(v) }}
                                openUp={true}
                            />
                        </div>

                        <div className="md:w-[15%]">
                            <Input
                                register={register}
                                validationRules={testValidationRules}
                                label={"Talla Zapatos"}

                                inputName={"shoes_size"} useDotLabel={true}
                                placeHolder="37"
                                useStrongErrColor={isSubmitted}
                                errMessage={errors.shoes_size?.message}
                            />
                        </div>

                        <div className="md:w-[10%]">
                            <Input label={"Altura"}
                                register={register}
                                validationRules={testValidationRules}
                                inputName={"height"} useDotLabel={true}
                                placeHolder="1.70"
                                useStrongErrColor={isSubmitted}
                                errMessage={errors.height?.message} />
                        </div>

                        <div className="md:w-[10%]">
                            <Input label={"Peso"}
                                register={register}
                                validationRules={testValidationRules}
                                inputName={"weight"}
                                useDotLabel={true}
                                placeHolder="60"
                                useStrongErrColor={isSubmitted}
                                errMessage={errors.weight?.message}
                            />
                        </div>



                    </div>


                </div>

            </div>

            <button ref={submitTriggerRef} type="submit" className="w-0 h-0 opacity-0"></button>

        </form>
    )
}