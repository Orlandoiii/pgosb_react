import { useState } from "react"
import TableDataGrid from "../../core/datagrid/TableDataGrid"
import AlertController from "../../core/alerts/AlertController";
import mockData from "../../../assets/MOCK_DATA_ESTACIONES.json"
import { RegisterHealthcareCenter } from "./Register/RegisterHealthcareCenter";
import { HealthcareFieldDictonary } from "./Register/HealthcareFieldDictonary";

export default function HealthcareCenterPage({ }) {

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
            <TableDataGrid rawData={mockData} onAdd={() => { setOpenAddForm(true) }}
               onUpdate={onUpdate} configHeader={HealthcareFieldDictonary} />
            <RegisterHealthcareCenter showModal={openAddForm} onClose={() => { setOpenAddForm(false) }}
               onFinish={() => { setOpenAddForm(false) }} />
         </div>
      </>

   )
}