import { useForm } from "react-hook-form";

import Input from "../../../core/inputs/Input";
import Select from "../../../core/inputs/Selects";
import SelectWithSearch from "../../../core/inputs/SelectWithSearch";

import { useContext, useState } from "react";
import Toggle from "../../../core/buttons/Toggle";
import { StepContext } from "../../Stepper/Stepper";
import FormHiddenButton from "../../../core/buttons/FormHiddenButton";
import FormTitle from "../../../core/titles/FormTitle";



const rolList = ["Administrador", "Usuario", "Otro"]

const rankList = ["Rango 1", "Rango 2", "Rango 3"]

const divisions = ["División 1", "División 2", "División 3"]

const profesions = ["Profesión 1", "Profesión 2", "Profesión 3"]

const instituions = ["Institución 1", "Institución 2", "Institución 3"]



const requiredRule = {
    required: {
        value: true,
        message: "El campo es requerido",
    }
}


export default function InstitutionInfoForm({ clickSubmitRef, onSubmit }) {


    const { clickNextRef, currentData, Next } = useContext(StepContext);


    const { register, handleSubmit, formState, setValue } = useForm({
        mode: "onChange",
        defaultValues: currentData
    });

    const { errors, isSubmitted } = formState;

    const [rol, setRol] = useState(currentData?.rol ?? rolList[0]);

    const [rolErr, setRolErr] = useState("");

    const [division, setDivision] = useState(currentData?.division ?? divisions[0]);

    const [divisionErr, setDivisionErr] = useState("");


    const [profesion, setProfesion] = useState(currentData?.profesion ?? profesions[0]);

    const [profesionErr, setProfesionErr] = useState("");


    const [isSystemUser, setIsSystemUser] = useState(currentData?.is_system_user ?? false);



    function handleSubmitInternal(data) {



        if (onSubmit)
            onSubmit(data);

        if (Next)
            Next(data);
    }

    return (

        <form
            noValidate

            onSubmit={handleSubmit((
                data) => {

                if (rolErr || divisionErr || profesionErr)
                    return

                const newData = {
                    ...data,
                    "is_system_user": isSystemUser,
                    "profesion": profesion,
                    "rol": rol,
                    "division": division,
                }

                handleSubmitInternal(newData)
            })}
            className="mx-auto my-4 w-full max-w-[365px] md:max-w-[100%]">


            {/* <FormTitle title={"Datos Institucionales"} /> */}


            <div className="space-y-2 md:space-y-0 md:flex md:justify-around md:items-baseline">

                <div className="w-full space-y-4 px-2 max-w-[720px]">



                    <div className="md:flex md:space-x-2">
                        <Input label={"Código de Funcionario/a"}

                            register={register}
                            validationRules={requiredRule}

                            useStrongErrColor={isSubmitted}
                            errMessage={errors.code?.message}

                            inputName={"code"}
                            useDotLabel={true}
                            placeHolder="60"

                        />


                        <Input label={"Fecha de Ingreo"}
                            register={register}
                            validationRules={requiredRule}

                            useStrongErrColor={isSubmitted}
                            errMessage={errors.in_date?.message}

                            inputName={"in_date"}
                            useDotLabel={true}
                            placeHolder="01-01-0001"

                        />

                        <Input label={"Fecha de Egreso"}
                            register={register}
                            validationRules={requiredRule}

                            useStrongErrColor={isSubmitted}
                            errMessage={errors.out_date?.message}

                            inputName={"out_date"}
                            useDotLabel={true}
                            placeHolder="01-01-0001"

                        />

                    </div>



                    <div className="md:flex md:space-x-2">

                        <SelectWithSearch

                            label={"Rol"}
                            useDotLabel={true}
                            options={rolList}
                            value={rol}
                            onChange={(v) => { setRol(v) }}
                            openUp={true}

                            errMessage={rolErr}
                            onError={(err) => { setRolErr(err) }}
                            useStrongErrColor={isSubmitted} />

                        <Select
                            label={"Jerarquia"}
                            inputName="rank"
                            register={register}
                            setValue={setValue}
                            useDotLabel={true}
                            options={rankList}
                            value={rankList[0]}
                            openUp={true} />



                        <Select
                            label={"Institución"}
                            inputName={"institution"}
                            register={register}
                            setValue={setValue}
                            useDotLabel={true}
                            options={instituions}
                            value={instituions[0]}
                            openUp={true} />

                    </div>



                    <div className="md:flex md:space-x-2">

                        <SelectWithSearch label={"División"}
                            useDotLabel={true}
                            options={divisions}
                            value={division}
                            onChange={(v) => { setDivision(v) }}
                            openUp={true}
                            onError={(err) => { setDivisionErr(err) }}
                            useStrongErrColor={isSubmitted} />

                        <SelectWithSearch
                            label={"Profesión"}
                            useDotLabel={true}
                            options={profesions}
                            value={profesion}
                            onChange={(v) => { setProfesion(v) }}
                            openUp={true}
                            onError={(err) => { setProfesionErr(err) }}
                            useStrongErrColor={isSubmitted} />




                    </div>

                    <div className="h-full w-full flex justify-start items-center space-x-2">

                        <p className="text-sm">Usuario Sistema:</p>
                        <Toggle
                            active={isSystemUser}
                            setActive={setIsSystemUser} />

                    </div>


                </div>

            </div>

            <FormHiddenButton clickNextRef={clickNextRef} clickSubmitRef={clickSubmitRef} />


        </form>
    )
}