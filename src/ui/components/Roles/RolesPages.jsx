import { useEffect, useState } from "react"
import TableDataGrid from "../../core/datagrid/TableDataGrid"
import axios from "axios";
import { useConfig } from "../../core/context/ConfigContext";
import logger from "../../../logic/Logger/logger";
import { LoadingModal } from "../../core/modal/LoadingModal";
import { useConfirmationModal } from "../../core/modal/ModalConfirmation";
import AlertController from "../../core/alerts/AlertController";
import LayoutContexProvider from "../../core/context/LayoutContext";
import RegisterRole from "./RegisterRole";
import { ModuleAccess, moduleAccessToBackendFormat, translateAndConvertPermissions } from "./PermissionTable/models/ModuleAccess";
import { DefaultPermissions } from "./PermissionTable/models/DefaultPermissions";
import { useUser } from "../../core/context/UserDataContext";
import { useNavigate } from "react-router-dom";
const alertController = new AlertController();



const defaultModulesList = [
    new ModuleAccess("Servicios", new DefaultPermissions()),
    new ModuleAccess("Usuarios", new DefaultPermissions()),
    new ModuleAccess("Roles", new DefaultPermissions()),
    new ModuleAccess("Unidades", new DefaultPermissions()),
    new ModuleAccess("Estaciones", new DefaultPermissions()),
    new ModuleAccess("Centros Asistenciales", new DefaultPermissions()),
    new ModuleAccess("Ubicaciones", new DefaultPermissions()),
]

function mergePermissionList(actualModules) {
    // Create a set of names from the first list for efficient lookup
    const activeModules = new Set(actualModules.map(item => item.Name));

    // Iterate through the second list
    for (const item of defaultModulesList) {
        // If the name is not found in the first list, add it
        if (!activeModules.has(item.Name)) {
            actualModules.push(item);
        }
    }

    return actualModules; // Return the modified list1
}

export const moduleNameDictonary = {
    "Servicios": "services",
    "Usuarios": "users",
    "Roles": "roles",
    "Unidades": "units",
    "Estaciones": "stations",
    "Centros Asistenciales": "assistential_centers",
    "Ubicaciones": "locations"
}

export const reversedModuleNameDictionary = {
    "services": "Servicios",
    "users": "Usuarios",
    "roles": "Roles",
    "units": "Unidades",
    "stations": "Estaciones",
    "assistential_centers": "Centros Asistenciales",
    "locations": "Ubicaciones",
};

export const propDictonary = {
    "add": "agregar",
    "delete": "borrar",
    "update": "editar",
    "export": "exportar",
    "print": "imprimir"
}

export const reversedPropDictonary = {
    "agregar": "add",
    "borrar": "delete",
    "editar": "update",
    "exportar": "export",
    "imprimir": "print"
}


function RoleCreateActionData(config) {
    return {
        title: "Registro de Rol",
        message: "Esta seguro que desea registrar el rol con los datos antes mostrados ?",
        successMessage: "Rol creado Exitosamente",
        errMessage: "No se pudo crear el rol",
        endpoint: `${config.back_url}/api/v1/role/create`,
        method: "post"
    }
}

function RoleUpdateActionData(config) {
    return {
        title: "Actualizacion de Rol",
        message: "Esta seguro que desea actualizar el rol con los datos antes mostrados ?",
        successMessage: "Rol actualizado Exitosamente",
        errMessage: "No se pudo actualizar el rol",
        endpoint: `${config.back_url}/api/v1/role/update`,
        method: "put"
    }
}




