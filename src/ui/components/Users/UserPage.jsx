import { useState } from "react"
import TableDataGrid from "../../core/datagrid/TableDataGrid"
import { RegisterUser } from "./Register/RegisterUser"

import AlertController from "../../core/alerts/AlertController";
import mockData from "../../../assets/users_data.json"
import { UserFieldNameDictonary } from "./Register/UserFieldDictonary";

export default function UserPage({ }) {

   const [openAddForm, setOpenAddForm] = useState(false);

   const notifyController = new AlertController();

   function onUpdate() {
      notifyController.notifySuccess("Un mensaje exitoso")
      notifyController.notifyInfo("Un mensaje exitoso")

      notifyController.notifyWarning("Un mensaje exitoso")
      notifyController.notifyError("Un mensaje exitoso")

   }


   return (
      <>
         <div className="">
            <TableDataGrid configHeader={UserFieldNameDictonary} rawData={mockData} onAdd={() => { setOpenAddForm(true) }} onUpdate={onUpdate} />
            <RegisterUser showModal={openAddForm} onClose={() => { setOpenAddForm(false) }}
               onFinish={() => { setOpenAddForm(false) }} />
        
         </div>

      </>

   )
}