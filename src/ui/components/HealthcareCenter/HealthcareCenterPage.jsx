import LayoutContexProvider from "../../core/context/LayoutContext";
import ModuleComponent from "../Module/ModuleComponent";
import LocationForm from "../Locations/Forms/LocationForm"
import HealthcareCenterForm from "./Forms/HealthcareCenterForm"

function HealthCreateActionData(config) {
   return {
      title: "Registro de Centro Asistencial",
      message: "Esta seguro que desea registrar el Centro Asistencial con los datos antes mostrados ?",
      successMessage: "Centro Asistencial guardado exitosamente",
      errMessage: "No se pudo guardar el Centro Asistencial",
      endpoint: `${config.back_url}/api/v1/location/station/create`,
      method: "post"
   }
}

function HealthUpdateActionData(config) {
   return {
      title: "Actualizacion de Centro Asistencial",
      message: "Esta seguro que desea actualizar el Centro Asistencial con los datos antes mostrados ?",
      successMessage: "Centro Asistencial actualizado Exitosamente",
      errMessage: "No se pudo actualizar el Centro Asistencial",
      endpoint: `${config.back_url}/api/v1/location/station/update`,
      method: "put"
   }
}

const getAllDataEndpoint = '/api/v1/location/station/all';

const deleteConfig = {
   singleDeleteTitle: 'Eliminar Centro Asistencial',
   multipleDeleteTitles: 'Eliminar Centros Asistenciales',
   successMessage: 'Centro Asistencial eliminado exitosamente:',
   failMessage: 'Error al eliminar el Centro Asistencial.',
   endpoint: '/api/v1/station/',
   showPropertyName: 'id',
};
const addConfig = {
   title: 'Agregar Nuevo Centro Asistencial',
   AddActionData: HealthCreateActionData
};
const updateConfig = {
   title: 'Actualizar Centro Asistencial',
   UpdateActionData: HealthUpdateActionData
};


const detailTitle = "Detalles del Centro Asistencial";

const stepsObjects = [
   {
      title: "Datos Básicos",
      content: <HealthcareCenterForm />,

   },
   {
      title: "Ubicación",
      content: <LocationForm />
   }
]




export default function StationPage({ }) {
   return (
      <>
         <LayoutContexProvider layoutName={"station_layout"}>
            <ModuleComponent
               getAllDataEndpoint={getAllDataEndpoint}
               deleteConfig={deleteConfig}
               updateConfig={updateConfig}
               addConfig={addConfig}
               steps={stepsObjects}
               detailTitle={detailTitle}
            />
         </LayoutContexProvider>
      </>

   )
}