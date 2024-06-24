import { useState } from "react"
import TableDataGrid from "../../core/datagrid/TableDataGrid"
import AlertController from "../../core/alerts/AlertController";
import mockData  from "../../../assets/Mock_Data_SIMF.json"
import { RegisterStation } from "./Register/RegisterStation";


export default function StationPage({ }) {

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
            <RegisterStation showModal={openAddForm} onClose={() => { setOpenAddForm(false) }}
               onFinish={() => { setOpenAddForm(false) }} />
         </div>
      </>

   )
}