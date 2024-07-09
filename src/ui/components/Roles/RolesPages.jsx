import { useEffect, useState } from "react"
import TableDataGrid from "../../core/datagrid/TableDataGrid"
import axios from "axios";
import { useConfig } from "../../../logic/Config/ConfigContext";
import logger from "../../../logic/Logger/logger";
import { useLoadModal } from "../../core/modal/LoadingModal";
import { useConfirmationModal } from "../../core/modal/ModalConfirmation";
import AlertController from "../../core/alerts/AlertController";
import LayoutContexProvider from "../../core/context/LayoutContext";
import RegisterRole from "./RegisterRole";
import { ModuleAccess, translateAndConvertPermissions } from "./PermissionTable/models/ModuleAccess";
import { DefaultPermissions } from "./PermissionTable/models/DefaultPermissions";
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

const moduleNameDictonary = {
    "Servicios": "services",
    "Usuarios": "users",
    "Roles": "roles",
    "Unidades": "units",
    "Stations": "stations",
    "Centros Asistenciales": "assistential_centers",
    "Ubicaciones": "locations"
}

const reversedModuleNameDictionary = {
    services: "Servicios",
    users: "Usuarios",
    roles: "Roles",
    units: "Unidades",
    stations: "Estaciones",
    assistential_centers: "Centros Asistenciales",
    locations: "Ubicaciones",
};

const propDictonary = {
    "add": "agregar",
    "delete": "borrar",
    "update": "editar",
    "export": "exportar",
    "print": "imprimir"
}

const reversedPropDictonary = {
    "agregar": "add",
    "borrar": "delete",
    "editar": "update",
    "exportar": "export",
    "imprimir": "print"
}



async function deleteRols(rols, config, getRols) {
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
        getRols();
    }
}





function RolesPageInternal({ }) {


    const [rolData, setRolData] = useState(null);

    const [openAddForm, setOpenAddForm] = useState(false);

    const [formTitle, setFormTilte] = useState("");

    const [buttonTitle, setButtonTitle] = useState(false);


    const [roleId, setRoleId] = useState("");
    const [roleName, setRoleName] = useState("");

    const [roleStatus, setRoleStatus] = useState(false);

    const [statePermission, setStatePermission] = useState(defaultModulesList);


    const [readonlyForm, setReadOnlyForm] = useState(false)




    const { openLoadModal, closeLoadModal } = useLoadModal();

    const { showConfirmationModal } = useConfirmationModal();



    const [singleRolData, setSingleRolData] = useState([])


    const [currentFormAction, setCurrentFormAction] = useState("");



    const { config } = useConfig();

    logger.log("rol Data:", config);


    function getRols(token) {
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


    useEffect(() => {
        openLoadModal();
        const cancelTokenSource = axios.CancelToken.source();
        getRols(cancelTokenSource.token);
        return () => {
            cancelTokenSource.cancel("unmount");
        }

    }, [])


    function resetFormData() {
        setSingleRolData([]);

        setStatePermission(defaultModulesList)
        setRoleName("")
        setRoleStatus(false)
        setFormTilte("")
        setButtonTitle("")
        setReadOnlyForm(false)
        setOpenAddForm(false);
    }

    function handleSubmitAction({ title, message, successMessage, errMessage, endpoint, method }) {
        let result = showConfirmationModal(title,
            message);

        result.then(r => {
            if (!r)
                return;

            openLoadModal();
            resetFormData();

            // const mergedData = singleRolData.reduce((acc, obj) => {
            //     return { ...acc, ...obj.data };
            // }, {});

            axios({
                url: endpoint,
                data: "",
                method: method
            }).then(r => {
                closeLoadModal()
                logger.info("rol ACTION:", r)
                if (r.status >= 200 && r.status <= 299) {
                    getRols()
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

    function handleAddAction() {
        setFormTilte("Agregar Rol");
        setButtonTitle("Agregar")
        setCurrentFormAction("add");


        setRoleName("")
        setRoleStatus(false)
        setReadOnlyForm(false)
        setStatePermission(defaultModulesList)


        setOpenAddForm(true);

    }
    function handleAddSubmition() {
        const action = rolCreateActionData(config);
        handleSubmitAction(action);
    }


    function handleUpdateAction(role) {


        if (!role)
            return null;



        setFormTilte("Actualizar Rol");
        setCurrentFormAction("read");
        setButtonTitle("Editar")

        setReadOnlyForm(false)

        setRoleId(role.id);
        setRoleName(role.role_name)

        let stateRole = true;
        if (role.st_role == "0")
            stateRole = false;

        setRoleStatus(stateRole);

        const permissions = translateAndConvertPermissions(
            JSON.parse(role.access_schema), reversedModuleNameDictionary, propDictonary)

        setOpenAddForm(true);
        setStatePermission(permissions);


    }

    function handleReadAction(role) {


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
            JSON.parse(role.access_schema), reversedModuleNameDictionary, propDictonary)

        setOpenAddForm(true);
        setStatePermission(permissions);

    }


    function handleUpdateSubmition() {
        const action = rolUpdateActionData(config);
        handleSubmitAction(action);
    }



    function handleSubmit() {
        if (currentFormAction == "add") {
            handleAddSubmition();
        }
        if (currentFormAction == "update") {
            handleUpdateSubmition();
        }
    }


    function handleDelete(rols) {
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
            deleterols(rols, config, getRols)

        })

        return p;



    }


    return (
        <>
            <div className="">
                {rolData && <TableDataGrid rawData={rolData}

                    onUpdate={handleUpdateAction}
                    onAdd={handleAddAction}
                    onDelete={handleDelete}
                    onDoubleClickRow={handleReadAction} />}

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
                    onClose={() => { resetFormData() }} />

            </div>

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