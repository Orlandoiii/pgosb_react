import axios from "axios";
import logger from "../../../logic/Logger/logger";
import { useEffect, useState } from "react";
import { useConfig } from "../context/ConfigContext";


class State {
    id?: number | undefined;
    name?: string | undefined;
}

class Municipality {
    id?: number | undefined;
    state_id?: number | undefined;
    name?: string | undefined;
}

class Parish {
    id?: number | undefined;
    state_id?: number | undefined;
    municipality_id?: number | undefined;
    name?: string | undefined;
}

class LocationRawDataClass {

    States: Array<State> | undefined;
    StatesIsLoad: boolean;


    Municipalitys: Array<Municipality> | undefined;
    MunicipalitysIsLoad: boolean;


    Parish: Array<Parish> | undefined;
    ParishIsLoad: boolean;

    constructor() {
        this.States = new Array();
        this.StatesIsLoad = false;

        this.Municipalitys = new Array();
        this.MunicipalitysIsLoad = false;


        this.Parish = new Array();
        this.ParishIsLoad = false;
    }

}


let LocationRawData = new LocationRawDataClass();

function SetStates(data: State[] | undefined) {
    LocationRawData.States = data;
    LocationRawData.StatesIsLoad = true;
}

function SetMunicipalitys(data: Municipality[] | undefined) {
    LocationRawData.Municipalitys = data;
    LocationRawData.MunicipalitysIsLoad = true;
}

function SetPerish(data: Parish[] | undefined) {
    LocationRawData.Parish = data;
    LocationRawData.ParishIsLoad = true;
}

function getMunicipios(stateName) {
    if (!stateName || stateName == "" ||
        !LocationRawData.StatesIsLoad || !LocationRawData.MunicipalitysIsLoad)
        return []

    const foundState = LocationRawData.States?.find(item => item?.name?.toLowerCase() === stateName.toLowerCase());


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

    if (!LocationRawData.StatesIsLoad || !LocationRawData.MunicipalitysIsLoad || !LocationRawData?.ParishIsLoad)
        return [];

    const foundState = LocationRawData.States?.find(item => item?.name?.toLowerCase() === estado.toLowerCase());


    logger.log("Buscando parroquias state", foundState);


    if (!foundState)
        return [];

    const foundMunicipio = LocationRawData.Municipalitys?.find(item => item?.name?.toLowerCase() === municipio.toLowerCase());


    if (!foundMunicipio)
        return [];


    logger.log("Buscando parroquias muni", foundMunicipio);


    const result = LocationRawData.Parish?.filter(m => m.state_id == foundState.id && m.municipality_id == foundMunicipio.id);


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



export function useLocation() {
    const [states, setStates] = useState(LocationRawData.StatesIsLoad ? LocationRawData?.States?.map(s => s.name) : ["Miranda"]);


    const [estado, setEstado] = useState("Miranda");


    const canLoadMunicipios = LocationRawData.MunicipalitysIsLoad &&
        LocationRawData.MunicipalitysIsLoad && estado && estado != "";



    const [municipios, setMunicipios] = useState(canLoadMunicipios ?
        getMunicipios(estado) : [])

    const [municipio, setMunicipio] = useState("Chacao");




    const canLoadParroquias = canLoadMunicipios && LocationRawData.ParishIsLoad && municipio && municipio != "";

    const [parroquias, setParroquias] = useState(canLoadParroquias ?
        getParroquias(estado, municipio) : []
    )
    const [parroquia, setParroquia] = useState("Chacao");




    const { config } = useConfig();




    function SetStatesLocally(data) {
        if (!LocationRawData.StatesIsLoad) {
            SetStates(data)
        }
        setStates(LocationRawData?.States?.map(s => s.name))

    }


    function SetMunicipalityLocally(data) {
        if (!LocationRawData.MunicipalitysIsLoad) {
            SetMunicipalitys(data)
        }

        if (LocationRawData.StatesIsLoad && LocationRawData.MunicipalitysIsLoad)
            setMunicipios(getMunicipios(estado))
    }


    function SetParishLocally(data) {
        if (!LocationRawData.ParishIsLoad) {
            SetPerish(data)
        }

        if (LocationRawData.StatesIsLoad &&
            LocationRawData.MunicipalitysIsLoad && LocationRawData.ParishIsLoad)
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

        if (!LocationRawData.ParishIsLoad)
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


    return {
        states,
        state: estado,

        municipalitys: municipios,
        municipality: municipio,

        parishs: parroquias,
        parish: parroquia,

        setState: setEstado,
        setMunicipality: setMunicipio,
        setParish: setParroquia
    }

}
