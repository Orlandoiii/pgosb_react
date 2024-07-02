import { useEffect, useMemo, useState } from "react"
import TableDataGrid from "../../core/datagrid/TableDataGrid"
import axios from "axios";
import { useConfig } from "../../../logic/Config/ConfigContext";
import logger from "../../../logic/Logger/logger";
import { useLoadModal } from "../../core/modal/LoadingModal";
import { Detail } from "../../core/detail/Detail";
import { useConfirmationModal } from "../../core/modal/ModalConfirmation";
import AlertController from "../../core/alerts/AlertController";
import { RegisterStation } from "./Register/RegisterStation";
const alertController = new AlertController();

function StateCreateActionData(config) {
   return {
      title: "Registro de Estacion",
      message: "Esta seguro que desea registrar la estacion con los datos antes mostrados ?",
      successMessage: "Estacion guardada Exitosamente",
      errMessage: "No se pudo guardar la estacion",
      endpoint: `${config.back_url}/api/v1/location/station/create`,
      method: "post"
   }
}


function StateUpdateActionData(config) {
   return {
      title: "Actualizacion de Estacion",
      message: "Esta seguro que desea actualizar la estacion con los datos antes mostrados ?",
      successMessage: "Estacion actualizado Exitosamente",
      errMessage: "No se pudo actualizar el estacion",
      endpoint: `${config.back_url}/api/v1/station/update`,
      method: "put"
   }
}
async function deleteStations(stations, config, getStations) {
   try {
      // Create an array of promises, one for each Axios request
      const deletePromises = stations.map((station) => {
         const endpoint = `${config.back_url}/api/v1/location/station/${station.id}`;
         return axios.delete(endpoint); // Return the promise from axios.delete
      });

      // Wait for all requests to complete
      const responses = await Promise.all(deletePromises);

      // Handle successful deletions and update the UI (getStations)
      responses.forEach((response, index) => {
         if (response.status >= 200 && response.status <= 299) {
            logger.info("STATION DELETE:", response);
            alertController.notifySuccess(
               `Estacion eliminado exitosamente ${stations[index].id}`
            );
         }
      });


      // You can do additional processing here after all deletions are done
   } catch (err) {
      // Handle any errors that occurred during deletions
      logger.error("STATION ACTION ERROR", err);
      alertController.notifyError(`Error Eliminado Estaciones`); // General error message

   } finally {
      getStations();
   }
}

export default function StationPage({ }) {

   const [openAddForm, setOpenAddForm] = useState(false);


   const [showAccordion, setShowAccordion] = useState(false)

   const [stationData, setStationData] = useState(null);

   const [singleStationData, setSingleStationData] = useState([])

   const [openDetailModal, setOpenDetailModal] = useState(false);

   const [detailStationData, setDetailStationData] = useState(null);

   const { openLoadModal, closeLoadModal } = useLoadModal();

   const { showConfirmationModal } = useConfirmationModal();

   const { config } = useConfig();


   const [formTitle, setFormTilte] = useState("");

   const [currentFormAction, setCurrentFormAction] = useState("");


   const groupedData = useMemo(() => {

      if (!config.station_layout) {
         return null;
      }

      return config.station_layout.reduce((acc, obj) => {
         const group = obj.group_name;
         acc[group] ||= []; // Conditional nullish assignment for cleaner initialization
         acc[group].push({ [obj.column_name]: obj.display_name });
         return acc;
      }, {});

   }, [config.station_layout]);



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



   function getStations(token) {
      axios.get(`${config.back_url}/api/v1/location/station/all`, {
         cancelToken: token
      }).then(response => {

         logger.log("Station Response", response)
         if (response.status >= 200 && response.status <= 299) {
            logger.log("Station Data:", response.data)
            setStationData(response.data);
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
      getStations(cancelTokenSource.token);
      return () => {
         cancelTokenSource.cancel("unmount");
      }

   }, [])


   function resetFormData() {
      setShowAccordion(false)
      setSingleStationData([]);
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

         const mergedData = singleStationData.reduce((acc, obj) => {
            return { ...acc, ...obj.data };
         }, {});
         axios({
            url: endpoint,
            data: mergedData,
            method: method
         }).then(r => {
            closeLoadModal()
            logger.info("STATION ACTION:", r)
            if (r.status >= 200 && r.status <= 299) {
               getStations()
               alertController.notifySuccess(successMessage);
            }
         }).catch(err => {
            closeLoadModal();
            logger.error("STATION ACTION ERROR", err);
            alertController.notifyError(errMessage);
         }).finally(() => {
            resetFormData();
         })

      })
   }

   function handleAddAction() {
      setFormTilte("Registro de Estacion");
      setCurrentFormAction("add");
      setOpenAddForm(true);

   }
   function handleAddSubmition() {
      const action = StateCreateActionData(config);
      handleSubmitAction(action);
   }


   function handleUpdateAction(station) {


      if (!station)
         return null;


      const cleanData = Object.entries(groupedData).map(([title, items]) => {
         const d = {};

         items.forEach(item => {
            const columnName = Object.keys(item)[0];
            d[columnName] = station[columnName] || '';
         });

         return {
            title,
            "data": d
         };
      });

      setFormTilte("Actualización de Estacion");
      setCurrentFormAction("update");
      setSingleStationData(cleanData);
      setOpenAddForm(true);


   }

   function handleUpdateSubmition() {
      const action = StateUpdateActionData(config);
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


   function handleDelete(stations) {
      if (!stations)
         return null;


      let title = "Eliminar Estacion";
      let message = `Esta seguro que desea eliminar al estacion:${stations[0].id}`

      if (stations.length > 1) {
         title = "Eliminar Estaciones";
         message = `Esta seguro que desea eliminar un total de estaciones:${stations.length}`
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
         deleteStations(stations, config, getStations)

      })

      return p;



   }


   return (
      <>
         <div className="">
            {stationData && <TableDataGrid rawData={stationData} configLayout={config.station_layout}

               onUpdate={handleUpdateAction}
               onAdd={handleAddAction}
               onDelete={handleDelete}
               onDoubleClickRow={(u) => {
                  setDetailStationData(u);
                  setOpenDetailModal(true);
               }} />}

            <RegisterStation stationData={singleStationData}
               showAccordion={showAccordion} setShowAccordion={setShowAccordion}
               onSetStationData={setSingleStationData} showModal={openAddForm} onClose={() => { setOpenAddForm(false) }}
               onFinish={resetFormData} onSubmit={handleSubmit} title={formTitle} configNames={configNames} />

            <Detail data={detailStationData} showDetail={openDetailModal} title={"Detalle de Estacion"} configNames={configNames}
               onClose={() => setOpenDetailModal(false)} configLayout={config.station_layout} groupedData={groupedData} />

         </div>

      </>

   )
}