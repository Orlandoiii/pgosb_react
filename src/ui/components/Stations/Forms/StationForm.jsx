import { useContext, useState } from "react";
import { StepContext } from "../../Stepper/Stepper";
import FormInput from "../../../core/inputs/FormInput";
import FormHiddenButton from "../../../core/buttons/FormHiddenButton";
import CustomForm from "../../../core/context/CustomFormContext";
import FormSelectSearch from "../../../core/inputs/FormSelectSearch";
import React from "react";
import AddInput from "../../../core/inputs/AddInput";
import { StationSchemaBasicData } from "../../../../domain/models/stations/station"; 
import logger from "../../../../logic/Logger/logger";



const institutions = ["Institución Nombre Largo Para Probar Como se Ve", "Plataforma de Gestion de Operaciones y Servicios Para Bomberos"]



export default function StationForm({ clickSubmitRef, onSubmit }) {
    const { clickNextRef, currentData, Next } = useContext(StepContext);

    const [regions, setRegions] = useState([]);

    const [phones, setPhones] = useState([]);

    function handleSubmitInternal(data) {

        if (onSubmit)
            onSubmit(data);

        if (Next)
            Next(data);
    }
    return (

        <CustomForm

        schema={StationSchemaBasicData}
        initValue={currentData}
        onSubmit={
            (data) => {
                logger.info(data);
                handleSubmitInternal(data)
            }}

            classStyle="mx-auto my-4 w-full max-w-[500px] md:max-w-[100%]">

            {/* <FormTitle title={"Datos básicos del Vehículo"} /> */}

            <div className="space-y-2 md:space-y-0 md:flex md:justify-around md:items-baseline">

                <div className="w-full space-y-4 px-2 max-w-[720px]">

                    <FormSelectSearch
                        fieldName="institution"
                        description={"Institución"}
                        options={institutions}

                        openUp={false}
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
                                useDotLabel={true}
                                placeHolder="0212-9855489"
                                //useStrongErrColor={isSubmitted}
                                items={phones}
                                setItems={setPhones}
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
                            useDotLabel={true}
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