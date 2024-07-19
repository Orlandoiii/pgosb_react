import React from "react";


import FormInput from "../../../core/inputs/FormInput";

import { useContext, useEffect, useState } from "react";
import { StepContext } from "../../Stepper/Stepper";
import FormHiddenButton from "../../../core/buttons/FormHiddenButton";
import axios from "axios";
import { useConfig } from "../../../../logic/Config/ConfigContext";
import logger from "../../../../logic/Logger/logger";
import FormSelectSearch from "../../../core/inputs/FormSelectSearch";


let LocationRawData = {
    States: [],
    StatesIsLoad: false,

    Municipalitys: [],
    MunicipalitysIsLoad: false,


    Perish: [],
    PerishIsLoad: false,

}

function SetStates(data) {
    LocationRawData.States = data;
    LocationRawData.StatesIsLoad = true;
}

function SetMunicipalitys(data) {
    LocationRawData.Municipalitys = data;
    LocationRawData.MunicipalitysIsLoad = true;
}

function SetPerish(data) {
    LocationRawData.Perish = data;
    LocationRawData.PerishIsLoad = true;
}

function getMunicipios(stateName) {
    if (!stateName || stateName == "" ||
        !LocationRawData.StatesIsLoad || !LocationRawData.MunicipalitysIsLoad)
        return []

    const foundState = LocationRawData.States?.find(item => item.name.toLowerCase() === stateName.toLowerCase());


    if (!foundState || !LocationRawData.MunicipalitysIsLoad)
        return []


    const result = LocationRawData.Municipalitys?.filter(m => m.state_id == foundState.id);

    if (!result || result.length == 0) {
        return ["N/A"]
    }

    return result.map(result => result.name);

}


function getParroquias(estado, municipio) {
    logger.log("Buscando parroquias");

    if (!estado || estado == "" || !municipio || municipio == "")
        return []

    if (!LocationRawData.StatesIsLoad || !LocationRawData.MunicipalitysIsLoad || !LocationRawData.PerishIsLoad)
        return [];

    const foundState = LocationRawData.States?.find(item => item.name.toLowerCase() === estado.toLowerCase());


    logger.log("Buscando parroquias state", foundState);


    if (!foundState)
        return [];

    const foundMunicipio = LocationRawData.Municipalitys?.find(item => item.name.toLowerCase() === municipio.toLowerCase());


    if (!foundMunicipio)
        return [];


    logger.log("Buscando parroquias muni", foundMunicipio);


    const result = LocationRawData.Perish?.filter(m => m.state_id == foundState.id && m.municipality_id == foundMunicipio.id);


    logger.log("Buscando parroquias; Resutl", result);

    if (!result || result.length == 0) {
        return ["N/A"]
    }

    return result.map(result => result.name);



}

async function makeRequest(endpoint, token, setData) {
    axios.get(endpoint, {
        cancelToken: token
    }).then(response => {
        if (response.status >= 200 && response.status <= 299) {
            logger.log("DATA:", response.data)
            setData(response.data);
        }
    }).catch(err => {
        logger.error(err);
    })


}

