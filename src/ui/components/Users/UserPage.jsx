import { useEffect, useState } from "react"
import TableDataGrid from "../../core/datagrid/TableDataGrid"
import { RegisterUser } from "./Register/RegisterUser"
import axios from "axios";
import { useConfig } from "../../../logic/Config/ConfigContext";
import logger from "../../../logic/Logger/logger";
import { useLoadModal } from "../../core/modal/LoadingModal";
import { Detail } from "../../core/detail/Detail";

export default function UserPage({ }) {

   const [openAddForm, setOpenAddForm] = useState(false);


   const [userData, setUserData] = useState(null);

   const [openDetailModal, setOpenDetailModal] = useState(false);

   const [detailUserData, setDetailUserData] = useState(null);

   const { openLoadModal, closeLoadModal } = useLoadModal();


   const { config } = useConfig();


   logger.log("User Data:", config);


   useEffect(() => {
      openLoadModal();
      const cancelTokenSource = axios.CancelToken.source();

      axios.get(`${config.back_url}/api/v1/user/all`, {
         cancelToken: cancelTokenSource.token
      }).then(response => {

         logger.log("User Response", response)
         if (response.status >= 200 && response.status <= 299) {
            logger.log("User Data:", response.data)
            setUserData(response.data);
         }
      }).catch(err => {
         logger.error(err);
      }).finally(() => {
         closeLoadModal();
      })



      return () => {
         cancelTokenSource.cancel("unmount");
      }


   }, [])


   return (
      <>
         <div className="">
            {userData && <TableDataGrid rawData={userData} configLayout={config.user_layout}
               onAdd={() => { setOpenAddForm(true) }} onDoubleClickRow={(u) => {
                  setDetailUserData(u);
                  setOpenDetailModal(true);
               }} />}

            <RegisterUser showModal={openAddForm} onClose={() => { setOpenAddForm(false) }}
               onFinish={() => { setOpenAddForm(false) }} />

            <Detail data={detailUserData} showDetail={openDetailModal} title={"Detalle de Usuario"}
               onClose={() => setOpenDetailModal(false)} configLayout={config.user_layout} />

         </div>

      </>

   )
}