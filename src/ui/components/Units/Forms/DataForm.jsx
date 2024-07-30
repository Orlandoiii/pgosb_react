import { useContext, useState } from "react";
import { StepContext } from "../../Stepper/Stepper";
import FormInput from "../../../core/inputs/FormInput";
import FormHiddenButton from "../../../core/buttons/FormHiddenButton";
import CustomForm from "../../../core/context/CustomFormContext";
import React from "react";
import { UnitCharacteristicsSchema } from "../../../../domain/models/unit/unit";
import logger from "../../../../logic/Logger/logger";
import AddInput from "../../../core/inputs/AddInput";
import FormSelect from "../../../core/inputs/FormSelect";


const UnitConditions = ["OPERATIVA", "FUERA DE SERVICIO", "DESINCORPORADA"];

export default function DataForm({ clickSubmitRef, onSubmit }) {
    const { clickNextRef, currentData, Next } = useContext(StepContext);




    const detailsIsArray = currentData?.details != null && Array.isArray(currentData?.details)

    const [details, setDetails] = useState(detailsIsArray ? currentData?.details : []);


    const initialData = !currentData ? { unit_condition: UnitConditions[0] } : currentData

    function handleSubmitInternal(data) {

        if (onSubmit)
            onSubmit(data);

        if (Next)
            Next(data);
    }
    return (

        <CustomForm
            schema={UnitCharacteristicsSchema}
            initValue={initialData}

            onSubmit={
                (data) => {
                    logger.info(data);
                    const newData = { ...data, details: details }
                    handleSubmitInternal(newData)
                }}


            classStyle="mx-auto my-4 w-full max-w-[500px] md:max-w-[100%]">


            <div className="space-y-2 md:space-y-0 md:flex md:justify-around md:items-baseline">

                <div className="w-full space-y-3  px-2 max-w-[860px]">

                    <div className="md:flex md:space-x-2">
                        <FormInput
                            description={"Uso/Propósito"}
                            fieldName={"purpose"}
                            placeholder="Para transporte de personal"
                        />

                    </div>


                    <div className="md:flex md:space-x-2">

                        <FormInput
                            description={"Cap. Personas"}
                            fieldName={"capacity"}
                            placeholder="8"
                            mask={Number}

                        />

                        <FormInput

                            description={"Cap. Heridos"}
                            fieldName={"hurt_capacity"}
                            placeholder="4"
                            mask={Number}
                        />



                        <FormInput
                            description={"Nro. Puertas"}
                            fieldName={"doors"}
                            placeholder="4"
                            mask={Number}
                        />


                        <FormInput
                            description={"Rendimiento (Km/L)"}
                            fieldName={"performance"}
                            placeholder="10"
                            mask={Number}
                        />


                    </div>



                    <div className="md:flex md:space-x-2">
                        <FormInput
                            description={"Cap. Carga (Kg)"}
                            fieldName={"load_capacity"}
                            placeholder="10"
                            mask={Number}
                        />

                        <FormInput
                            description={"Cap. Litros (L)"}
                            fieldName={"water_capacity"}
                            placeholder="10"
                            mask={Number}
                        />

                        <FormInput
                            description={"Kilometraje Inicial (Km)"}
                            fieldName={"init_kilometer"}
                            placeholder="0"
                            mask={Number}
                        />

                    </div>




                    <AddInput
                        label={"Detalles"}
                        inputName={"details"}
                        placeHolder="Ejem: Tiene una ventana rota"
                        items={details}
                        setItems={setDetails}
                    />

                    <FormSelect
                        description={"Condición de la Unidad"}
                        fieldName={"unit_condition"}
                        options={UnitConditions}
                        openUp={true}

                    />

                </div>

            </div>

            <FormHiddenButton clickNextRef={clickNextRef} clickSubmitRef={clickSubmitRef} />

        </CustomForm>
    )
}