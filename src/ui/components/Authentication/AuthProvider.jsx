
import axios from 'axios';
import logger from '../../../logic/Logger/logger';
import { createContext, useContext, useEffect, useReducer, useRef, useState } from 'react';
import { LoadingModal } from '../../core/modal/LoadingModal';
import { useConfig } from '../../core/context/ConfigContext';
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";



// const PGOSB_ACCESS_TOKEN_COOKIE = "PGOSB_ACCESS_TOKEN"
// const PGOSB_REFRESH_TOKEN_COOKIE = "PGOSB_REFRESH_TOKEN"
// const PGOSB_SESSION_STATE_COOKIE = "PGOSB_SESSION_STATE"
const PGOSB_EXPIRES_IN_COOKIE = "PGOSB_EXPIRES_IN"
const PGOSB_USER_ID_COOKIE = "PGOSB_USER_ID_COOKIE"
const PGOSB_EXPIRES_DATE = "PGOSB_EXPIRES_DATE"


const authInitialState = {
    isAuthenticated: false,
    userId: "",
    error: null,
};

function authReducer(state, action) {

    switch (action.type) {

        case 'LOGIN_SUCCESS':
            return { ...state, isAuthenticated: true, userId: action.payload?.userId };

        case 'LOGIN_FAILURE':

        case 'LOGIN_NOT_AUTHENTICATED':
            return { ...state, ...authInitialState, error: action.payload }


        case 'LOGIN_AUTHENTICATED':
            return { ...state, isAuthenticated: true, userId: action.payload?.userId }


        case 'LOGOUT':
            return { ...state, isAuthenticated: false, error: action.payload };

        default:
            return state;
    }
}

// function isTokenExpired(token, expiresIn) {
//     if (!token || !expiresIn) {
//         return true; // Consider missing input as expired
//     }

//     try {
//         const decodedToken = jwtDecode(token);
//         const currentTime = Date.now() / 1000; // Current time in seconds

//         // Calculate expiration time based on 'iat' (issued at) claim and expiresIn
//         const expirationTime = decodedToken.iat + parseInt(expiresIn);


//         const isExpired = expirationTime < currentTime;

//         logger.log("EXPIRED:", isExpired);

//         return isExpired
//     } catch (error) {
//         console.error('Error decoding JWT:', error);
//         return true; // Treat decoding errors as expired for safety
//     }
// }

// function getRemainingTokenExpirationTime(token, expiresIn) {
//     if (!token || !expiresIn) {
//         return 0; // No token or expiration, consider expired
//     }

//     try {
//         const decodedToken = jwtDecode(token);
//         const currentTime = Date.now() / 1000; // Current time in seconds

//         // Calculate expiration time based on 'iat' (issued at) claim and expiresIn
//         const expirationTime = decodedToken.iat + expiresIn;

//         const remainingTime = expirationTime - currentTime;

//         return Math.max(0, remainingTime); // Ensure non-negative result
//     } catch (error) {
//         console.error('Error decoding JWT:', error);
//         return 0; // Treat decoding errors as expired
//     }
// }

function setCookies(response) {
    // Cookies.set(PGOSB_ACCESS_TOKEN_COOKIE, response.data.access_token, {
    //     expires: response.data.expires_in, secure: false
    // })
    // Cookies.set(PGOSB_REFRESH_TOKEN_COOKIE, response.data.refresh_token, {
    //     expires: response.data.expires_in, secure: false
    // })
    // Cookies.set(PGOSB_SESSION_STATE_COOKIE, response.data.session_state, {
    //     expires: response.data.expires_in, secure: false
    // })
    // Cookies.set(PGOSB_EXPIRES_IN_COOKIE, response.data.expires_in, {
    //     expires: response.data.expires_in, secure: false
    // })



    Cookies.set(PGOSB_EXPIRES_DATE, response.data.expire_in_date, {
        expires: response.data.expires_in, secure: false, sameSite: 'Strict', path: ''
    })

    Cookies.set(PGOSB_EXPIRES_IN_COOKIE, response.data.expires_in, {
        expires: response.data.expires_in, secure: false, sameSite: 'Strict', path: ''
    })

    Cookies.set(PGOSB_USER_ID_COOKIE, response.data.user_id, {
        expires: response.data.expires_in, secure: false, sameSite: 'Strict', path: ''
    })


}

function clearCookies() {
    Cookies.set(PGOSB_EXPIRES_IN_COOKIE, "", {
        expires: 0, secure: false
    })
    Cookies.set(PGOSB_USER_ID_COOKIE, "", {
        expires: 0, secure: false
    })
    Cookies.set(PGOSB_EXPIRES_DATE, "", {
        expires: 0, secure: false
    })

}

