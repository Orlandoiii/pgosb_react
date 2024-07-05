import { useEffect, useMemo, useState } from "react"
import TableDataGrid from "../../core/datagrid/TableDataGrid"
import { RegisterUser } from "./Register/RegisterUser"
import axios from "axios";
import { useConfig } from "../../../logic/Config/ConfigContext";
import logger from "../../../logic/Logger/logger";
import { LoadingModal, useLoadModal } from "../../core/modal/LoadingModal";
import { Detail } from "../../core/detail/Detail";
import { useConfirmationModal } from "../../core/modal/ModalConfirmation";
import AlertController from "../../core/alerts/AlertController";
import { useNotificationAlert } from "../../core/alerts/NotificationModal";
import LayoutContexProvider, { useLayout } from "../../core/context/LayoutContext";
const alertController = new AlertController();

function UserCreateActionData(config) {
   return {
      title: "Registro de Usuario",
      message: "Esta seguro que desea registrar el usuario con los datos antes mostrados ?",
      successMessage: "Usuario guardado Exitosamente",
      errMessage: "No se pudo guardar el usuario",
      endpoint: `${config.back_url}/api/v1/user/create`,
      method: "post"
   }
}


function UserUpdateActionData(config) {
   return {
      title: "Actualizacion de Usuario",
      message: "Esta seguro que desea actualizar el usuario con los datos antes mostrados ?",
      successMessage: "Usuario actualizado Exitosamente",
      errMessage: "No se pudo actualizar el usuario",
      endpoint: `${config.back_url}/api/v1/user/update`,
      method: "put"
   }
}
async function deleteUsers(users, config, getUsers) {
   try {
      // Create an array of promises, one for each Axios request
      const deletePromises = users.map((user) => {
         const endpoint = `${config.back_url}/api/v1/user/${user.id}`;
         return axios.delete(endpoint); // Return the promise from axios.delete
      });

      // Wait for all requests to complete
      const responses = await Promise.all(deletePromises);

      // Handle successful deletions and update the UI (getUsers)
      responses.forEach((response, index) => {
         if (response.status >= 200 && response.status <= 299) {
            logger.info("USER DELETE:", response);
            alertController.notifySuccess(
               `Usuario eliminado exitosamente ${users[index].user_name}`
            );
         }
      });


      // You can do additional processing here after all deletions are done
   } catch (err) {
      // Handle any errors that occurred during deletions
      logger.error("USER ACTION ERROR", err);
      alertController.notifyError(`Error Eliminado Usuarios`); // General error message

   } finally {
      getUsers();
   }
}

