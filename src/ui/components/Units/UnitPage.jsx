import LayoutContexProvider from "../../core/context/LayoutContext";
import ModuleComponent from "../Module/ModuleComponent";
import BasicInfoForm from "./Forms/BasicInfoForm";
import DataForm from "./Forms/DataForm";


function UnitCreateActionData(config) {
   return {
      title: "Registro de Unidad",
      message: "Esta seguro que desea registrar la Unidad con los datos antes mostrados ?",
      successMessage: "Unidad guardada exitosamente",
      errMessage: "No se pudo guardar la Unidad",
      endpoint: `${config.back_url}/api/v1/unit/create`,
      method: "post"
   }
}

function UnitUpdateActionData(config) {
   return {
      title: "Actualizacion de Unidad",
      message: "Esta seguro que desea actualizar la Unidad con los datos antes mostrados ?",
      successMessage: "Unidad actualizada Exitosamente",
      errMessage: "No se pudo actualizar la Unidad",
      endpoint: `${config.back_url}/api/v1/unit/update`,
      method: "put"
   }
}

const getAllDataEndpoint = '/api/v1/unit/all';

const deleteConfig = {
   singleDeleteTitle: 'Eliminar Unidad',
   multipleDeleteTitles: 'Eliminar Unidades',
   successMessage: 'Unidad eliminada exitosamente:',
   failMessage: 'Error al eliminar la Unidad.',
   endpoint: '/api/v1/unit/',
   showPropertyName: 'id',
};
const addConfig = {
   title: 'Agregar Nueva Unidad',
   AddActionData: UnitCreateActionData
};
const updateConfig = {
   title: 'Actualizar Unidad',
   UpdateActionData: UnitUpdateActionData
};


const detailTitle = "Detalles de la Unidad";

const stepsObjects = [
   {
      title: "Datos básicos",
      content: <BasicInfoForm />,

   },
   {
      title: "Características",
      content: <DataForm />,
   }
]



export default function UnitPage({ }) {
   return (
      <>
         <LayoutContexProvider layoutName={"unit_layout"}>
            <ModuleComponent
               getAllDataEndpoint={getAllDataEndpoint}
               deleteConfig={deleteConfig}
               updateConfig={updateConfig}
               addConfig={addConfig}
               steps={stepsObjects}
               detailTitle={detailTitle}
               moduleName={"units"}
            />
         </LayoutContexProvider>
      </>

   )
}