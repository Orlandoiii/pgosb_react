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




export default function LocationForm({ clickSubmitRef, onSubmit, addPlaya = true }) {




    const { clickNextRef, currentData, Next } = useContext(StepContext);

    function handleSubmitInternal(data) {
        if (onSubmit)
            onSubmit(data);

        if (Next)
            Next(data);
    }


    const initialData = currentData;


    logger.log("CURRENT DATA:", initialData);


    const {
        states, state,
        municipalitys, municipality,
        parishs, parish,
        sectores, sector,
        urbanizaciones, urbanizacion,
        setState, setMunicipality, setParish, setSector, setUrbanizacion,
        estadoId, municipioId, parroquiaId, sectorId, urbanizationId } = useLocation(currentData?.state,
            currentData?.municipality,
            currentData?.parish,
            currentData?.sector,
            currentData?.urb
        );




    return (

        <CustomForm

            initValue={initialData}

            schema={LocationSchema}
            onSubmit={(
                data) => {

                logger.log("LocationForm", data)

                const newData = {
                    ...data, 

                    "state_id": String(estadoId),
                    "state": state,

                    "municipality_id": String(municipioId),
                    "municipality": municipality,

                    "parish_id": String(parroquiaId),
                    "parish": parish,

                    "sector_id": String(sectorId),
                    "sector": sector,

                    "urb_id": String(urbanizationId),
                    "urb": urbanizacion
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

                    <SelectSearch

                        inputName="urb"
                        label={"Urbanizacion"}
                        options={urbanizaciones}
                        searhValue={urbanizacion}
                        setSearhValue={setUrbanizacion}
                        openUp={false}



                    />

                    {/* <FormInput
                        description={"Urbanización/Comunidad/Barrio"}
                        fieldName={"community"}
                        placeholder="Urbanización..."

                    /> */}

                    <div className="md:flex md:space-x-2">


                        <FormInput
                            description={"Autopista/Carretera/Avenida/Calle"}
                            fieldName={"street"}
                            placeholder="Calle..."

                        />

                        {addPlaya && <FormInput
                            description={"Playa/Río/Quebrada"}
                            fieldName={"beach"}
                            placeholder="Playa/Río/Quebrada"

                        />}



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