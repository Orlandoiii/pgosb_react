import { useContext, useState } from "react";
import { StepContext } from "../../Stepper/Stepper";
import FormInput from "../../../core/inputs/FormInput";
import FormHiddenButton from "../../../core/buttons/FormHiddenButton";
import CustomForm from "../../../core/context/CustomFormContext";
import React from "react";
import AddInput from "../../../core/inputs/AddInput";
import { UnitCharacteristicsSchema } from "../../../../domain/models/unit/unit";
import logger from "../../../../logic/Logger/logger";




export default function DataForm({ clickSubmitRef, onSubmit }) {
    const { clickNextRef, currentData, Next } = useContext(StepContext);

 

    const [details, setDetails] = useState([]);

    const [condtions, setConditions] = useState([]);


    function handleSubmitInternal(data) {

        if (onSubmit)
            onSubmit(data);

        if (Next)
            Next(data);
    }
    return (

        <CustomForm
            schema={UnitCharacteristicsSchema}
            initValue={currentData}

            onSubmit={
                (data) => {
                    logger.info(data);
                    handleSubmitInternal(data)
                }}


            classStyle="mx-auto my-4 w-full max-w-[500px] md:max-w-[100%]">

            {/* <FormTitle title={"Características del Vehículo"} /> */}

            <div className="space-y-2 md:space-y-0 md:flex md:justify-around md:items-baseline">

                <div className="w-full space-y-4 px-2 max-w-[720px]">

                    <div className="md:flex md:space-x-2">
                        <FormInput
                            description={"Uso/Proposito"}
                            fieldName={"purpose"}
                            placeholder="Para transporte de personal"
                        />

                    </div>


                    <div className="md:flex md:space-x-2">

                        <div className="md:w-[20%]">
                            <FormInput
                                description={"Cap. Personas"}
                                fieldName={"capacity"}
                                placeholder="8"

                            />
                        </div>

                        <div className="">
                            <FormInput

                                description={"Cap. Heridos"}
                                fieldName={"hurt_capacity"}
                                placeholder="4"
                            />

                        </div>


                        <div className="">
                            <FormInput
                                description={"Nro. Puertas"}
                                fieldName={"doors"}
                                placeholder="4"
                            />
                        </div>


                        <div className="">
                            <FormInput
                                description={"Rendimiento"}
                                fieldName={"performance"}
                                placeholder="10 Km/L"

                            />
                        </div>


                    </div>



                    <div className="md:flex md:space-x-2">
                        <FormInput
                            description={"Cap. Carga"}
                            fieldName={"load_capacity"}
                            placeholder="10.000 Kg"

                        />

                        <FormInput
                            description={"Cap. Litros"}
                            fieldName={"water_capacity"}
                            placeholder="10.000 L"

                        />

                        <FormInput
                            description={"Kilometraje Inicial"}
                            fieldName={"init_kilometer"}
                            placeholder="10.0000 KM"

                        />

                    </div>



                    <div className="md:flex md:space-x-2">

                        <AddInput
                            label={"Detalles"}
                            inputName={"details"}
                            useDotLabel={true}
                            placeHolder="Ejem: Tiene una ventana rota"
                            items={details}
                            setItems={setDetails}
                        />

                        <FormInput
                            description={"Condicion de la Unidad"}
                            fieldName={"unit_condition"}
                            placeholder="En Perfecto Estado"
                        />
                    </div>

                </div>

            </div>

            <FormHiddenButton clickNextRef={clickNextRef} clickSubmitRef={clickSubmitRef} />

        </CustomForm>
    )
}