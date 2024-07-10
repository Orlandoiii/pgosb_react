import { useEffect, useState } from "react"
import TableDataGrid from "../../core/datagrid/TableDataGrid"
import axios from "axios";
import { useConfig } from "../../../logic/Config/ConfigContext";
import logger from "../../../logic/Logger/logger";
import { LoadingModal } from "../../core/modal/LoadingModal";
import { Detail } from "../../core/detail/Detail";
import { useConfirmationModal } from "../../core/modal/ModalConfirmation";
import AlertController from "../../core/alerts/AlertController";
import { RegisterModuleComponent } from "./RegisterModuleComponent";
import { useLayout } from "../../core/context/LayoutContext";
import { useUser } from "../../core/context/UserDataContext";
import { useNavigate } from "react-router-dom";
const alertController = new AlertController();




async function deleteRegisters(registers, deleteConfig, config, getRegisters) {
    try {
        const deletePromises = registers.map((register) => {
            const endpoint = `${config.back_url}${deleteConfig.endpoint}${register.id}`;
            return axios.delete(endpoint);
        });

        const responses = await Promise.all(deletePromises);

        responses.forEach((response, index) => {
            if (response.status >= 200 && response.status <= 299) {
                logger.info("REGISTER DELETE:", response);
                alertController.notifySuccess(
                    `${deleteConfig.successMessage} ${registers[index][deleteConfig.showPropertyName]}`
                );
            }
        });

    } catch (err) {
        logger.error("REGISTER ACTION ERROR", err);
        alertController.notifyError(`${deleteConfig.failMessage}`);

    } finally {
        getRegisters();
    }
}

