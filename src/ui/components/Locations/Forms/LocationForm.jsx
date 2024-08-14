import React from "react";


import FormInput from "../../../core/inputs/FormInput";

import { useContext } from "react";
import { StepContext } from "../../Stepper/Stepper";
import FormHiddenButton from "../../../core/buttons/FormHiddenButton";

import CustomForm from "../../../core/context/CustomFormContext";
import logger from "../../../../logic/Logger/logger";
import { useLocation } from "../../../core/hooks/useLocation";
import SelectSearch from "../../../core/inputs/SelectSearch";
import { LocationSchema } from "../../../../domain/models/location/location";




export default function LocationForm({ clickSubmitRef, onSubmit }) {




    const { clickNextRef, currentData, Next } = useContext(StepContext);

    function handleSubmitInternal(data) {
        if (onSubmit)
            onSubmit(data);

        if (Next)
            Next(data);
    }


    const initialData = currentData;


    logger.log("CURRENT DATA:", initialData);


    const { states, state, municipalitys, municipality,
        parishs, parish, sectores, sector, setState, setMunicipality, setParish, setSector,
        estadoId, municipioId, parroquiaId, sectorId } = useLocation(currentData?.state,
            currentData?.municipality,
            currentData?.parish,
            currentData?.sector
        );




    return (

        <CustomForm

            initValue={initialData}

            schema={LocationSchema}
            onSubmit={(
                data) => {

                logger.log("LocationForm", data)

                const newData = {
                    ...data, "state": state,
                    "municipality": municipality, "parish": parish,
                    "state_id": estadoId, "municipality_id": municipioId, "parish_id": parroquiaId
                }

                handleSubmitInternal(newData)
            }}
            classStyle="mx-auto my-4 w-full max-w-[365px] md:max-w-[100%]">

            <div className="space-y-2 md:space-y-0 md:flex md:justify-around md:items-baseline">

                <div className="w-full space-y-4 px-2 max-w-[860px]">



                    <div className="md:flex md:space-x-2">

                        <SelectSearch
                            inputName={"state"}
                            label={"Estado"}
                            searhValue={state}
                            setSearhValue={setState}
                            //value={state}
                            options={states}
                            openUp={false}

                        />
                        <SelectSearch

                            inputName="municipality"
                            label={"Municipio"}
                            options={municipalitys}

                            searhValue={municipality}
                            setSearhValue={setMunicipality}

                            openUp={false}




                        />
                        <SelectSearch

                            inputName="parish"
                            label={"Parroquia"}
                            options={parishs}
                            searhValue={parish}
                            setSearhValue={setParish}
                            openUp={false}



                        />

                    </div>


                    {/* <FormInput
                        description={"Sector"}
                        fieldName={"sector"}
                        placeholder="Sector..."


                    /> */}

                    <SelectSearch

                        inputName="sector"
                        label={"Sector"}
                        options={sectores}
                        searhValue={sector}
                        setSearhValue={setSector}
                        openUp={false}



                    />

                    <FormInput
                        description={"Urbanización/Comunidad/Barrio"}
                        fieldName={"community"}
                        placeholder="Urbanización..."

                    />

                    <div className="md:flex md:space-x-2">


                        <FormInput
                            description={"Autopista/Carretera/Avenida/Calle"}
                            fieldName={"street"}
                            placeholder="Calle..."

                        />

                        <FormInput
                            description={"Playa/Río/Quebrada"}
                            fieldName={"beach"}
                            placeholder="Playa/Río/Quebrada"

                        />

                    </div>

                    <FormInput
                        description={"Dirección"}
                        fieldName={"address"}
                        placeholder="Dirección..."

                    />

                </div>

            </div>

            <FormHiddenButton clickNextRef={clickNextRef} clickSubmitRef={clickSubmitRef} />


        </CustomForm>
    )
}