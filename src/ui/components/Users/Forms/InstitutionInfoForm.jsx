import React, { useEffect, useRef } from "react";
import FormInput from "../../../core/inputs/FormInput";


import { useContext, useState } from "react";
import { StepContext } from "../../Stepper/Stepper";
import FormHiddenButton from "../../../core/buttons/FormHiddenButton";
import CustomForm from "../../../core/context/CustomFormContext";
import { UserIntutionalDataSchema } from "../../../../domain/models/user/user";
import FormSelect from "../../../core/inputs/FormSelect";
import FormSelectSearch from "../../../core/inputs/FormSelectSearch";
import axios from "axios";
import logger from "../../../../logic/Logger/logger";
import { EnumToStringArray } from "../../../../utilities/converters/enum_converter";
import { Hierarchys } from "../../../../domain/abstractions/enums/hierarchys";
import { DivisionTypes } from "../../../../domain/abstractions/enums/division_types";
import { ProfessionTypes } from "../../../../domain/abstractions/enums/profession_types";
import { useConfig } from "../../../core/context/ConfigContext";
import FormToggle from "../../../core/inputs/FormToggle";

import { EquipoMask } from "../../../core/inputs/Common/Mask";
import Toggle from "../../../core/buttons/Toggle";





export default function InstitutionInfoForm({ clickSubmitRef, onSubmit }) {


    const { clickNextRef, currentData, Next } = useContext(StepContext);

    const [rolList, setRolsList] = useState([])

    const [stations, setStations] = useState([])

    const [isActive, setIsActive] = useState(currentData?.status_user === "ACTIVO")

    const { config } = useConfig()

    function handleSubmitInternal(data) {



        if (onSubmit)
            onSubmit(data);

        if (Next)
            Next(data);
    }

    const rolNameList = rolList.map(rol => rol.role_name)

    // let stationField = stations && allStations.length > 0 ? allStations?.find(x => x?.abbreviation == currentData?.abbreviation) : ""

    // const stationFieldRef = useRef(stationField)

    // const [station, setStation] = useState(stationField.abbreviation + " " + stationField.name ?? "")

    const initialData = !currentData ? {


        "status_user": "INACTIVO",
        "user_system": false,
    } : { ...currentData, user_system: Boolean(currentData?.user_system) }

    useEffect(() => {



        axios.get(config.back_url + "/api/v1/role/all").then((r) => {
            if (r.status > 199 && r.status < 300) {
                setRolsList(r.data);
                return;
            }
        }).catch(err => {
            logger.error(err);
        })

        axios.get(config.back_url + "/api/v1/station/all").then((r) => {
            if (r.status > 199 && r.status < 300) {
                setStations(r.data.map(s => s.abbreviation + " " + s.name));
                // allStations.current = r.data;
                return;
            }
        }).catch(err => {
            logger.error(err);
        })

    }, [])

    // useEffect(() => {
    //     stationFieldRef.current = allStations && allStations.current?.length > 0 ? 
    //     allStations?.current?.find(x => x?.abbreviation == currentData?.abbreviation) : "";
    // }, [station, stations])






    return (

        <CustomForm
            initValue={initialData}
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

                data.status_user = isActive ? "ACTIVO" : "INACTIVO"

                handleSubmitInternal(data)
            }}
            classStyle="mx-auto my-4 w-full ">


            {/* <FormTitle title={"Datos Institucionales"} /> */}


            <div className="space-y-2 md:space-y-0 md:flex md:justify-around md:items-baseline">

                <div className="w-full space-y-4 px-2 max-w-[860px]">


                    <div className="md:flex md:space-x-2">
                        <FormInput
                            description={"Usuario"}
                            fieldName={"user_name"}
                            placeholder="Jondoe"
                            useUppercase={false}
                        />

                        <FormInput

                            description={"Equipo"}
                            fieldName={"personal_code"}
                            placeholder="600"
                            mask={EquipoMask}

                        />

                    </div>


                    <div className="md:flex md:space-x-2">


                        <FormSelectSearch
                            initialValue={initialData?.role}
                            fieldName={"role"}
                            description={"Rol"}
                            options={rolNameList}
                            openUp={false} />

                        <FormSelect
                            description={"Jerarquia"}
                            fieldName={"rank"}
                            options={EnumToStringArray(Hierarchys)}
                            openUp={false} />


                    </div>


                    <FormSelectSearch
                        description={"Estación"}
                        fieldName={"station"}
                        options={stations}
                        openUp={false}
                        initialValue={initialData?.station ?? ""}
                    />








                    <div className="md:flex md:space-x-2">

                        <FormSelectSearch
                            description={"División"}
                            fieldName={"division"}
                            options={EnumToStringArray(DivisionTypes)}
                            openUp={true}
                            initialValue={initialData?.division}
                        />

                        <FormSelectSearch
                            description={"Profesión"}
                            fieldName={"profession"}
                            options={EnumToStringArray(ProfessionTypes)}
                            openUp={true}
                            initialValue={initialData?.profession}
                        />

                    </div>

                    <div className="h-full w-full flex justify-start items-center pl-1 space-x-8 mt-8">

                        <div className="flex items-center space-x-2">
                            <p className="text-sm">Usuario Sistema:</p>
                            <FormToggle fieldName="user_system"
                            />

                        </div>

                        <div className="flex items-center space-x-2">
                            <p className="text-sm">Activar Usuario:</p>
                            <Toggle
                                active={isActive}
                                onClick={() => setIsActive(!isActive)}
                            ></Toggle>

                        </div>



                    </div>

                </div>

            </div>

            <FormHiddenButton clickNextRef={clickNextRef} clickSubmitRef={clickSubmitRef} />


        </CustomForm>
    )
}