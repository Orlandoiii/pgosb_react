import React from "react";
import FormInput from "../../../core/inputs/FormInput";


import logger from "../../../../logic/Logger/logger";
import CustomForm from "../../../core/context/CustomFormContext";
import { AuthorityModuleSchema } from "../../../../domain/models/authority_module/authority_module";
import Button from "../../../core/buttons/Button";

export default function AuthorityForm({ onSubmit, currentData }) {




    function handleSubmitInternal(data) {

        if (onSubmit)
            onSubmit(data);

    }

    const initialData = currentData;

    return (

        <CustomForm

            schema={AuthorityModuleSchema}
            initValue={initialData}
            onSubmit={
                (data) => {
                    logger.log("Aqui en Authority Info Form", data);
                    handleSubmitInternal(data)
                }}

            classStyle="mx-auto my-4 w-full">


            <div className="space-y-2 md:space-y-0 md:flex md:justify-around md:items-baseline">

                <div className="w-full  px-2 max-w-[860px]">

                    <FormInput
                        description={"Nombre"}
                        fieldName={"name"}
                        placeholder="Policia Nacional"

                    />
                    <FormInput
                        description={"Siglas"}
                        fieldName={"abbreviation"}
                        placeholder="INTT"


                    />
                    <FormInput
                        description={"Organismo"}
                        fieldName={"government"}
                        placeholder="Ministerio del Interior"
                    />
                </div>

            </div>

            <Button>Aceptar</Button>

        </CustomForm>
    )
}