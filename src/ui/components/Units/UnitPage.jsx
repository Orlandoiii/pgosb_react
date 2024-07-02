import { useEffect, useMemo, useState } from "react"
import TableDataGrid from "../../core/datagrid/TableDataGrid"
import RegisterUnit from "./Register/RegisterUnit"
import axios from "axios";
import { useConfig } from "../../../logic/Config/ConfigContext";
import logger from "../../../logic/Logger/logger";
import { useLoadModal } from "../../core/modal/LoadingModal";
import { Detail } from "../../core/detail/Detail";
import { useConfirmationModal } from "../../core/modal/ModalConfirmation";
import AlertController from "../../core/alerts/AlertController";
const alertController = new AlertController();

function UnitCreateActionData(config) {
   return {
      title: "Registro de Vehiculo",
      message: "Esta seguro que desea registrar el vehiculo con los datos antes mostrados ?",
      successMessage: "Vehiculo guardado Exitosamente",
      errMessage: "No se pudo guardar el vehiculo",
      endpoint: `${config.back_url}/api/v1/unit/create`,
      method: "post"
   }
}


function UnitUpdateActionData(config) {
   return {
      title: "Actualizacion de Unidades",
      message: "Esta seguro que desea actualizar el vehiculo con los datos antes mostrados ?",
      successMessage: "Vehiculo actualizado Exitosamente",
      errMessage: "No se pudo actualizar el Vehiculo",
      endpoint: `${config.back_url}/api/v1/unit/update`,
      method: "put"
   }
}
async function deleteUnits(units, config, getUnits) {
   try {
      // Create an array of promises, one for each Axios request
      const deletePromises = units.map((unit) => {
         const endpoint = `${config.back_url}/api/v1/unit/${unit.id}`;
         return axios.delete(endpoint); // Return the promise from axios.delete
      });

      // Wait for all requests to complete
      const responses = await Promise.all(deletePromises);

      // Handle successful deletions and update the UI (getUsers)
      responses.forEach((response, index) => {
         if (response.status >= 200 && response.status <= 299) {
            logger.info("UNIT DELETE:", response);
            alertController.notifySuccess(
               `Vehiculo eliminado exitosamente ${units[index].user_name}`
            );
         }
      });


      // You can do additional processing here after all deletions are done
   } catch (err) {
      // Handle any errors that occurred during deletions
      logger.error("UNIT ACTION ERROR", err);
      alertController.notifyError(`Error Eliminado Vehiculos`); // General error message

   } finally {
      getUnits();
   }
}


export default function UnitPage({ }) {

   const [openAddForm, setOpenAddForm] = useState(false);


   const [showAccordion, setShowAccordion] = useState(false)

   const [unitData, setUnitData] = useState(null);

   const [singleUnitData, setSingleUnitData] = useState([])

   const [openDetailModal, setOpenDetailModal] = useState(false);

   const [detailUnitData, setDetailUnitData] = useState(null);

   const { openLoadModal, closeLoadModal } = useLoadModal();

   const { showConfirmationModal } = useConfirmationModal();

   const { config } = useConfig();


   const [formTitle, setFormTilte] = useState("");

   const [currentFormAction, setCurrentFormAction] = useState("");


   const groupedData = useMemo(() => {

      if (!config.unit_layout) {
         return null;
      }

      return config.unit_layout.reduce((acc, obj) => {
         const group = obj.group_name;
         acc[group] ||= []; // Conditional nullish assignment for cleaner initialization
         acc[group].push({ [obj.column_name]: obj.display_name });
         return acc;
      }, {});

   }, [config.unit_layout]);



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

   logger.log("Unit Data:", config);


   function getUnits(token) {
      axios.get(`${config.back_url}/api/v1/unity/all`, {
         cancelToken: token
      }).then(response => {

         logger.log("User Response", response)
         if (response.status >= 200 && response.status <= 299) {
            logger.log("User Data:", response.data)
            setUnitData(response.data);
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
      getUnits(cancelTokenSource.token);
      return () => {
         cancelTokenSource.cancel("unmount");
      }

   }, [])


   function resetFormData() {
      setShowAccordion(false)
      setSingleUnitData([]);
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

         const mergedData = singleUnitData.reduce((acc, obj) => {
            return { ...acc, ...obj.data };
         }, {});
         axios({
            url: endpoint,
            data: mergedData,
            method: method
         }).then(r => {
            closeLoadModal()
            logger.info("UNIT ACTION:", r)
            if (r.status >= 200 && r.status <= 299) {
               getUnits()
               alertController.notifySuccess(successMessage);
            }
         }).catch(err => {
            closeLoadModal();
            logger.error("UNIT ACTION ERROR", err);
            alertController.notifyError(errMessage);
         }).finally(() => {
            resetFormData();
         })

      })
   }

   function handleAddAction() {
      setFormTilte("Registro de Vehiculo");
      setCurrentFormAction("add");
      setOpenAddForm(true);

   }
   function handleAddSubmition() {
      const action = UnitCreateActionData(config);
      handleSubmitAction(action);
   }


   function handleUpdateAction(user) {


      if (!user)
         return null;


      const cleanData = Object.entries(groupedData).map(([title, items]) => {
         const d = {};

         items.forEach(item => {
            const columnName = Object.keys(item)[0];
            d[columnName] = user[columnName] || '';
         });

         return {
            title,
            "data": d
         };
      });

      setFormTilte("Actualización de Vehiculo");
      setCurrentFormAction("update");
      setSingleUnitData(cleanData);
      setOpenAddForm(true);


   }

   function handleUpdateSubmition() {
      const action = UnitUpdateActionData(config);
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


   function handleDelete(units) {
      if (!units)
         return null;


      let title = "Eliminar Vehiculo";
      let message = `Esta seguro que desea eliminar el vehiculo:${units[0].id}`

      if (units.length > 1) {
         title = "Eliminar Vehiculos";
         message = `Esta seguro que desea eliminar un total de vehiculos:${units.length}`
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
         deleteUnits(units, config, getUnits)

      })

      return p;



   }


   return (
      <>
         <div className="">
            {unitData && <TableDataGrid rawData={unitData} configLayout={config.unit_layout}

               onUpdate={handleUpdateAction}
               onAdd={handleAddAction}
               onDelete={handleDelete}
               onDoubleClickRow={(u) => {
                  setDetailUnitData(u);
                  setOpenDetailModal(true);
               }} />}


            <RegisterUnit unitData={singleUnitData}
               showAccordion={showAccordion} setShowAccordion={setShowAccordion}
               onSetUnitData={setSingleUnitData} showModal={openAddForm} onClose={() => { setOpenAddForm(false) }}
               onFinish={resetFormData} onSubmit={handleSubmit} title={formTitle} configNames={configNames} />

            <Detail data={detailUnitData} showDetail={openDetailModal} title={"Detalle de Unidad"} configNames={configNames}
               onClose={() => setOpenDetailModal(false)} configLayout={config.unit_layout} groupedData={groupedData} />

         </div>

      </>

   )
}