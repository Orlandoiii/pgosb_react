import { useForm } from "react-hook-form";

import Input from "../../../core/inputs/Input";
import { Select, SelectWithSearch } from "../../../core/inputs/Selects";
import { useContext, useState } from "react";
import Toggle from "../../../core/buttons/Toggle";
import { StepContext } from "../../Stepper/Stepper";
import FormHiddenButton from "../../../core/buttons/FormHiddenButton";
import FormTitle from "../../../core/titles/FormTitle";



const rolList = ["Administrador", "Usuario", "Otro"]

const rankList = ["Rango 1", "Rango 2", "Rango 3"]

const divisions = ["Division 1", "Division 2", "Division 3"]

const profesions = ["Profesion 1", "Profesion 2", "Profesion 3"]

const instituions = ["Institucion 1", "Institucion 2", "Institucion 3"]



const requiredRule = {
    required: {
        value: true,
        message: "El campo es requerido",
    }
}


export default function InstitutionInfoForm({ clickSubmitRef, onSubmit }) {


    const { clickNextRef, currentData, Next } = useContext(StepContext);


    const { register, handleSubmit, formState } = useForm({
        mode: "onChange",
        defaultValues: currentData
    });

    const { errors, isSubmitted } = formState;

    const [rol, setRol] = useState(currentData?.rol ?? rolList[0]);


    const [rank, setRank] = useState(currentData?.rank ?? rankList[0]);

    const [rankErr, setRankErr] = useState("");



    const [division, setDivision] = useState(currentData?.division ?? divisions[0]);

    const [divisionErr, setDivisionErr] = useState("");


    const [profesion, setProfesion] = useState(currentData?.profesion ?? profesions[0]);

    const [profesionErr, setProfesionErr] = useState("");




    const [institution, setInstitution] = useState(currentData?.institution ?? instituions[0]);

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

                if (rankErr.length > 0 || divisionErr.length > 0 || profesionErr.length > 0)
                    return

                const newData = {
                    ...data,
                    "is_system_user": isSystemUser,
                    "rank": rank,
                    "profesion": profesion,
                    "rol": rol,
                    "division": division,
                    "institution": institution
                }

                handleSubmitInternal(newData)
            })}
            className="mx-auto my-10 w-full max-w-[365px] md:max-w-[100%]">


            <FormTitle title={"Datos Institucionales"} />


            <div className="space-y-2 md:space-y-0 md:flex md:justify-around md:items-baseline">

                <div className="w-full space-y-4 px-2 max-w-[720px]">



                    <div className="md:flex md:space-x-2">
                        <Input label={"Codigo de Funcionario"}

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

                        <div className="w-full h-full">
                            <Select label={"Jerarquia"}

                                useDotLabel={true}
                                options={rankList}
                                value={rank}
                                onChange={(v) => { setRank(v) }} openUp={true} useStrongErrColor={isSubmitted} />

                        </div>
                        <div className="w-full h-full">
                            <SelectWithSearch

                                onError={(err) => { setRankErr(err) }}
                                label={"Rol"}
                                useDotLabel={true}
                                options={rolList}
                                value={rol}
                                onChange={(v) => { setRol(v) }}
                                openUp={true}
                                useStrongErrColor={isSubmitted} />
                        </div>

                    </div>



                    <div className="md:flex md:space-x-2">

                        <SelectWithSearch label={"Division"}
                            useDotLabel={true}
                            options={divisions}
                            value={division}
                            onChange={(v) => { setDivision(v) }}
                            openUp={true}
                            onError={(err) => { setDivisionErr(err) }}
                            useStrongErrColor={isSubmitted} />

                        <SelectWithSearch
                            label={"Profesion"}
                            useDotLabel={true}
                            options={profesions}
                            value={profesion}
                            onChange={(v) => { setProfesion(v) }}
                            openUp={true}
                            onError={(err) => { setProfesionErr(err) }}
                            useStrongErrColor={isSubmitted} />


                        <Select
                            label={"Institucion"}
                            useDotLabel={true}
                            options={rankList}
                            value={institution}
                            onChange={(v) => { setInstitution(v) }}
                            openUp={true}
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