export default function LocationForm({ clickSubmitRef, onSubmit }) {


    const [states, setStates] = useState(LocationRawData.StatesIsLoad ? LocationRawData.States.map(s => s.name) : ["Miranda"]);

    const { clickNextRef, currentData, Next } = useContext(StepContext);

    const [estado, setEstado] = useState(currentData?.state ? currentData.state : states[0]);


    const canLoadMunicipios = LocationRawData.MunicipalitysIsLoad &&
        LocationRawData.MunicipalitysIsLoad && estado && estado != "";



    const [municipios, setMunicipios] = useState(canLoadMunicipios ?
        getMunicipios(estado) : [])

    const [municipio, setMunicipio] = useState(currentData?.municipality);




    const canLoadParroquias = canLoadMunicipios && LocationRawData.PerishIsLoad && municipio && municipio != "";

    const [parroquias, setParroquias] = useState(canLoadParroquias ?
        getParroquias(estado, municipio) : []
    )
    const [parroquia, setParroquia] = useState(currentData?.parish);




    const { config } = useConfig();


    function handleSubmitInternal(data) {
        if (onSubmit)
            onSubmit(data);

        if (Next)
            Next(data);
    }


    function SetStatesLocally(data) {
        if (!LocationRawData.StatesIsLoad) {
            SetStates(data)
        }
        setStates(LocationRawData.States.map(s => s.name))

    }


    function SetMunicipalityLocally(data) {
        if (!LocationRawData.MunicipalitysIsLoad) {
            SetMunicipalitys(data)
        }

        if (LocationRawData.StatesIsLoad && LocationRawData.MunicipalitysIsLoad)
            setMunicipios(getMunicipios(estado))
    }


    function SetParishLocally(data) {
        if (!LocationRawData.PerishIsLoad) {
            SetPerish(data)
        }

        if (LocationRawData.StatesIsLoad &&
            LocationRawData.MunicipalitysIsLoad && LocationRawData.PerishIsLoad)
            setParroquias(getParroquias(estado, municipio))

    }



    useEffect(() => {

        const cancelTokenSource = axios.CancelToken.source();

        const endpointState = `${config.back_url}` + "/api/v1/location/state/all"

        if (!LocationRawData.StatesIsLoad)
            makeRequest(endpointState, cancelTokenSource.token, SetStatesLocally)


        const endpointMunicipality = `${config.back_url}` + "/api/v1/location/municipality/all"

        if (!LocationRawData.MunicipalitysIsLoad)
            makeRequest(endpointMunicipality, cancelTokenSource.token, SetMunicipalityLocally)


        const endpointParish = `${config.back_url}` + "/api/v1/location/parish/all"

        if (!LocationRawData.PerishIsLoad)
            makeRequest(endpointParish, cancelTokenSource.token, SetParishLocally)


        return () => {
            cancelTokenSource.cancel('unmonted');
        }
    })


    useEffect(() => {
        if (estado == null || estado == "") {
            setMunicipio("");
            setMunicipios([]);
            return;
        }

        let m = getMunicipios(estado);

        setMunicipios(m)
        if (m[0])
            setMunicipio(m[0])
    }, [estado, setMunicipio, setMunicipios])

    useEffect(() => {
        if (municipio == null || municipio == "") {
            setParroquia("");
            setParroquias([])
            return;

        }


        let p = getParroquias(estado, municipio);

        setParroquias(p);
        if (p[0])
            setParroquia(p[0]);


    }, [estado, municipio, setParroquia, setParroquias])


    return (

        <form
            noValidate

            onSubmit={(
                data) => {


                // const newData = { ...data, "state": estado, "municipality": municipio, "parish": parroquia }

                handleSubmitInternal(data)
            }}
            className="mx-auto my-4 w-full max-w-[365px] md:max-w-[100%]">

            <div className="space-y-2 md:space-y-0 md:flex md:justify-around md:items-baseline">

                <div className="w-full space-y-4 px-2 max-w-[720px]">



                    <div className="md:flex md:space-x-2">

                        <FormSelectSearch
                            fieldName={"state"}
                            description={"Estado"}
                            options={states}
                            openUp={false}
                        />
                        <FormSelectSearch

                            fieldName="municipality"
                            description={"Municipio"}
                            options={municipios}
                            openUp={false}
                        />
                        <FormSelectSearch

                            fieldName="parish"
                            description={"Parroquia"}
                            options={parroquias}
                            openUp={false}
                        />

                    </div>



                    <div className="md:flex md:space-x-2">





                        <FormInput
                            description={"Sector"}
                            fieldName={"sector"}
                            placeholder="Sector..."

                        />

                        <FormInput
                            description={"Urbanización/Comunidad/Barrio"}
                            fieldName={"community"}
                            placeholder="Urbanización..."

                        />



                    </div>

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


        </form>
    )
}