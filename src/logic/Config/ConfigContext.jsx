import React, { createContext, useContext, useReducer } from 'react';
import { useEffect } from 'react';
import { useLoadModal } from '../../ui/core/modal/LoadingModal';
import logger from '../Logger/logger';


async function LoadConfig() {

    const host = window.location.origin;

    logger.log(window.location.origin);

    let configRequest = await fetch(`${host}/config.json`);

    let configJson = await configRequest.json();

    let config = configJson;

    config.host = host;

    let userConfigLayoutRequest = await fetch(`${config.back_url}/api/v1/layout/user`)

    let userConfig = await userConfigLayoutRequest.json();

    config.user_layout = userConfig;

    logger.log("Config:", config)

    return config

}



const configInitialState = {
    config: {},
    isLoading: true,
}


const ConfigContext = createContext();


function reducer(state, action) {

    switch (action.type) {


        case "config/update":
            return { ...state, config: action.config, isLoading: false }


        default:
            return state
    }
}


export default function ConfigContextProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, configInitialState);
    const { openLoadModal, closeLoadModal } = useLoadModal();
    useEffect(() => {
        openLoadModal();
        const fetchConfig = async () => {
            let c = await LoadConfig()
            dispatch({ type: "config/update", config: c });
        };

        fetchConfig().then(r => {
            closeLoadModal();
        });
    }, [dispatch])

    return (
        <ConfigContext.Provider value={{ config: state.config, dispatch }}>
            {!state.isLoading && children}
        </ConfigContext.Provider>
    )
}


export function useConfig() {
    const context = useContext(ConfigContext);
    return context;
}