async function deleteRols(rols, config, getAllRols) {
    try {
        // Create an array of promises, one for each Axios request
        const deletePromises = rols.map((rol) => {
            const endpoint = `${config.back_url}/api/v1/role/${rol.id}`;
            return axios.delete(endpoint); // Return the promise from axios.delete
        });

        // Wait for all requests to complete
        const responses = await Promise.all(deletePromises);

        // Handle successful deletions and update the UI (getUsers)
        responses.forEach((response, index) => {
            if (response.status >= 200 && response.status <= 299) {
                logger.info("rol DELETE:", response);
                alertController.notifySuccess(
                    `Rol eliminado exitosamente ${rols[index].id}`
                );
            }
        });


        // You can do additional processing here after all deletions are done
    } catch (err) {
        // Handle any errors that occurred during deletions
        logger.error("rol ACTION ERROR", err);
        alertController.notifyError(`Error Eliminado Rols`); // General error message

    } finally {
        getAllRols();
    }
}





function RolesPageInternal({ }) {

    const { modulesPermissions, userDataIsLoad } = useUser();

    const navigate = useNavigate();

    const [rolData, setRolData] = useState(null);

    const [openAddForm, setOpenAddForm] = useState(false);

    const [formTitle, setFormTilte] = useState("");

    const [buttonTitle, setButtonTitle] = useState(false);


    const [roleId, setRoleId] = useState("");


    const [roleName, setRoleName] = useState("");

    const [roleStatus, setRoleStatus] = useState(false);

    const [statePermission, setStatePermission] = useState(defaultModulesList);


    const [readonlyForm, setReadOnlyForm] = useState(false)


    const [loading, setLoading] = useState(false);


    function openLoadModal() {
        setLoading(true);
    }

    function closeLoadModal() {
        setLoading(false);
    }



    const { showConfirmationModal } = useConfirmationModal();



    // const [singleRolData, setSingleRolData] = useState([])


    const [currentFormAction, setCurrentFormAction] = useState("");



    const { config } = useConfig();



    const permissions = userDataIsLoad &&
        modulesPermissions.hasOwnProperty("roles") ?
        modulesPermissions["roles"] : []

    logger.log("rol Data:", config);


    function getAllRols(token) {
        axios.get(`${config.back_url}/api/v1/role/all`, {
            cancelToken: token
        }).then(response => {

            logger.log("User Response", response)
            if (response.status >= 200 && response.status <= 299) {
                logger.log("User Data:", response.data)
                setRolData(response.data);
            }
        }).catch(err => {
            logger.error(err);
        }).finally(() => {
            closeLoadModal();
        })
    }



    function readSingleRol(role) {


        if (!role)
            return null;



        setFormTilte("Datos de Rol");
        setCurrentFormAction("read");
        setButtonTitle("")

        setReadOnlyForm(true)

        setRoleId(role.id);
        setRoleName(role.role_name)

        let stateRole = true;
        if (role.st_role == "0")
            stateRole = false;

        setRoleStatus(stateRole);

        const permissions = translateAndConvertPermissions(
            role.access_schema, reversedModuleNameDictionary, propDictonary)

        logger.log("PERMISOS -1:", permissions);

        mergePermissionList(permissions);


        logger.log("PERMISOS -2:", permissions);
        setOpenAddForm(true);
        setStatePermission(permissions);

    }

    function resetFormData() {
        // setSingleRolData([]);

        setStatePermission(defaultModulesList)
        setRoleName("")
        setRoleStatus(false)
        setFormTilte("")
        setButtonTitle("")
        setReadOnlyForm(false)
        setOpenAddForm(false);
    }




    useEffect(() => {
        openLoadModal();
        const cancelTokenSource = axios.CancelToken.source();
        getAllRols(cancelTokenSource.token);
        return () => {
            cancelTokenSource.cancel("unmount");
        }

    }, [])






    function submitFunction({ title, message, successMessage, errMessage, endpoint, method, data }) {
        let result = showConfirmationModal(title,
            message);

        result.then(r => {
            if (!r)
                return;

            openLoadModal();
            resetFormData();

            axios({
                url: endpoint,
                data: data,
                method: method
            }).then(r => {
                closeLoadModal()
                logger.info("rol ACTION:", r)
                if (r.status >= 200 && r.status <= 299) {
                    getAllRols()
                    alertController.notifySuccess(successMessage);
                }
            }).catch(err => {
                closeLoadModal();
                logger.error("rol ACTION ERROR", err);
                alertController.notifyError(errMessage);
            }).finally(() => {
                resetFormData();
            })

        })
    }






    function onAdd() {
        setFormTilte("Agregar Rol");
        setButtonTitle("Agregar")
        setCurrentFormAction("add");


        setRoleName("")
        setRoleStatus(false)
        setReadOnlyForm(false)
        setStatePermission(defaultModulesList)


        setOpenAddForm(true);

    }

    function onUpdate(role) {


        if (!role)
            return null;



        setFormTilte("Actualizar Rol");
        setCurrentFormAction("update");
        setButtonTitle("Editar")

        setReadOnlyForm(false)

        setRoleId(role.id);
        setRoleName(role.role_name)

        let stateRole = true;
        if (role.st_role == "0")
            stateRole = false;

        setRoleStatus(stateRole);

        const permissions = translateAndConvertPermissions(
            role.access_schema, reversedModuleNameDictionary, propDictonary)


        mergePermissionList(permissions);

        setOpenAddForm(true);
        setStatePermission(permissions);


    }

    function onDelete(rols) {
        if (!rols)
            return null;


        let title = "Eliminar Rol";
        let message = `Esta seguro que desea eliminar el Rol:${rols[0].id}`

        if (rols.length > 1) {
            title = "Eliminar Rols";
            message = `Esta seguro que desea eliminar un total de Rols:${rols.length}`
        }

        let result = showConfirmationModal(title, message);

        let resolve = {};
        let p = new Promise(r => {
            resolve = r;
        })

        result.then((r) => {


            if (!r) {
                resolve(false);
                return;
            }


            openLoadModal();
            resolve(true)
            deleteRols(rols, config, getAllRols)

        })

        return p;



    }




    function addRole(data) {
        const action = RoleCreateActionData(config);
        action.data = data;
        submitFunction(action);
    }



    function updateRol(data) {
        const action = RoleUpdateActionData(config);
        action.data = data;
        submitFunction(action);
    }



    function onSubmit() {

        const access_schema =
            moduleAccessToBackendFormat(statePermission, moduleNameDictonary, reversedPropDictonary);

        const data = {
            role_name: roleName,
            st_role: roleStatus ? 1 : 0,
            access_schema: access_schema
        }

        if (currentFormAction == "add") {
            addRole(data);
            return;
        }

        if (currentFormAction == "update") {
            data.id = parseInt(roleId);
            updateRol(data);
            return;
        }
    }



    useEffect(() => {

        if (!userDataIsLoad || !modulesPermissions.hasOwnProperty("roles")) {
            alertController.notifyInfo("Usted no tiene permiso para el modulo Roles");
            navigate("/");
        }
    }, [modulesPermissions, userDataIsLoad])



    return (
        <>
            <div className="">
                {rolData && <TableDataGrid rawData={rolData}

                    onUpdate={onUpdate}
                    onAdd={onAdd}
                    onDelete={onDelete}
                    onDoubleClickRow={readSingleRol}
                    permissions={permissions}

                />}

                <RegisterRole
                    title={formTitle}

                    roleName={roleName}
                    setRolName={setRoleName}

                    roleState={roleStatus}
                    setStateRol={setRoleStatus}

                    statePermission={statePermission}
                    setStatePermission={setStatePermission}

                    open={openAddForm}

                    buttonTitle={buttonTitle}
                    readonly={readonlyForm}
                    onClose={() => { resetFormData() }}
                    onSubmit={onSubmit}
                />

            </div>

            <LoadingModal open={loading} />
        </>

    )
}


export default function RolesPage({ }) {


    return (
        <LayoutContexProvider layoutName={"rol_layout"}>
            <RolesPageInternal />
        </LayoutContexProvider>
    )



}