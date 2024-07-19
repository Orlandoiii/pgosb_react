import React from "react";

import FormInput from "../../../core/inputs/FormInput";
import FormSelect from "../../../core/inputs/FormSelect";
import { useContext } from "react";
import { StepContext } from "../../Stepper/Stepper";
import FormHiddenButton from "../../../core/buttons/FormHiddenButton";
import logger from "../../../../logic/Logger/logger";
import CustomForm from "../../../core/context/CustomFormContext";
import { UserSchemaBasicData } from "../../../../domain/models/user/user";

const genders = ["Masculino", "Femenino"];

const civilStatusList = ["Solter@", "Casad@", "Divorciad@", "Viud@"]


export default function InfoPersonalForm({ clickSubmitRef, onSubmit }) {

    const { clickNextRef, currentData, Next } = useContext(StepContext);

    function handleSubmitInternal(data) {

        if (onSubmit)
            onSubmit(data);

        if (Next)
            Next(data);
    }

    return (

        <CustomForm

            schema={UserSchemaBasicData}
            initValue={currentData}
            onSubmit={
                (data) => {
                    logger.log("Aqui en User Info Form", data);
                    handleSubmitInternal(data)
                }}

            classStyle="mx-auto my-4 w-full max-w-[500px] md:max-w-[100%]">


            <div className="space-y-2 md:space-y-0 md:flex md:justify-around md:items-baseline">

                <div className="w-full space-y-4 px-2 max-w-[720px]">

                    <div className="md:flex md:space-x-2">
                        <FormInput
                            description={"Usuario"}
                            fieldName={"user_name"}
                            placeholder="Jondoe"
                        />


                        <FormInput



                            description={"Email"}
                            fieldName={"email"}
                            placeholder="jondoe@example.com" />



                    </div>


                    <div className="md:flex  md:space-x-2">


                        <FormInput
                            description={"Nombre"}
                            fieldName={"first_name"}
                            placeholder="Jon" />

                        <FormInput
                            description={"Apellido"}
                            fieldName={"last_name"}
                            placeholder="Doe" />





                    </div>

                    <div className="md:flex md:space-x-2">


                        <FormInput
                            description={"Cedula"}
                            fieldName={"legal_id"}
                            placeholder="V2190681" />

                        <FormInput
                            description={"Teléfono"}
                            fieldName={"phone"}

                            placeholder="02129998877" />


                    </div>


                    <div className="md:flex md:space-x-2">


                        <div className="w-[50%] flex space-x-2">
                            <div className="md:w-[35%]">
                                <FormInput
                                    description={"Cod. Área"}
                                    fieldName={"zip_code"}
                                    placeholder="0244" />

                            </div>

                            <div className="w-[65%]">
                                <FormSelect
                                    fieldName={"marital_status"}
                                    description={"Estado Civil"}
                                    options={civilStatusList}
                                    openUp={true} />
                            </div>
                        </div>

                        <div className="w-[50%] flex space-x-2">
                            <div className="w-[60%]">
                                <FormInput
                                    description={"Fe. Nacimiento"}
                                    fieldName={"birth_date"}
                                    placeholder="01-01-0001" />
                            </div>

                            <div className="md:w-[50%]">
                                <FormSelect
                                    fieldName={"gender"}
                                    description={"Género"}
                                    options={genders}
                                    openUp={true} />
                            </div>
                        </div>



                    </div>
                </div>

            </div>

            <FormHiddenButton clickNextRef={clickNextRef} clickSubmitRef={clickSubmitRef} />

        </CustomForm>
    )
}