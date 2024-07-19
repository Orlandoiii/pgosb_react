import { useContext, useState } from "react";
import { StepContext } from "../../Stepper/Stepper";
import FormInput from "../../../core/inputs/FormInput";
import FormHiddenButton from "../../../core/buttons/FormHiddenButton";
import CustomForm from "../../../core/context/CustomFormContext";
import FormSelectSearch from "../../../core/inputs/FormSelectSearch";
import React from "react";
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

   


    const [brand, setBrand] = useState(currentData?.brand ?? brands[1]);

    const [brandErr, setBrandErr] = useState(false);


    const [model, setModel] = useState(currentData?.model ?? models[1]);

    const [modelErr, setModelErr] = useState(false);


    const [station, setStation] = useState(currentData?.station ?? stations[1]);

    const [stationErr, setStationErr] = useState(false);



    const [color, setColor] = useState(currentData?.color ?? colors[1]);

    const [colorErr, setColorErr] = useState(false);


    const [type, setType] = useState(currentData?.type ?? types[1]);

    const [typeErr, setTypeErr] = useState(false);

    function handleSubmitInternal(data) {

        if (onSubmit)
            onSubmit(data);

        if (Next)
            Next(data);
    }
    return (

        <CustomForm


            onSubmit={
                handleSubmit((data) => {

                    if (modelErr || brandErr || stationErr || colorErr || typeErr)
                        return;

                    const newData = {
                        ...data, "unit_type": type, "make": brand, "model": model,
                        "station": station, "color": color
                    }

                    handleSubmitInternal(newData)
                })}

            classStyle="mx-auto my-4 w-full max-w-[500px] md:max-w-[100%]">


            <div className="space-y-2 md:space-y-0 md:flex md:justify-around md:items-baseline">

                <div className="w-full space-y-4 px-2 max-w-[720px]">

                    <div className="md:flex md:space-x-2">


                        <FormSelectSearch

                            fieldName="unit_type"
                            description={"Tipo"}

                            options={types}

                            openUp={false}
                        />

                        <FormSelectSearch

                            fieldName="brand"
                            description={"Marca"}
                            options={brands}

                            openUp={false}
                        />


                        <FormSelectSearch

                            description={"Modelo"}
                            fieldName="model"
                            options={models}

                            openUp={false}
                        />

                    </div>

                    <div className="">

                        <FormSelectSearch

                            description={"Estación"}
                            fieldName="station"

                            options={stations}

                            openUp={false}

                        />

                    </div>

                    <div className="md:flex md:space-x-2">


                        <FormInput



                            description={"Serial del Motor"}
                            fieldName={"motor_serial"}
                            placeholder="25FG80996645"

                        />

                        <FormInput



                            description={"Serial del Vehiculo"}
                            fieldName={"vehicle_serial"}
                            placeholder="80FG80996645"

                        />

                        <FormInput





                            description={"Tipo de Combustible"}
                            fieldName={"fuel_type"}
                            placeholder="Diesel"

                        />

                    </div>


                    <div className="md:flex  md:space-x-2">



                        <div className="md:w-[w-[50%]]">
                            <FormInput




                                description={"Alias"}
                                fieldName={"alias"}
                                placeholder="El Caballito"

                            />
                        </div>



                        <div className="md:w-[25%]">
                            <FormSelectSearch

                                fieldName="color"
                                description={"Color"}
                                options={colors}

                                openUp={true}


                            />
                        </div>



                        <div className="md:w-[25%]">

                            <FormInput



                                description={"Placa"}
                                fieldName={"plate"}
                                placeholder="7HW33A"

                            />
                        </div>

                        <div className="md:w-[18%]">
                            <FormInput


                                description={"Año"}
                                fieldName={"year"}
                                placeholder="2022"

                            />
                        </div>
                    </div>






                </div>

            </div>

            <FormHiddenButton clickNextRef={clickNextRef} clickSubmitRef={clickSubmitRef} />

        </CustomForm>
    )
}