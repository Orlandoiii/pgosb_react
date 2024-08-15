import { useContext, useState } from "react";
import { StepContext } from "../../Stepper/Stepper";
import FormInput from "../../../core/inputs/FormInput";
import FormHiddenButton from "../../../core/buttons/FormHiddenButton";
import CustomForm from "../../../core/context/CustomFormContext";
import React from "react";
import { StationSchemaBasicData } from "../../../../domain/models/stations/station";
import logger from "../../../../logic/Logger/logger";
import AddInput from "../../../core/inputs/AddInput";





export default function HealthcareCenterForm({ clickSubmitRef, onSubmit }) {
    const { clickNextRef, currentData, Next } = useContext(StepContext);


    const [phones, setPhones] = useState(currentData?.phones ?? []);

    function handleSubmitInternal(data) {

        if (onSubmit)
            onSubmit(data);

        if (Next)
            Next(data);
    }

    const initialData = currentData ? currentData : {
        name: "",
        description: "",
        phones: phones,
        region_id: "",
        code: "",
        abbreviation: ""

    }
    return (

        <CustomForm

            schema={StationSchemaBasicData}
            initValue={initialData}
            onSubmit={
                (data) => {
                    logger.info(data);

                    const newData = { ...data, phones: phones }

                    handleSubmitInternal(newData)
                }}

            classStyle="mx-auto my-4 w-full max-w-[500px] md:max-w-[100%]">


            <div className="space-y-2 md:space-y-0 md:flex md:justify-around md:items-baseline">

                <div className="w-full space-y-3  px-2 max-w-[860px]">

                    {/* <FormInput
                        fieldName="institution"
                        description={"Institución"}
                        placeholder="Nombre de la Institución..."

                    /> */}

                    <FormInput
                        description={"Nombre del Centro Asistencial"}
                        fieldName={"name"}
                        placeholder="Nombre de la Estación..."

                    />


                    <div className="md:flex md:space-x-2">

                        <FormInput
                            description={"Descripción"}
                            fieldName={"description"}
                            placeholder="Descripción...."

                        />


                        <div className="md:w-[37%]">


                            <AddInput

                                label={"Teléfonos"}
                                inputName={"phones"}
                                placeHolder="0212-9855489"
                                //useStrongErrColor={isSubmitted}
                                items={phones}
                                setItems={setPhones}
                                mask={Number}

                            />

                        </div>

                    </div>


                    <div className="md:flex md:space-x-2">


                        <FormInput
                            description={"Código"}
                            fieldName={"id"}
                            placeholder="01"

                        />


                        <FormInput
                            description={"Siglas"}
                            fieldName={"abbreviation"}
                            placeholder="M01"

                        />


                    </div>



                </div>

            </div>

            <FormHiddenButton clickNextRef={clickNextRef} clickSubmitRef={clickSubmitRef} />

        </CustomForm>
    )
}