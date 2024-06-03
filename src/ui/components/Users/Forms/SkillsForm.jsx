import { useForm } from "react-hook-form";

import Input from "../../../core/inputs/Input";
import { Select } from "../../../core/inputs/Selects";
import { useState } from "react";

const skills = ["Habilidad Nro 1", "Habilidad Nro 2"];

const civilStatusList = ["Soltero", "Casado", "Divorciado", "Viudo"]


const testValidationRules = {
    required: {
        value: true,
        message: "El campo es requerido",
    }
}



export default function SkillForm({ submitTriggerRef }) {

    const { register, handleSubmit, control, formState } = useForm({ mode: "onChange" });

    const { errors, isSubmitted } = formState;


    const [gender, setGender] = useState(genders[0]);

    const [civilStatus, setCivilStatus] = useState(civilStatusList[0]);


    function handleSubmitInternal(data) {

    }

    return (

        <form
            noValidate

            onSubmit={handleSubmit((data) => { handleSubmitInternal(data) })}
            className="mx-auto my-10 w-full max-w-[365px] md:max-w-[100%]">

            <h2 className="text-sm text-center mb-4 uppercase">Datos basicos del usuario</h2>

            <div className="space-y-2 md:space-y-0 md:flex md:justify-around md:items-baseline">

                <div className="w-full space-y-3 px-2 max-w-[720px]">

                    <div className="md:flex md:space-x-2">
                        <Input
                            register={register}
                            validationRules={testValidationRules}
                            label={"Habilidad"}
                            inputName={"skill"}
                            useDotLabel={true}
                            placeHolder="Habilidad Ejem:Paramedico"
                            errMessage={errors.skill?.message}
                            useStrongErrColor={isSubmitted}
                            
                        />


                        <Input label={"Alergia"} inputName={"email"} useDotLabel={true} placeHolder="jondoe@example.com" />
                    </div>


                    <div className="md:flex  md:space-x-2">

                        <div className="flex-1">
                            <Input label={"Nombre"} inputName={"first_name"} useDotLabel={true} placeHolder="Jon" />

                        </div>

                        <div className="flex-1">
                            <Input label={"Apellido"} inputName={"last_name"} useDotLabel={true} placeHolder="Doe" />

                        </div>
                    </div>

                    <div className="md:flex md:space-x-2">

                        <Input label={"Fecha de Nacimiento"} inputName={"birth_date"} useDotLabel={true} placeHolder="01-01-0001" />


                        <Input label={"Codigo de Area"} inputName={"zip_code"} useDotLabel={true} placeHolder="0244" />


                    </div>


                    <div className="md:flex md:space-x-2">


                        <div className="w-full">
                            <Select label={"Estado Civil"} useDotLabel={true} options={civilStatusList}
                                value={civilStatus} onChange={(v) => { setCivilStatus(v) }} />
                        </div>

                        <div className="w-full">
                            <Select label={"Genero"} useDotLabel={true} options={genders}
                                value={gender} onChange={(v) => { setGender(v) }} />
                        </div>






                    </div>


                    <div className="md:flex md:space-x-2">
                        <Input label={"Telefono"} inputName={"phone"} useDotLabel={true} placeHolder="02129998877" />

                        <Input label={"Telefono Secundario"} inputName={"secondary_phone"} useDotLabel={true} placeHolder="02129998877" />
                    </div>

                    <Input label={"Residencia"} inputName={"residence"} useDotLabel={true} />

                    <button ref={submitTriggerRef} type="submit" className="opacity-0"></button>

                </div>

            </div>

        </form>
    )
}