import { useEffect, useMemo, useState } from "react"
import TableDataGrid from "../../core/datagrid/TableDataGrid"
import { RegisterUser } from "./Register/RegisterUser"
import axios from "axios";
import { useConfig } from "../../../logic/Config/ConfigContext";
import logger from "../../../logic/Logger/logger";
import { useLoadModal } from "../../core/modal/LoadingModal";
import { Detail } from "../../core/detail/Detail";
import { useConfirmationModal } from "../../core/modal/ModalConfirmation";
import AlertController from "../../core/alerts/AlertController";
import { RegisterModuleComponent } from "./RegisterModuleComponent";
const alertController = new AlertController();


async function deleteData(registers, config, deleteActionData, getAll) {
    try {
        const deletePromises = registers.map((reg) => {
            const endpoint = `${config.back_url}${deleteActionData.endpoint}${reg.id}`;
            return axios.delete(endpoint); // Return the promise from axios.delete
        });

        const responses = await Promise.all(deletePromises);

        responses.forEach((response, index) => {
            if (response.status >= 200 && response.status <= 299) {
                logger.info("REGISTER DELETE:", response);
                alertController.notifySuccess(
                    `${deleteActionData.success_message} ${registers[index][deleteActionData.show_prop]}`
                );
            }
        });


    } catch (err) {
        // Handle any errors that occurred during deletions
        logger.error("REGISTER ACTION ERROR", err);
        alertController.notifyError(`${deleteActionData.error_message}`); // General error message

    } finally {
        getAll();
    }
}

export default function ModuleComponent({ createActionData, updateActionData,
    deleteActionData, allDataEndpoint, layoutName, detailTitle }) {




    const [openAddForm, setOpenAddForm] = useState(false);


    const [showAccordion, setShowAccordion] = useState(false)

    const [allData, setAllData] = useState(null);

    const [singleData, setSingleData] = useState([])

    const [openDetailModal, setOpenDetailModal] = useState(false);

    const [detailData, setDetailData] = useState(null);

    const { openLoadModal, closeLoadModal } = useLoadModal();

    const { showConfirmationModal } = useConfirmationModal();

    const { config } = useConfig();


    const [formTitle, setFormTilte] = useState("");

    const [currentFormAction, setCurrentFormAction] = useState("");



    const CreateActionData = createActionData(config)

    const UpdateActionData = updateActionData(config)

    const DeleteActionData = deleteActionData(config)


    const groupedData = useMemo(() => {

        if (!config[layoutName]) {
            return null;
        }

        return config[layoutName].reduce((acc, obj) => {
            const group = obj.group_name;
            acc[group] ||= [];
            acc[group].push({ [obj.column_name]: obj.display_name });
            return acc;
        }, {});

    }, [config[layoutName]]);





    const configNames = useMemo(() => {
        if (!groupedData)
            return null;

        let c = {};

        Object.entries(groupedData).forEach((v, _) => {

            logger.log("DETAIL", v[1]);

            const singleObject = Object.assign({}, ...v[1]);

            c = { ...c, ...singleObject };


        })

        return c;

    }, [groupedData]);



    function getAll(token) {
        axios.get(`${config.back_url}${allDataEndpoint}`, {
            cancelToken: token
        }).then(response => {

            logger.log("Data All Response", response)
            if (response.status >= 200 && response.status <= 299) {
                logger.log("All Data:", response.data)
                setAllData(response.data);
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
        getAll(cancelTokenSource.token);
        return () => {
            cancelTokenSource.cancel("unmount");
        }

    }, [])


    function resetFormData() {
        setShowAccordion(false)
        setSingleData([]);
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

            const mergedData = singleData.reduce((acc, obj) => {
                return { ...acc, ...obj.data };
            }, {});
            axios({
                url: endpoint,
                data: mergedData,
                method: method
            }).then(r => {
                closeLoadModal()
                logger.info("DATA ACTION:", r)
                if (r.status >= 200 && r.status <= 299) {
                    getUsers()
                    alertController.notifySuccess(successMessage);
                }
            }).catch(err => {
                closeLoadModal();
                logger.error("DATA ACTION ERROR", err);
                alertController.notifyError(errMessage);
            }).finally(() => {
                resetFormData();
            })

        })
    }

    function handleAddAction() {
        setFormTilte(CreateActionData.title);
        setCurrentFormAction("add");
        setOpenAddForm(true);

    }
    function handleAddSubmition() {
        handleSubmitAction(CreateActionData);
    }


    function handleUpdateAction(reg) {


        if (!reg)
            return null;


        const cleanData = Object.entries(groupedData).map(([title, items]) => {
            const d = {};

            items.forEach(item => {
                const columnName = Object.keys(item)[0];
                d[columnName] = reg[columnName] || '';
            });

            return {
                title,
                "data": d
            };
        });

        setFormTilte(UpdateActionData.title);
        setCurrentFormAction("update");
        setSingleData(cleanData);
        setOpenAddForm(true);


    }

    function handleUpdateSubmition() {

        handleSubmitAction(UpdateActionData);
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


        let title = "Eliminar Registro";
        let message = `Esta seguro que desea eliminar el registro:${registers[0].id}`

        if (registers.length > 1) {
            title = "Eliminar Registros";
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
            deleteUsers(registers, config, getUsers)

        })

        return p;

    }


    return (
        <>
            <div className="">
                {allData && <TableDataGrid rawData={allData} configLayout={config[layoutName]}

                    onUpdate={handleUpdateAction}
                    onAdd={handleAddAction}
                    onDelete={handleDelete}
                    onDoubleClickRow={(u) => {
                        setDetailData(u);
                        setOpenDetailModal(true);
                    }} />}

                <RegisterModuleComponent data={singleData}
                    showAccordion={showAccordion} setShowAccordion={setShowAccordion}
                    onSetData={setSingleData} showModal={openAddForm} onClose={() => { setOpenAddForm(false) }}
                    onFinish={resetFormData} onSubmit={handleSubmit} title={formTitle} configNames={configNames} />

                <Detail data={detailData} showDetail={openDetailModal} title={detailTitle} configNames={configNames}
                    onClose={() => setOpenDetailModal(false)} configLayout={config[layoutName]} groupedData={groupedData} />

            </div>

        </>

    )
}