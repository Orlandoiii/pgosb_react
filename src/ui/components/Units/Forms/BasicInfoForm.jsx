import { useContext, useState } from "react";
import { StepContext } from "../../Stepper/Stepper";
import { useForm } from "react-hook-form";
import FormTitle from "../../../core/titles/FormTitle";
import SelectWithSearch  from "../../../core/inputs/SelectWithSearch";
import Input from "../../../core/inputs/Input";
import FormHiddenButton from "../../../core/buttons/FormHiddenButton";

const brands = ["Ford", "Toyota", "Chevrolet"];

const models = ["Aveo", "Corolla", "Lancer", "Terios"]

const stations = ["Station 1", "Station 2", "Station 3"]

const colors = ["Azul", "Verde", "Amarillo", "Plata", "Dorado"]

const types = ["Tipo 1", "Tipo 2", "Tipo 3", "Tipo 4"]

const requiredRule = {
    required: {
        value: false,
        message: "El campo es requerido",
    }
}

export default function BasicInfoForm({ clickSubmitRef, onSubmit }) {
    const { clickNextRef, currentData, Next } = useContext(StepContext);

    const { register, handleSubmit, formState } = useForm({
        mode: "onChange",
        defaultValues: currentData,
    });

    const { errors, isSubmitted } = formState;


    const [brand, setBrand] = useState(currentData?.brand ?? brands[1]);

    const [brandErr, setBrandErr] = useState("");


    const [model, setModel] = useState(currentData?.model ?? models[1]);

    const [modelErr, setModelErr] = useState("");


    const [station, setStation] = useState(currentData?.station ?? stations[1]);

    const [stationErr, setStationErr] = useState("");



    const [color, setColor] = useState(currentData?.color ?? colors[1]);

    const [colorErr, setColorErr] = useState("");


    const [type, setType] = useState(currentData?.type ?? types[1]);

    const [typeErr, setTypeErr] = useState("");

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

            className="mx-auto my-10 w-full max-w-[500px] md:max-w-[100%]">

            <FormTitle title={"Datos basicos del Vehiculo"} />

            <div className="space-y-2 md:space-y-0 md:flex md:justify-around md:items-baseline">

                <div className="w-full space-y-3 px-2 max-w-[720px]">

                    <div className="md:flex md:space-x-2">



                        <SelectWithSearch label={"Marca"}
                            useDotLabel={true}
                            options={brands}
                            value={brand}
                            onChange={(v) => { setBrand(v) }}
                            openUp={true}
                            onError={(err) => { setBrandErr(err) }}
                            useStrongErrColor={isSubmitted} />


                        <SelectWithSearch label={"Modelo"}
                            useDotLabel={true}
                            options={models}
                            value={model}
                            onChange={(v) => { setModel(v) }}
                            openUp={true}
                            onError={(err) => { setModelErr(err) }}
                            useStrongErrColor={isSubmitted} />

                    </div>


                    <div className="md:flex  md:space-x-2">

                        <Input

                            register={register}
                            validationRules={requiredRule}

                            errMessage={errors.alias?.message}
                            useStrongErrColor={isSubmitted}

                            label={"Alias"}
                            inputName={"alias"}
                            useDotLabel={true}
                            placeHolder="El Caballito"

                        />
                        <div className="md:w-[30%]">

                            <Input

                                register={register}
                                validationRules={requiredRule}

                                errMessage={errors.badge?.message}
                                useStrongErrColor={isSubmitted}

                                label={"Placa"}
                                inputName={"badge"}
                                useDotLabel={true}
                                placeHolder="7HW33A"

                            />
                        </div>

                        <div className="md:w-[18%]">
                            <Input

                                register={register}
                                validationRules={requiredRule}

                                errMessage={errors.year?.message}
                                useStrongErrColor={isSubmitted}

                                label={"Año"}
                                inputName={"year"}
                                useDotLabel={true}
                                placeHolder="2022"

                            />
                        </div>

                    </div>

                    <div className="md:flex  md:space-x-2">

                        <SelectWithSearch label={"Color"}
                            useDotLabel={true}
                            options={colors}
                            value={color}
                            onChange={(v) => { setColor(v) }}
                            openUp={true}
                            onError={(err) => { setColorErr(err) }}
                            useStrongErrColor={isSubmitted} />

                        <SelectWithSearch label={"Tipo"}
                            useDotLabel={true}
                            options={types}
                            value={type}
                            onChange={(v) => { setType(v) }}
                            openUp={true}
                            onError={(err) => { setTypeErr(err) }}
                            useStrongErrColor={isSubmitted} />
                    </div>


                    <div className="">

                        <SelectWithSearch label={"Estacion"}
                            useDotLabel={true}
                            options={stations}
                            value={station}
                            onChange={(v) => { setStation(v) }}
                            openUp={true}
                            onError={(err) => { setStationErr(err) }}
                            useStrongErrColor={isSubmitted} />

                    </div>


                </div>

            </div>

            <FormHiddenButton clickNextRef={clickNextRef} clickSubmitRef={clickSubmitRef} />

        </form>
    )
}