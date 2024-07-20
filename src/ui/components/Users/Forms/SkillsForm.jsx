
import { useContext, useState } from "react";
import AddInput from "../../../core/inputs/AddInput";
import FormHiddenButton from "../../../core/buttons/FormHiddenButton";
import { StepContext } from "../../Stepper/Stepper";
import CustomForm from "../../../core/context/CustomFormContext";
import { CharacteristicsSchema } from "../../../../domain/models/user/user";
import FormInput from "../../../core/inputs/FormInput";
import FormSelect from "../../../core/inputs/FormSelect";
import logger from "../../../../logic/Logger/logger";


const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const shirtSizes = ["XS", "S", "M", "L", "XL", "XXL"];


export default function SkillForm({ clickSubmitRef, onSubmit }) {

    const { clickNextRef, currentData, Next } = useContext(StepContext);

    const [skills, setSkills] = useState(currentData?.skills ?? []);

    const [allergies, setAllergies] = useState(currentData?.allergies ?? []);


    function handleSubmitInternal(data) {


        if (onSubmit)
            onSubmit(data);

        if (Next)
            Next(data);
    }

    const initialData = currentData ? currentData : {
        blood_type: "A+",
        shirt_size: "M",
        pant_size: "M",
    }

    

    return (

        <CustomForm
            initValue={initialData}
            schema={CharacteristicsSchema}
            onSubmit={(data) => {

                const newData = {
                    ...data, "skills": skills, "allergies": allergies,
                }

                handleSubmitInternal(newData)
            }}
            classStyle="mx-auto my-4 w-full max-w-[380px] md:max-w-[100%] bg-transparent">

            <div className="space-y-2 md:space-y-0 md:flex md:justify-around md:items-baseline">

                <div className="w-full space-y-4 px-2 max-w-[720px]">

                    <AddInput

                        label={"Habilidades"}
                        inputName={"skills"}
                        placeHolder="Habilidad Ejem: Paramédico"
                        mask={Number}
                        items={skills}
                        setItems={setSkills}
                    />



                    <div className="md:flex md:items-baseline md:space-x-4">



                        <AddInput

                            label={"Alergias"}
                            inputName={"allergies"}
                            placeHolder="Alergia Ejem: Nuez"

                            items={allergies}
                            setItems={setAllergies}
                        />





                    </div>



                    <div className="md:flex md:space-x-2 md:justify-between">

                        <div className="w-[50%] space-y-2">

                            <h2>Datos físicos</h2>


                            <div className="flex space-x-2 ">
                                <div className="md:w-[30%]">
                                    <FormInput
                                        description={"Altura"}
                                        fieldName={"height"}
                                        placeholder="1.70"
                                    />
                                </div>

                                <div className="md:w-[30%]">
                                    <FormInput
                                        description={"Peso"}
                                        fieldName={"weight"}
                                        placeholder="70"

                                    />
                                </div>


                                <div className="md:w-[40%]">
                                    <FormSelect
                                        description={"Tipo de Sangre"}
                                        fieldName={"blood_type"}
                                        options={bloodTypes}
                                        openUp={true} />
                                </div>
                            </div>



                        </div>


                        <div className="w-[50%] space-y-2">

                            <h2>Tallas</h2>

                            <div className="flex space-x-2">



                                <div className=" md:w-[33%]">
                                    <FormSelect
                                        fieldName={"shirt_size"}
                                        description={"Camisa"}
                                        options={shirtSizes}

                                        openUp={true}

                                    />
                                </div>


                                <div className=" md:w-[33%]">
                                    <FormSelect
                                        description={"Pantalón"}
                                        fieldName={"pant_size"}
                                        options={shirtSizes}
                                        openUp={true}
                                    />
                                </div>



                                <div className="md:w-[33%]">
                                    <FormInput
                                        description={"Zapatos"}
                                        fieldName={"shoe_size"}
                                        placeholder="37"

                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <FormHiddenButton clickNextRef={clickNextRef} clickSubmitRef={clickSubmitRef} />

        </CustomForm>
    )
}