async function refreshToken(config, signal) {
    try {
        const url = `${config.back_url}/api/v1/auth/login`; // Adjust the URL to match your backend endpoint

        const response = await axios.put(url, { signal }); // Send refresh token request with signal

        if (response.status === 200 && response.data) {
            return response;

        } else if (response.status === 401) {

            throw new Error('Refresh token is invalid or expired');
        } else {

            throw new Error('Unexpected error during refresh token request');
        }
    } catch (error) {

        if (axios.isCancel(error)) {

            const cancellationError = new Error('Refresh token request cancelled');

            cancellationError.code = 'CANCELLED_REQUEST'; // Add custom error code

            throw cancellationError;

        } else if (error.response && (error.response.status === 401 || error.response.status === 403)) {

            throw new Error('Refresh token is invalid or expired');

        } else {

            throw error; // Rethrow the error for further handling
        }
    }
}
async function logIn(data, config, signal, dispatch) {
    try {
        const url = `${config.back_url}/api/v1/auth/login`;

        const response = await axios.post(url, data, { signal });

        if (response.status === 200) { // Assuming 200 is success

            const pgosbId = response.data.user_id

            //setCookies(response);

            dispatch({ type: 'LOGIN_SUCCESS', payload: { userId: pgosbId } });

        } else {
            //clearCookies();

            dispatch({ type: 'LOGIN_FAILURE', payload: "Invalid credentials" });

            throw new Error("no se logro login")
        }
    } catch (err) {
        logger.error(err);

        if (axios.isCancel(err)) {

            return;

        }
        //clearCookies();

        dispatch({ type: 'LOGIN_FAILURE', payload: error.message });

        throw err
    }
};

async function logOut(config, signal, dispatch) {
    let captureErr = null;

    try {
        const url = `${config.back_url}/api/v1/auth/logout`;

        const response = await axios.post(url, null, { signal });

        return response;

    } catch (error) {


        captureErr = error

        return {}
        // Handle logout errors gracefully
    } finally {

        //clearCookies()

        dispatch({ type: "LOGOUT", payload: captureErr })
    }
};



// Context and Hook
const AuthContext = createContext({
    state: authInitialState,
    login: () => Promise.resolve(),
    logout: () => Promise.resolve(),
    refreshSession: () => { Promise.resolve() }
});

export function useAuth() {
    return useContext(AuthContext);
}

// Provider Component
export default function AuthProvider({ children }) {

    axios.defaults.withCredentials = true;

    const [state, dispatch] = useReducer(authReducer, authInitialState);

    const [firstRender, setFirstRender] = useState(true);
    const [loading, setLoading] = useState(false);
    const { config } = useConfig();
    const refreshRef = useRef(null)


    const logInFunction = async (data, signal) => {
        const configCapture = config

        const dispatchCapture = dispatch

        return logIn(data, configCapture, signal, dispatchCapture)
    }

    const logOutFunction = async (signal) => {
        const configCapture = config

        const dispatchCapture = dispatch

        return logOut(configCapture, signal, dispatchCapture)
    }


    useEffect(() => {

        // const userId = Cookies.get(PGOSB_USER_ID_COOKIE);


        // if (!userId || userId == "") {

        //     dispatch({ type: "LOGIN_NOT_AUTHENTICATED", payload: "No tiene id de usuario" })

        //     setFirstRender(false);

        //     return;
        // }

        // // Parse the date string (ISO 8601 format with timezone)
        // const givenDate = new Date(Cookies.get(PGOSB_EXPIRES_DATE));

        // // Get the current date and time
        // const currentDate = new Date();


        // const isExpired = givenDate > currentDate;

        // const timeDifference = givenDate - currentDate;

        // const timeDifferenceInSeconds = timeDifference / 1000;


        const signal = new AbortController();

        setLoading(true);

        refreshToken(config, signal)
            .then((r) => {


                const pgosbId = r.data.user_id

                //setCookies(r);

                dispatch({ type: "LOGIN_AUTHENTICATED", payload: { userId: pgosbId } })

            }).catch(err => {

                if (err.code != "CANCELLED_REQUEST") {

                    //clearCookies()

                    dispatch({ type: "LOGIN_NOT_AUTHENTICATED" })
                }
            }).finally(() => {

                setLoading(false);

                setFirstRender(false);

            });


        return () => {
            signal.abort();

        }


    }, []);

    useEffect(() => {
        if (state.isAuthenticated) {

            const signal = new AbortController();

            refreshRef.current = setInterval(() => {
                logger.info("Is Refreshing");
                refreshToken(config, signal)
                    .then((r) => {
                        logger.info("Refres Success");
                    }).catch(err => {
                        if (err.code != "CANCELLED_REQUEST") {
                            //clearCookies()
                            //No se ha podido recargar el token
                        }
                    });
            }, 180000)

            return () => {

                signal.abort();
                clearInterval(refreshRef.current);
            }
        }

    }, [state.isAuthenticated])


    return (
        <AuthContext.Provider value={{
            state,
            login: logInFunction,
            logout: logOutFunction
        }}>
            {!firstRender && children}
            <LoadingModal open={loading} />
        </AuthContext.Provider>
    )
}


