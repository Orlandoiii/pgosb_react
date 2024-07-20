import React, { createContext, useContext, useReducer, useState } from 'react';
import { useEffect } from 'react';
import { LoadingModal, useLoadModal } from '../../ui/core/modal/LoadingModal';
import logger from '../Logger/logger';
import axios from 'axios';


export async function Wait(miliseconds = 1000) {

    let resolve = {};

    let p = new Promise(r => {
        resolve = r;
    })

    setTimeout(() => {
        resolve(true);
    }, miliseconds);

    return p;
}

export async function LoadConfigFile() {
    try {

        logger.info("Iniciando Carga de Config File");

        const host = window.location.origin;

        logger.info("Config host/origin:", host);

        const configRequest = await fetch(`${host}/config.json`);

        logger.info("Config Request:", configRequest);

        let configJson = await configRequest.json();

        logger.info("Config JSON::", configJson);

        configJson.host = host;

        return { config: configJson, success: true };


    } catch (err) {
        logger.error("Error Cargadon ConfigFile", err);

        return { err: err, success: false };
    }
}

async function LoadLayout(endpoint) {
    let retryCounter = 0;

    let errList = [];

    while (retryCounter < 5) {

        logger.info(`Haciendo Request para cargar layout intento:${retryCounter} ${endpoint}`)

        try {

            const layoutRequest = await axios.get(endpoint)

            logger.info("UserRequest:", layoutRequest);


            if (layoutRequest.status < 200 || layoutRequest.status > 299) {
                logger.error("El resultado del request para buscar layout no fue exitoso");

                throw new Error("El resultado del request para buscar layout no fue exitoso")
            }


            const layout = await layoutRequest.data;

            return { layout: layout, success: true };

        } catch (err) {

            logger.error(err);

            errList.push(err);

        }
        retryCounter++;

        await Wait(retryCounter * 2000);
    }

    return { errList: errList, err: "El numero de reintento se agoto, para la busqueda del layout", success: false };
}

const endpoints = [
    { endpoint: "/api/v1/layout/user", layout: "user_layout" },
    { endpoint: "/api/v1/layout/unit", layout: "unit_layout" },
    { endpoint: "/api/v1/layout/stations", layout: "station_layout" },
    { endpoint: "/api/v1/layout/roles", layout: "rol_layout" }
]

async function LoadAllLayout(config) {

    const back_url = config.back_url;



    const results = endpoints.map(async (e, _) => {

        const endpoint = `${back_url}${e.endpoint}`;

        const result = await LoadLayout(endpoint);

        if (!result.success) {

            return result;
        }

        config[e.layout] = result.layout;

        return { success: true };

    })

    const layouts = await Promise.all(results);

    layouts.forEach((v) => {
        if (!v.success)
            return v;
    })

    return { success: true };


}



async function LoadConfig() {

    try {

        const configFileResult = await LoadConfigFile();

        if (!configFileResult.success) {

            return configFileResult;
        }

        let config = configFileResult.config;

        const layouts_result = await LoadAllLayout(config);

        if (!layouts_result.success) {
            return layouts_result;
        }

        logger.log("Config Final", config)

        return { config: config, success: true }

    } catch (err) {

        logger.error(err);

        return { err: err, success: false }
    }
}

const configInitialState = {
    config: {},
    isLoading: true,
    error: null,
    reload: false
}

const ConfigContext = createContext();


function reducer(state, action) {

    switch (action.type) {


        case "config/update":
            return { ...state, config: action.config, isLoading: false }

        case "config/error":
            return { ...state, error: action.err, isLoading: false }

        case "config/reload":
            {
                return { ...state, reload: true }
            }
        case "config/loading":
            {
                return { ...state, isLoading: !state.isLoading }
            }


        default:
            return state
    }
}


export default function ConfigContextProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, configInitialState);



    useEffect(() => {
        const fetchConfig = async () => {
            logger.log("LOAD MODAL OPEN")
            // setOpenLoadModal(true);
            let c = await LoadConfig()

            // setOpenLoadModal(false);
            logger.log("LOAD MODAL CLOSE")
            if (c.success) {
                dispatch({ type: "config/update", config: c.config });
            } else {
                dispatch({ type: "config/error", err: c.err });
            }


        };
        fetchConfig();
    }, [])


    useEffect(() => {
        if (state.reload) {
            dispatch({ type: "config/loading" })
            setTimeout(() => {
                dispatch({ type: "config/loading" })
            }, 50)
        }
    }, [state.reload])

    return (
        <ConfigContext.Provider value={{ config: state.config, dispatch }}>

            {!state.isLoading && children}
            <LoadingModal open={state.isLoading} />
        </ConfigContext.Provider>
    )
}


export function useConfig() {
    const context = useContext(ConfigContext);
    return context;
}









