import { useEffect, useState } from "react"
import TableDataGrid from "../../core/datagrid/TableDataGrid"
import AlertController from "../../core/alerts/AlertController";
import mockData from "../../../assets/MOCK_DATA.json"
import { ModalStepPage } from "../../core/modal/ModalStepPage";
import FormTitle from "../../core/titles/FormTitle";
import TreeViewCustom from "../../core/treeview/TreeViewCustom";
export default function LocationPage({ }) {

   const [openAddForm, setOpenAddForm] = useState(false);

   const notifyController = new AlertController();


   const [parenNode, setParentNode] = useState(null);

   function onUpdate() {
      notifyController.notifySuccess("Un mensaje exitoso")
      notifyController.notifyInfo("Un mensaje exitoso")

      notifyController.notifyWarning("Un mensaje exitoso")
      notifyController.notifyError("Un mensaje exitoso")

   }

   useEffect(() => {
      const node = document.querySelector("#step-page-modal");
      setParentNode(node);
   }, [])


   return (
      <>
         <div className="">
            <TableDataGrid rawData={mockData} onAdd={() => { setOpenAddForm(true) }}
               onUpdate={onUpdate} />
         </div>

         {parenNode && <ModalStepPage onClose={() => setOpenAddForm(false)} parent={parenNode} show={openAddForm}>


            <div className="bg-[whitesmoke] w-full  h-auto mx-auto p-6 flex flex-col md:flex-row justify-between overflow-auto">

               <div className="md:w-[55%] mx-auto">
                  <div className="mb-2 px-2">
                     <FormTitle title={"Registro de Región"} />
                  </div>
                  {/* <RegionForm /> */}

               </div>
               <div className="md:w-[45%] mx-auto">
                  <FormTitle title={"Árbol Descriptivo"} />
                  <TreeViewCustom />
               </div>
            </div>


         </ModalStepPage>}

      </>

   )
}