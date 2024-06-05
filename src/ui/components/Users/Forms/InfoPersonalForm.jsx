import { useForm } from "react-hook-form";

import Input from "../../../core/inputs/Input";
import { Select } from "../../../core/inputs/Selects";
import { useState } from "react";
import AddInput from "../../../core/inputs/AddInput";

const genders = ["M", "F"];

const civilStatusList = ["Solter@", "Casad@", "Divorciad@", "Viud@"]


const testValidationRules = {
    required: {
        value: true,
        message: "El campo es requerido",
    }
}



export default function InfoPersonalForm({ submitTriggerRef }) {

    const { register, handleSubmit, formState } = useForm({ mode: "onChange" });

    const { errors, isSubmitted } = formState;


    const [gender, setGender] = useState(genders[0]);

    const [civilStatus, setCivilStatus] = useState(civilStatusList[0]);

    const [items, setItems] = useState([]);


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
                            label={"Usuario"}
                            inputName={"user_name"}
                            useDotLabel={true}
                            placeHolder="jondoe"
                            errMessage={errors.user_name?.message}
                            useStrongErrColor={isSubmitted}
                        />


                        <Input label={"Email"} inputName={"email"} useDotLabel={true} placeHolder="jondoe@example.com" />

                        <div className="md:w-[20%]">
                            <Select label={"Genero"} useDotLabel={true} options={genders}
                                value={gender} onChange={(v) => { setGender(v) }} openUp={false} />
                        </div>

                    </div>


                    <div className="md:flex  md:space-x-2">


                        <Input label={"Nombre"} inputName={"first_name"} useDotLabel={true} placeHolder="Jon" />


                        <Input label={"Apellido"} inputName={"last_name"} useDotLabel={true} placeHolder="Doe" />


                        <div className="w-[45%]">
                            <Input label={"Fe. Nacimiento"} inputName={"birth_date"} useDotLabel={true} placeHolder="01-01-0001" />
                        </div>


                    </div>

                    <div className="md:flex md:space-x-2">


                        <Input label={"Telefono"} inputName={"phone"} useDotLabel={true} placeHolder="02129998877" />

                        <Input label={"Telefono 2"} inputName={"secondary_phone"} useDotLabel={true} placeHolder="02129998877" />

                        <div className="md:w-[27%]">
                            <Input label={"Cod. Area"} inputName={"zip_code"} useDotLabel={true} placeHolder="0244" />

                        </div>

                    </div>


                    <div className="md:flex md:space-x-2">


                        <div className="w-[30%]">
                            <Select label={"Estado Civil"} useDotLabel={true} options={civilStatusList}
                                value={civilStatus} onChange={(v) => { setCivilStatus(v) }} openUp={true} />
                        </div>

                        <Input label={"Residencia"} inputName={"residence"} useDotLabel={true} />
                    </div>
                </div>

            </div>

            <button ref={submitTriggerRef} type="submit" className="w-0 h-0 opacity-0"></button>

        </form>
    )
}