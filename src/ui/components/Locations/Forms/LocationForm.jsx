import { useForm } from "react-hook-form";

import Input from "../../../core/inputs/Input";
import SelectWithSearch from "../../../core/inputs/SelectWithSearch";

import { useContext, useEffect, useState } from "react";
import { StepContext } from "../../Stepper/Stepper";
import FormHiddenButton from "../../../core/buttons/FormHiddenButton";
import axios from "axios";
import { useConfig } from "../../../../logic/Config/ConfigContext";
import logger from "../../../../logic/Logger/logger";


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


const requiredRule = {
    required: {
        value: true,
        message: "El campo es requerido",
    }
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


    const { register, handleSubmit, formState, setValue } = useForm({
        mode: "onChange",
        defaultValues: currentData
    });

    const { errors, isSubmitted } = formState;



    const [estado, setEstado] = useState(states[0]);


    const [estadoErr, setEstadoErr] = useState(false);



    const canLoadMunicipios = LocationRawData.MunicipalitysIsLoad &&
        LocationRawData.MunicipalitysIsLoad && estado && estado != "";



    const [municipios, setMunicipios] = useState(canLoadMunicipios ?
        getMunicipios(estado) : [])

    const [municipio, setMunicipio] = useState("");


    const [municipioErr, setMunicipioErr] = useState(false);


    const canLoadParroquias = canLoadMunicipios && LocationRawData.PerishIsLoad && municipio && municipio != "";

    const [parroquias, setParroquias] = useState(canLoadParroquias ?
        getParroquias(estado, municipio) : []
    )
    const [parroquia, setParroquia] = useState("");

    const [parroquiaErr, setParroquiaErr] = useState(false);



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

            onSubmit={handleSubmit((
                data) => {

                if (estadoErr || municipioErr || parroquiaErr)
                    return;

                const newData = { ...data, "state": estado, "municipality": municipio, "parish": parroquia }

                handleSubmitInternal(newData)
            })}
            className="mx-auto my-4 w-full max-w-[365px] md:max-w-[100%]">

            <div className="space-y-2 md:space-y-0 md:flex md:justify-around md:items-baseline">

                <div className="w-full space-y-4 px-2 max-w-[720px]">



                    <div className="md:flex md:space-x-2">

                        <SelectWithSearch

                            label={"Estado"}
                            useDotLabel={true}
                            options={states}
                            value={estado}
                            onChange={(v) => { setEstado(v) }}
                            openUp={false}
                            onError={(err) => { setEstadoErr(err) }}
                            useStrongErrColor={isSubmitted} />

                        <SelectWithSearch

                            label={"Municipio"}
                            useDotLabel={true}
                            options={municipios}
                            value={municipio}
                            onChange={(v) => { setMunicipio(v) }}
                            openUp={false}
                            onError={(err) => { setMunicipioErr(err) }}
                            useStrongErrColor={isSubmitted} />

                        <SelectWithSearch

                            label={"Parroquia"}
                            useDotLabel={true}
                            options={parroquias}
                            value={parroquia}
                            onChange={(v) => { setParroquia(v) }}
                            openUp={false}
                            onError={(err) => { setParroquiaErr(err) }}
                            useStrongErrColor={isSubmitted} />



                    </div>



                    <div className="md:flex md:space-x-2">





                        <Input label={"Sector"}
                            register={register}
                            // validationRules={requiredRule}

                            useStrongErrColor={isSubmitted}
                            errMessage={errors.sector?.message}

                            inputName={"sector"}
                            useDotLabel={true}
                            placeHolder="Sector..."

                        />

                        <Input label={"Urbanización/Comunidad/Barrio"}
                            register={register}
                            // validationRules={requiredRule}

                            useStrongErrColor={isSubmitted}
                            errMessage={errors.urbanization?.message}

                            inputName={"urbanization"}
                            useDotLabel={true}
                            placeHolder="Urbanización..."

                        />



                    </div>

                    <div className="md:flex md:space-x-2">


                        <Input label={"Autopista/Carretera/Avenida/Calle"}
                            register={register}
                            // validationRules={requiredRule}

                            useStrongErrColor={isSubmitted}
                            errMessage={errors.street?.message}

                            inputName={"street"}
                            useDotLabel={true}
                            placeHolder="Calle..."

                        />

                        <Input label={"Playa/Río/Quebrada"}
                            register={register}
                            // validationRules={requiredRule}

                            useStrongErrColor={isSubmitted}
                            errMessage={errors.beach?.message}

                            inputName={"beach"}
                            useDotLabel={true}
                            placeHolder="Playa/Río/Quebrada"

                        />

                    </div>

                    <Input label={"Dirección"}
                        register={register}
                        // validationRules={requiredRule}

                        useStrongErrColor={isSubmitted}
                        errMessage={errors.address?.message}

                        inputName={"address"}
                        useDotLabel={true}
                        placeHolder="Dirección..."

                    />

                </div>

            </div>

            <FormHiddenButton clickNextRef={clickNextRef} clickSubmitRef={clickSubmitRef} />


        </form>
    )
}