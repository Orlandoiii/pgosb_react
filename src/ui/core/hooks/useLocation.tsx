import logger from "../../../logic/Logger/logger";


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

    States: Array<State>;
    StateIsLoad: boolean;


    Municipalitys: Array<Municipality>;
    MunicipalitysIsLoad: boolean;


    Parish: Array<Parish>;
    ParishIsLoad: boolean;

    constructor() {
        this.States = new Array();
        this.StateIsLoad = false;

        this.Municipalitys = new Array();
        this.MunicipalitysIsLoad = false;


        this.Parish = new Array();
        this.ParishIsLoad = false;
    }

}


let LocationRawData = new LocationRawDataClass();

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
