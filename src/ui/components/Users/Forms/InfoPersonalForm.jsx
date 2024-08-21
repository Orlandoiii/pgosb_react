import React from "react";

import FormInput from "../../../core/inputs/FormInput";
import FormSelect from "../../../core/inputs/FormSelect";
import { useContext } from "react";
import { StepContext } from "../../Stepper/Stepper";
import FormHiddenButton from "../../../core/buttons/FormHiddenButton";
import logger from "../../../../logic/Logger/logger";
import CustomForm from "../../../core/context/CustomFormContext";
import { UserSchemaBasicData } from "../../../../domain/models/user/user";
import { dateMask, documentIdMask, nameMask, numberMask, numberMaskAllowZero } from "../../../core/inputs/Common/Mask";
import { MartialStatusListTypes, MartialStatusTypes } from "../../../../domain/abstractions/enums/martial_status_type";
import { Genders } from "../../../../domain/abstractions/enums/genders";
import { EnumToStringArray } from "../../../../utilities/converters/enum_converter";


// const civilStatusList = ["Solter@", "Casad@", "Divorciad@", "Viud@"]


export default function InfoPersonalForm({ clickSubmitRef, onSubmit }) {

    const { clickNextRef, currentData, Next } = useContext(StepContext);

    function handleSubmitInternal(data) {

        if (onSubmit)
            onSubmit(data);

        if (Next)
            Next(data);
    }



    const initialData = !currentData ? {
        "marital_status": MartialStatusTypes.Single,
        "gender": Genders.Male,

    } : { ...currentData }


    return (

        <CustomForm

            schema={UserSchemaBasicData}
            initValue={initialData}
            onSubmit={
                (data) => {
                    logger.log("Aqui en User Info Form", data);
                    handleSubmitInternal(data)
                }}

            classStyle="mx-auto my-4 w-full">


            <div className="space-y-2 md:space-y-0 md:flex md:justify-around md:items-baseline">

                <div className="w-full  px-2 max-w-[860px]">


                    <div className="md:flex md:space-x-2 mt-4 mb-4">


                        <FormInput
                            description={"Nombre"}
                            fieldName={"first_name"}
                            placeholder="Jon"
                            mask={nameMask}
                        />

                        <FormInput
                            description={"Apellido"}
                            fieldName={"last_name"}
                            placeholder="Doe"
                            mask={nameMask}
                        />

                    </div>


                    <FormInput
                        description={"Email"}
                        fieldName={"email"}
                        placeholder="jondoe@example.com" 
                        useUppercase={false}
                        />





                    <div className="md:flex md:space-x-2 mt-4">


                        <FormInput
                            description={"Cedula"}
                            fieldName={"legal_id"}
                            placeholder="V0000000"
                            mask={documentIdMask}
                        />

                        <FormInput
                            description={"Teléfono"}
                            fieldName={"phone"}
                            placeholder="02129998877"
                            mask={numberMask}
                        />


                    </div>


                    <div className="md:flex md:space-x-2 mt-4">


                        <div className="w-[50%] flex space-x-2">
                            {/* <div className="md:w-[35%]">
                                <FormInput
                                    description={"Cod. Área"}
                                    fieldName={"zip_code"}
                                    placeholder="0244"
                                    mask={numberMaskAllowZero}
                                />

                            </div> */}

                            <FormSelect
                                fieldName={"marital_status"}
                                description={"Estado Civil"}
                                options={EnumToStringArray(MartialStatusTypes)}
                                openUp={true} />
                        </div>

                        <div className="w-[50%] flex space-x-2">
                            <div className="w-[60%]">
                                <FormInput
                                    description={"Fe. Nacimiento"}
                                    fieldName={"birth_date"}
                                    placeholder="dd-mm-aaaa"
                                    mask={dateMask}
                                />
                            </div>

                            <div className="md:w-[50%]">
                                <FormSelect
                                    fieldName={"gender"}
                                    description={"Género"}
                                    options={EnumToStringArray(Genders)}
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