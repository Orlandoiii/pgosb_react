import { useContext, useState } from "react";
import { StepContext } from "../../Stepper/Stepper";
import { useForm } from "react-hook-form";
import SelectWithSearch from "../../../core/inputs/SelectWithSearch";
import Input from "../../../core/inputs/Input";
import FormHiddenButton from "../../../core/buttons/FormHiddenButton";
import AddInput from "../../../core/inputs/AddInput";



const institutions = ["Institución Nombre Largo Para Probar Como se Ve", "Plataforma de Gestion de Operaciones y Servicios Para Bomberos"]

const requiredRule = {
    required: {
        value: false,
        message: "El campo es requerido",
    }
}

export default function StationForm({ clickSubmitRef, onSubmit }) {
    const { clickNextRef, currentData, Next } = useContext(StepContext);

    const { register, handleSubmit, formState } = useForm({
        mode: "onChange",
        defaultValues: currentData,
    });

    const { errors, isSubmitted } = formState;



    const [institution, setInstution] = useState(institutions[0]);

    const [institutionErr, setInstutionErr] = useState("");





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



                    if (modelErr.length > 0 || brandErr.length > 0 ||
                        stationErr.length > 0 || colorErr.length > 0 || typeErr.length > 0)
                        return;


                    const newData = {
                        ...data, "brand": brand, "model": model,
                        "station": station, "color": color, "type": type
                    }


                    handleSubmitInternal(newData)
                })}

            className="mx-auto my-4 w-full max-w-[500px] md:max-w-[100%]">

            {/* <FormTitle title={"Datos basicos del Vehiculo"} /> */}

            <div className="space-y-2 md:space-y-0 md:flex md:justify-around md:items-baseline">

                <div className="w-full space-y-3 px-2 max-w-[720px]">

                    <SelectWithSearch label={"Institución"}
                        useDotLabel={true}
                        options={institutions}
                        value={institution}
                        onChange={(v) => { setInstution(v) }}
                        errMessage={institutionErr}
                        openUp={false}
                        onError={(err) => { setInstutionErr(err) }}
                        useStrongErrColor={isSubmitted} />


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
                                inputName={"regions"}
                                useDotLabel={true}
                                placeHolder="0212-9855489"
                                useStrongErrColor={isSubmitted}
                                items={phones}
                                setItems={setPhones}
                            />

                        </div>

                    </div>





                </div>

            </div>

            <FormHiddenButton clickNextRef={clickNextRef} clickSubmitRef={clickSubmitRef} />

        </form>
    )
}