import { useForm } from "react-hook-form";

import Input from "../../../core/inputs/Input";
import { Select, SelectWithSearch } from "../../../core/inputs/Selects";
import { useState } from "react";
import AddInput from "../../../core/inputs/AddInput";
import Toggle from "../../../core/buttons/Toggle";



const rolList = ["Administrador", "Usuario", "Otro"]

const rankList = ["Rango 1", "Rango 2", "Rango 3"]

const divisions = ["Division 1", "Division 2", "Division 3"]

const profesions = ["Profesion 1", "Profesion 2", "Profesion 3"]

const instituions = ["Institucion 1", "Institucion 2", "Institucion 3"]


const testValidationRules = {
    required: {
        value: true,
        message: "El campo es requerido",
    }
}


export default function InstitutionInfoForm({ submitTriggerRef }) {

    const { register, handleSubmit, formState } = useForm({ mode: "onChange" });

    const { errors, isSubmitted } = formState;

    const [rol, setRol] = useState(rolList[0]);

    const [rank, setRank] = useState(rankList[0]);

    const [division, setDivision] = useState(divisions[0]);

    const [profesion, setProfesion] = useState(profesions[0]);

    const [institution, setInstitution] = useState(instituions[0]);

    const [isSystemUser, setIsSystemUser] = useState(false);

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



                    <div className="md:flex md:space-x-2">
                        <Input label={"Codigo de Funcionario"}
                            register={register}
                            validationRules={testValidationRules}
                            inputName={"code"}
                            useDotLabel={true}
                            placeHolder="60"
                            useStrongErrColor={isSubmitted}
                            errMessage={errors.code?.message}
                        />


                        <Input label={"Fecha de Ingreo"}
                            register={register}
                            validationRules={testValidationRules}
                            inputName={"in_date"}
                            useDotLabel={true}
                            placeHolder="01-01-0001"
                            useStrongErrColor={isSubmitted}
                            errMessage={errors.in_date?.message}
                        />

                        <Input label={"Fecha de Egreso"}
                            register={register}
                            validationRules={testValidationRules}
                            inputName={"out_date"}
                            useDotLabel={true}
                            placeHolder="01-01-0001"
                            useStrongErrColor={isSubmitted}
                            errMessage={errors.out_date?.message}
                        />

                    </div>



                    <div className="md:flex md:space-x-2">

                        <div className="w-full h-full">
                            <Select label={"Jerarquia"} useDotLabel={true} options={rankList}
                                value={rank} onChange={(v) => { setRank(v) }} openUp={true} useStrongErrColor={isSubmitted} />

                        </div>
                        <div className="w-full h-full">
                            <SelectWithSearch label={"Rol"} useDotLabel={true} options={rolList}
                                value={rol} onChange={(v) => { setRol(v) }} openUp={true} useStrongErrColor={isSubmitted} />
                        </div>

                    </div>



                    <div className="md:flex md:space-x-2">

                        <SelectWithSearch label={"Division"} useDotLabel={true} options={divisions}
                            value={division} onChange={(v) => { setDivision(v) }} openUp={true} useStrongErrColor={isSubmitted} />

                        <SelectWithSearch label={"Profesion"} useDotLabel={true} options={profesions}
                            value={profesion} onChange={(v) => { setProfesion(v) }} openUp={true} useStrongErrColor={isSubmitted} />


                        <Select label={"Institucion"} useDotLabel={true} options={rankList}
                            value={institution} onChange={(v) => { setInstitution(v) }} openUp={true} useStrongErrColor={isSubmitted} />

                    </div>

                    <div className="h-full w-full flex justify-start items-center space-x-2">

                        <p className="text-sm">Usuario Sistema:</p>
                        <Toggle active={isSystemUser} setActive={setIsSystemUser} />

                    </div>


                </div>

            </div>

            <button ref={submitTriggerRef} type="submit" className="w-0 h-0 opacity-0"></button>

        </form>
    )
}