export default function UserPage({ }) {

   const [openAddForm, setOpenAddForm] = useState(false);

   const [dataIsLoad, setDataIsLoad] = useState(false);



   const [err, setErr] = useState("");

   const [showAccordion, setShowAccordion] = useState(false)

   const [userData, setUserData] = useState(null);

   const [singleUserData, setSingleUserData] = useState([])

   const [openDetailModal, setOpenDetailModal] = useState(false);

   const [detailUserData, setDetailUserData] = useState(null);

   const [showLoadModal, setShowLoadModal] = useState(false);


   function openLoadModal() {
      setShowLoadModal(true);
   }

   function closeLoadModal() {
      setShowLoadModal(false);
   }





   const { showConfirmationModal } = useConfirmationModal();


   const { showNotification } = useNotificationAlert();

   const { config } = useConfig();


   const [formTitle, setFormTilte] = useState("");

   const [currentFormAction, setCurrentFormAction] = useState("");


   const { layout, groupDefinition, fieldDefinition } = useLayout();


   logger.log("User Data:", layout, groupDefinition, fieldDefinition);


   function getUsers(token) {
      axios.get(`${config.back_url}/api/v1/user/all`, {
         cancelToken: token
      }).then(response => {

         logger.log("User Response", response)
         if (response.status >= 200 && response.status <= 299) {
            logger.log("User Data:", response.data)
            setUserData(response.data);
            setDataIsLoad(true);
            closeLoadModal();
         }
      }).catch(err => {
         logger.error(err);

         if (err.message === "unmount")
            return;

         setDataIsLoad(false);
         showNotification("error", "Oohh!!! ", `${err}`);
      }).finally(() => {
         closeLoadModal();
      })
   }



   useEffect(() => {
      openLoadModal();
      const cancelTokenSource = axios.CancelToken.source();
      getUsers(cancelTokenSource.token);
      return () => {
         cancelTokenSource.cancel("unmount");
      }

   }, [])


   function resetFormData() {
      setShowAccordion(false)
      setSingleUserData([]);
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


         const mergedData = singleUserData.reduce((acc, obj) => {
            return { ...acc, ...obj.data };
         }, {});

         logger.info("USER CREATE/UPDATE Datos enviados:", JSON.stringify(mergedData))


         axios({
            url: endpoint,
            data: mergedData,
            method: method
         }).then(r => {
            closeLoadModal()
            logger.info("USER ACTION:", r)
            if (r.status >= 200 && r.status <= 299) {
               getUsers()
               alertController.notifySuccess(successMessage);
               succes = true;
            }

         }).catch(err => {
            closeLoadModal();
            logger.error("USER ACTION ERROR", err);
            alertController.notifyError(errMessage);
         }).finally(() => {
            if (succes)
               resetFormData();
         })

      })
   }

   function handleAddAction() {
      setFormTilte("Registro de Usuario");
      setCurrentFormAction("add");
      setOpenAddForm(true);

   }
   function handleAddSubmition() {
      const action = UserCreateActionData(config);
      handleSubmitAction(action);
   }


   function handleUpdateAction(user) {


      if (!user)
         return null;


      const cleanData = Object.entries(groupDefinition).map(([title, items]) => {
         const d = {};

         items.fields.forEach(item => {
            const columnName = Object.keys(item)[0];
            d[columnName] = user[columnName] || '';
         });

         return {
            title,
            "data": d
         };
      });

      setFormTilte("Actualización de Usuario");
      setCurrentFormAction("update");
      setSingleUserData(cleanData);
      setOpenAddForm(true);


   }

   function handleUpdateSubmition() {
      const action = UserUpdateActionData(config);
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


   function handleDelete(users) {
      if (!users)
         return null;


      let title = "Eliminar Usuario";
      let message = `Esta seguro que desea eliminar al usuario:${users[0].user_name}`

      if (users.length > 1) {
         title = "Eliminar Usuarios";
         message = `Esta seguro que desea eliminar un total de usuarios:${users.length}`
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
         deleteUsers(users, config, getUsers)

      })

      return p;



   }


   return (
      <>

         <div className={`${dataIsLoad ? "opacity-100" : "opacity-0"}  `}>
            {userData && <TableDataGrid rawData={userData} configLayout={layout}

               onUpdate={handleUpdateAction}
               onAdd={handleAddAction}
               onDelete={handleDelete}
               onDoubleClickRow={(u) => {
                  setDetailUserData(u);
                  setOpenDetailModal(true);
               }} />}

            <RegisterUser userData={singleUserData}
               showAccordion={showAccordion} setShowAccordion={setShowAccordion}
               onSetUserData={setSingleUserData} showModal={openAddForm} onClose={() => { setOpenAddForm(false) }}
               onFinish={resetFormData} onSubmit={handleSubmit} title={formTitle} fieldDefinition={fieldDefinition} />

            <Detail data={detailUserData} showDetail={openDetailModal} title={"Detalle de Usuario"} fieldDefinition={fieldDefinition}
               onClose={() => setOpenDetailModal(false)} configLayout={layout} groupDefinition={groupDefinition} />

         </div>

         <LoadingModal open={showLoadModal} />

      </>

   )
}