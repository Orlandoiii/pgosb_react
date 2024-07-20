import React, { useEffect } from "react";
import FormInput from "../../../core/inputs/FormInput";


import { useContext, useState } from "react";
import { StepContext } from "../../Stepper/Stepper";
import FormHiddenButton from "../../../core/buttons/FormHiddenButton";
import CustomForm from "../../../core/context/CustomFormContext";
import { UserIntutionalDataSchema } from "../../../../domain/models/user/user";
import FormSelect from "../../../core/inputs/FormSelect";
import FormSelectSearch from "../../../core/inputs/FormSelectSearch";
import axios from "axios";
import { useConfig } from "../../../../logic/Config/ConfigContext";
import logger from "../../../../logic/Logger/logger";
import { EnumToStringArray } from "../../../../utilities/converters/enum_converter";
import { Hierarchys } from "../../../../domain/abstractions/enums/hierarchys";
import { DivisionTypes } from "../../../../domain/abstractions/enums/division_types";
import { ProfessionTypes } from "../../../../domain/abstractions/enums/profession_types";





const instituions = ["Institución 1", "Institución 2", "Institución 3"]


export default function InstitutionInfoForm({ clickSubmitRef, onSubmit }) {


    const { clickNextRef, currentData, Next } = useContext(StepContext);

    const [rolList, setRolsList] = useState([])


    const { config } = useConfig()

    function handleSubmitInternal(data) {



        if (onSubmit)
            onSubmit(data);

        if (Next)
            Next(data);
    }

    const rolNameList = rolList.map(rol => rol.role_name)

    useEffect(() => {



        axios.get(config.back_url + "/api/v1/role/all").then((r) => {
            if (r.status > 199 && r.status < 300) {
                setRolsList(r.data);
                return;
            }
        }).catch(err => {
            logger.error(err);
        })

    }, [])

    return (

        <CustomForm
            initValue={currentData}
            schema={UserIntutionalDataSchema}
            onSubmit={(
                data) => {



                // const newData = {
                //     ...data,
                //     "user_system": isSystemUser,
                //     "profesion": profesion,
                //     "rol": rol,
                //     "division": division,
                // }

                handleSubmitInternal(data)
            }}
            classStyle="mx-auto my-4 w-full max-w-[365px] md:max-w-[100%]">


            {/* <FormTitle title={"Datos Institucionales"} /> */}


            <div className="space-y-2 md:space-y-0 md:flex md:justify-around md:items-baseline">

                <div className="w-full space-y-4 px-2 max-w-[720px]">



                    <div className="md:flex md:space-x-2">

                        <FormInput

                            description={"Código de Funcionario/a"}
                            fieldName={"code"}
                            placeholder="600"

                        />

                        <FormSelectSearch
                            initialValue={currentData?.rol}
                            fieldName={"rol"}
                            description={"Rol"}
                            options={rolNameList}
                            openUp={false} />



                        {/* <FormInput description={"Fecha de Ingreo"}
                            register={register}
                            validationRules={requiredRule}

                            useStrongErrColor={isSubmitted}
                            errMessage={errors.in_date?.message}

                            fieldName={"in_date"}
                            useDotLabel={true}
                            placeholder="01-01-0001"

                        />

                        <FormInput description={"Fecha de Egreso"}
                            register={register}
                            validationRules={requiredRule}

                            useStrongErrColor={isSubmitted}
                            errMessage={errors.out_date?.message}

                            fieldName={"out_date"}
                            useDotLabel={true}
                            placeholder="01-01-0001"

                        /> */}

                    </div>



                    <div className="md:flex md:space-x-2">


                        <FormSelect
                            description={"Jerarquia"}
                            fieldName={"rank"}
                            options={EnumToStringArray(Hierarchys)}
                            openUp={false} />

                        <FormSelect
                            description={"Institución"}
                            fieldName={"institution"}
                            options={instituions}
                            openUp={false} />

                    </div>



                    <div className="md:flex md:space-x-2">

                        <FormSelectSearch
                            description={"División"}
                            fieldName={"division"}
                            options={EnumToStringArray(DivisionTypes)}
                            openUp={true}
                            initialValue={currentData?.division}
                        />

                        <FormSelectSearch
                            description={"Profesión"}
                            fieldName={"profesion"}
                            options={EnumToStringArray(ProfessionTypes)}
                            openUp={true}
                            initialValue={currentData?.profesion}
                        />




                    </div>




                </div>

            </div>

            <FormHiddenButton clickNextRef={clickNextRef} clickSubmitRef={clickSubmitRef} />


        </CustomForm>
    )
}