export default function ModuleComponent({
    moduleName = "",
    getAllDataEndpoint,
    deleteConfig,
    addConfig,
    updateConfig,
    steps,
    detailTitle }) {



    const navigate = useNavigate();

    const { modulesPermissions, userDataIsLoad } = useUser();

    const permissions = userDataIsLoad &&
        modulesPermissions.hasOwnProperty(moduleName) ?
        modulesPermissions[moduleName] : []

    const [openAddForm, setOpenAddForm] = useState(false);

    const [dataIsLoad, setDataIsLoad] = useState(false);


    const [showAccordion, setShowAccordion] = useState(false)

    const [data, setData] = useState(null);

    const [singleRegisterData, setSingleRegisterData] = useState([])

    const [openDetailModal, setOpenDetailModal] = useState(false);

    const [detail, setDetail] = useState(null);

    const [showLoadModal, setShowLoadModal] = useState(false);


    function openLoadModal() {
        logger.info("LOAD MODAL OPEN");
        setShowLoadModal(true);
    }

    function closeLoadModal() {
        logger.info("LOAD MODAL CLOSE");
        setShowLoadModal(false);
    }


    const { showConfirmationModal } = useConfirmationModal();


    // const { showNotification } = useNotificationAlert();

    const { config } = useConfig();


    const [formTitle, setFormTilte] = useState("");

    const [currentFormAction, setCurrentFormAction] = useState("");


    const { layout, groupDefinition, fieldDefinition } = useLayout();


    logger.log("Register Layout Data:", layout, groupDefinition, fieldDefinition);


    function getRegisters(token) {
        axios.get(`${config.back_url}${getAllDataEndpoint}`, {
            cancelToken: token
        }).then(response => {

            logger.log("Register Response", response)
            if (response.status >= 200 && response.status <= 299) {
                logger.log("Register Data:", response.data)
                setData(response.data);
                setDataIsLoad(true);
                closeLoadModal();
                logger.info("LOAD MODAL DATA REGISTER")
            }
        }).catch(err => {
            logger.error(err);

            if (err.message === "unmount")
                return;

            setDataIsLoad(false);
            //showNotification("error", "Oohh!!! ", `${err}`);
        }).finally(() => {

        })
    }



    useEffect(() => {
        openLoadModal();
        const cancelTokenSource = axios.CancelToken.source();
        getRegisters(cancelTokenSource.token);
        return () => {
            cancelTokenSource.cancel("unmount");
        }

    }, [])

    useEffect(() => {

        if (!userDataIsLoad || !modulesPermissions.hasOwnProperty(moduleName)) {
            alertController.notifyInfo(`Usted no tiene permiso para ${moduleName}`);
            navigate("/");
        }
    }, [modulesPermissions, userDataIsLoad])

    function resetFormData() {
        setShowAccordion(false)
        setSingleRegisterData([]);
        setOpenAddForm(false)
    }

    function handleSubmitAction({ title, message, successMessage, errMessage, endpoint, method }) {
        let result = showConfirmationModal(title,
            message);

        result.then(r => {
            if (!r)
                return;

            openLoadModal();
            close();

            let succes = false;


            const mergedData = singleRegisterData.reduce((acc, obj) => {
                return { ...acc, ...obj.data };
            }, {});

            logger.info("REGISTER CREATE/UPDATE Datos enviados:", JSON.stringify(mergedData))


            axios({
                url: endpoint,
                data: mergedData,
                method: method
            }).then(r => {
                closeLoadModal()
                logger.info("REGISTER ACTION:", r)
                if (r.status >= 200 && r.status <= 299) {
                    getRegisters()
                    alertController.notifySuccess(successMessage);
                    succes = true;
                }

            }).catch(err => {
                closeLoadModal();
                logger.error("REGISTER ACTION ERROR", err);
                alertController.notifyError(errMessage);
            }).finally(() => {
                if (succes)
                    resetFormData();
            })

        })
    }

    function handleAddAction() {
        setFormTilte(addConfig.title);
        setCurrentFormAction("add");
        setOpenAddForm(true);

    }
    function handleAddSubmition() {
        const action = addConfig.AddActionData(config);
        handleSubmitAction(action);
    }


    function handleUpdateAction(register) {


        if (!register)
            return null;

        const cleanData = Object.entries(groupDefinition).map(([title, items]) => {
            const d = {};

            items.fields.forEach(item => {
                const columnName = Object.keys(item)[0];
                d[columnName] = register[columnName] || '';
            });

            return {
                title,
                "data": d
            };
        });

        setFormTilte(updateConfig.title);
        setCurrentFormAction("update");
        setSingleRegisterData(cleanData);
        setOpenAddForm(true);


    }

    function handleUpdateSubmition() {
        const action = updateConfig.UpdateActionData(config);
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


    function handleDelete(registers) {
        if (!registers)
            return null;


        let title = deleteConfig.singleDeleteTitle;
        let message = `Esta seguro que desea eliminar el registro:${registers[0].id}`

        if (registers.length > 1) {
            title = deleteConfig.multipleDeleteTitles;
            message = `Esta seguro que desea eliminar un total de registros:${registers.length}`
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
            deleteRegisters(registers, deleteConfig, config, getRegisters)

        })

        return p;



    }


    return (
        <>

            <div className={`${dataIsLoad ? "opacity-100" : "opacity-0"}  `}>
                {data && <TableDataGrid rawData={data}

                    onUpdate={handleUpdateAction}
                    onAdd={handleAddAction}
                    onDelete={handleDelete}
                    onDoubleClickRow={(u) => {
                        setDetail(u);
                        setOpenDetailModal(true);
                    }}
                    permissions={permissions}
                />

                }

                <RegisterModuleComponent
                    showModal={openAddForm}
                    onClose={() => { setOpenAddForm(false) }}
                    data={singleRegisterData}
                    showAccordion={showAccordion}
                    setShowAccordion={setShowAccordion}
                    onSetData={setSingleRegisterData}
                    onFinish={resetFormData} onSubmit={handleSubmit} title={formTitle}
                    steps={steps}
                />

                <Detail data={detail} showDetail={openDetailModal} title={detailTitle}
                    onClose={() => setOpenDetailModal(false)} />

            </div>

            <LoadingModal open={showLoadModal} />

        </>

    )
}