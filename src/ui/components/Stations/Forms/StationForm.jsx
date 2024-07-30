import { useContext, useState } from "react";
import { StepContext } from "../../Stepper/Stepper";
import FormInput from "../../../core/inputs/FormInput";
import FormHiddenButton from "../../../core/buttons/FormHiddenButton";
import CustomForm from "../../../core/context/CustomFormContext";
import FormSelectSearch from "../../../core/inputs/FormSelectSearch";
import React from "react";
import { StationSchemaBasicData } from "../../../../domain/models/stations/station";
import logger from "../../../../logic/Logger/logger";
import AddInput from "../../../core/inputs/AddInput";





export default function StationForm({ clickSubmitRef, onSubmit }) {
    const { clickNextRef, currentData, Next } = useContext(StepContext);

    const [regions, setRegions] = useState(currentData?.regions ?? []);

    const [phones, setPhones] = useState(currentData?.phones ?? []);

    function handleSubmitInternal(data) {

        if (onSubmit)
            onSubmit(data);

        if (Next)
            Next(data);
    }

    const initialData = currentData ? currentData : {
        institution: "",
        name: "",
        description: "",
        phones: phones,
        regions: regions,
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

                    const newData = { ...data, regions: regions, phones: phones }

                    handleSubmitInternal(newData)
                }}

            classStyle="mx-auto my-4 w-full max-w-[500px] md:max-w-[100%]">


            <div className="space-y-2 md:space-y-0 md:flex md:justify-around md:items-baseline">

                <div className="w-full space-y-3  px-2 max-w-[860px]">

                    <FormInput
                        fieldName="institution"
                        description={"Institución"}
                        placeholder="Nombre de la Institución..."

                    />

                    <FormInput
                        description={"Nombre de la Estación"}
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


                        <div className="md:w-[30%]">
                            <FormInput
                                description={"Código"}
                                fieldName={"code"}
                                placeholder="01"

                            />
                        </div>

                        <div className="md:w-[30%]">

                            <FormInput
                                description={"Siglas"}
                                fieldName={"abbreviation"}
                                placeholder="M01"

                            />
                        </div>

                        <AddInput

                            label={"Regiones"}
                            inputName={"regions"}
                            placeHolder="Región Operativa Ejem:01M"

                            items={regions}
                            setItems={setRegions}
                        />

                    </div>





                </div>

            </div>

            <FormHiddenButton clickNextRef={clickNextRef} clickSubmitRef={clickSubmitRef} />

        </CustomForm>
    )
}