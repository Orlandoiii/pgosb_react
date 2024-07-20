import { useContext } from "react";
import { StepContext } from "../../Stepper/Stepper";
import FormInput from "../../../core/inputs/FormInput";
import FormHiddenButton from "../../../core/buttons/FormHiddenButton";
import CustomForm from "../../../core/context/CustomFormContext";
import FormSelectSearch from "../../../core/inputs/FormSelectSearch";
import React from "react";
import { Colors } from "../../../../domain/abstractions/colors/colors";


const brands = ["Ford", "Toyota", "Chevrolet"];

const models = ["Aveo", "Corolla", "Lancer", "Terios"]

const stations = ["Station 1", "Station 2", "Station 3"]


const types = ["Tipo 1", "Tipo 2", "Tipo 3", "Tipo 4"]

export default function BasicInfoForm({ clickSubmitRef, onSubmit }) {
    const { clickNextRef, currentData, Next } = useContext(StepContext);


    function handleSubmitInternal(data) {

        if (onSubmit)
            onSubmit(data);

        if (Next)
            Next(data);
    }
    return (

        <CustomForm

            initValue={currentData}
            onSubmit={
                (data) => {
                    logger.info();
                    handleSubmitInternal(data)
                }}

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
                                options={Colors}

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