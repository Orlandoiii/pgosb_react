import { useState } from "react"
import TableDataGrid from "../../core/datagrid/TableDataGrid"

import AlertController from "../../core/alerts/AlertController";
import { RegisterUnit } from "./Register/RegisterUnit";
import mockData from "../../../assets/Mock_Data_SIMF.json"


export default function UnitPage({ }) {

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
            <TableDataGrid rawData={mockData} onAdd={() => { setOpenAddForm(true) }} onUpdate={onUpdate} />
            <RegisterUnit showModal={openAddForm} onClose={() => { setOpenAddForm(false) }}
               onFinish={() => { setOpenAddForm(false) }} />
         </div>




      </>

   )
}