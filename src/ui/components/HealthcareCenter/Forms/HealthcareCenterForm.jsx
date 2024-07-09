import { useContext, useState } from "react";
import { StepContext } from "../../Stepper/Stepper";
import { useForm } from "react-hook-form";
import SelectWithSearch from "../../../core/inputs/SelectWithSearch";
import Input from "../../../core/inputs/Input";
import FormHiddenButton from "../../../core/buttons/FormHiddenButton";
import AddInput from "../../../core/inputs/AddInput";



const institutions = ["Plataforma de Gestion de Operaciones y Servicios Para Bomberos 21",
    "Plataforma de Gestion de Operaciones y Servicios Para Bomberos"]

const requiredRule = {
    required: {
        value: false,
        message: "El campo es requerido",
    }
}

export default function HealthcareCenterForm({ clickSubmitRef, onSubmit }) {
    const { clickNextRef, currentData, Next } = useContext(StepContext);

    const { register, handleSubmit, formState } = useForm({
        mode: "onChange",
        defaultValues: currentData,
    });

    const { errors, isSubmitted } = formState;



    const [institution, setInstution] = useState(institutions[1]);

    const [institutionErr, setInstutionErr] = useState(false);





    const [regions, setRegions] = useState([]);

    const [phones, setPhones] = useState([]);



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

                    if (institutionErr)
                        return;

                    const newData = { ...data, "institution": institution, "regions": regions, "phones": phones }

                    handleSubmitInternal(newData)
                })}

            className="mx-auto my-4 w-full max-w-[500px] md:max-w-[100%]">

            {/* <FormTitle title={"Datos básicos del Vehículo"} /> */}

            <div className="space-y-2 md:space-y-0 md:flex md:justify-around md:items-baseline">

                <div className="w-full space-y-4 px-2 max-w-[720px]">

                    <SelectWithSearch label={"Institución"}
                        useDotLabel={true}
                        options={institutions}
                        value={institution}
                        onChange={(v) => { setInstution(v) }}
                        errMessage={institutionErr}
                        openUp={false}
                        onError={(err) => { setInstutionErr(err) }}
                        useStrongErrColor={isSubmitted} />

                    <Input

                        register={register}
                        validationRules={requiredRule}

                        errMessage={errors.station_name?.message}
                        useStrongErrColor={isSubmitted}

                        label={"Nombre de la Estación"}
                        inputName={"station_name"}
                        useDotLabel={true}
                        placeHolder="Nombre de la Estación..."

                    />




                    <div className="md:flex md:space-x-2">

                        <Input

                            register={register}
                            validationRules={requiredRule}

                            errMessage={errors.description?.message}
                            useStrongErrColor={isSubmitted}
                            label={"Descripción"}
                            inputName={"description"}
                            useDotLabel={true}
                            placeHolder="Descripción...."

                        />


                        <div className="md:w-[37%]">


                            <AddInput

                                label={"Teléfonos"}
                                inputName={"phones"}
                                useDotLabel={true}
                                placeHolder="0212-9855489"
                                useStrongErrColor={isSubmitted}
                                items={phones}
                                setItems={setPhones}
                            />

                        </div>

                    </div>


                    <div className="md:flex md:space-x-2">


                        <div className="md:w-[30%]">
                            <Input

                                register={register}
                                validationRules={requiredRule}

                                errMessage={errors.code?.message}
                                useStrongErrColor={isSubmitted}

                                label={"Código"}
                                inputName={"code"}
                                useDotLabel={true}
                                placeHolder="01"

                            />
                        </div>

                        <div className="md:w-[30%]">

                            <Input

                                register={register}
                                validationRules={requiredRule}

                                errMessage={errors.initials?.message}
                                useStrongErrColor={isSubmitted}

                                label={"Siglas"}
                                inputName={"initials"}
                                useDotLabel={true}
                                placeHolder="M01"

                            />
                        </div>

                        <AddInput

                            label={"Regiones"}
                            inputName={"regions"}
                            useDotLabel={true}
                            placeHolder="Region Operativa Ejem:01M"
                            useStrongErrColor={isSubmitted}
                            items={regions}
                            setItems={setRegions}
                        />

                    </div>





                </div>

            </div>

            <FormHiddenButton clickNextRef={clickNextRef} clickSubmitRef={clickSubmitRef} />

        </form>
    )
}