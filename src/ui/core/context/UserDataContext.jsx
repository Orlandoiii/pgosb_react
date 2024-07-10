import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useAuth } from "../../components/Authentication/AuthProvider";
import logger from "../../../logic/Logger/logger";
import { LoadingModal } from "../modal/LoadingModal";
import axios from "axios";
import { useConfig } from "../../../logic/Config/ConfigContext";

const UserDataContext = createContext({
    userData: null,
    userRolData: null,
    userDataIsLoad: false,
    modulesPermissions: null,
    err: null
});


export default function UserDataProvider({ children }) {

    const { state } = useAuth()

    const [userData, setUserData] = useState(null);

    const [userRolData, setUserRolData] = useState(null);

    const [modulesPermissions, setModulePermisions] = useState(null);

    const { config } = useConfig();

    const [userDataIsLoad, setUserDataIsLoad] = useState(false);

    const [loading, setLoading] = useState(false);


    const signalRef = useRef(null);

    const [err, setErr] = useState(null);

    logger.log("Renderizo UserDataProvider:", state, userRolData);

    logger.log("Renderizo UserDataProvider Module:", modulesPermissions);


    async function getUserData(signal) {
        try {

            setLoading(true);


            const response = await axios.get(`${config.back_url}/api/v1/user/${state.userId}`, { signal: signal });

            logger.log("Reponse en UserDataContext", response);

            if (response.status < 200 || response.status > 299) {

                logger.error("no se pudo obtener los datos del usuario");
                setUserDataIsLoad(false);
                setErr("No se pudo obtener datos")
                return;
            }

            const reponseRol = await axios.get(`${config.back_url}/api/v1/role/${response.data.id_role}`, { signal: signal });

            logger.log("Reponse del rol en UserDataContext", reponseRol);


            if (reponseRol.status < 200 || reponseRol.status > 299) {

                logger.error("no se pudo obtener los datos del rol del usuario");
                setUserDataIsLoad(false);
                setErr("No se pudo obtener datos")
                return;
            }


            setModulePermisions(reponseRol.data.access_schema)
            setUserRolData(reponseRol.data);
            setUserData(response.data);
            setUserDataIsLoad(true);
            return;



        } catch (err) {

            logger.error(err);
            if (axios.isCancel(err))
                return;

            setErr(err)
            setUserDataIsLoad(false);
            return;
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {

        if (state.isAuthenticated) {

            signalRef.current = new AbortController();

            getUserData(signalRef.current.signal);


            return () => {
                signalRef.current.abort();
            }
        }


    }, [state.isAuthenticated])

    return (
        <UserDataContext.Provider value={{
            userData: userData,
            userRolData: userRolData,
            modulesPermissions: modulesPermissions,
            err: err,
            userDataIsLoad: userDataIsLoad

        }}>

            {userDataIsLoad && children}
            <LoadingModal open={loading} />
        </UserDataContext.Provider>
    )

}

export function useUser() {
    return useContext(UserDataContext)
}