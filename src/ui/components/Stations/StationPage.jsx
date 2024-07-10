import LayoutContexProvider from "../../core/context/LayoutContext";
import ModuleComponent from "../Module/ModuleComponent";
import StationForm from "./Forms/StationForm"
import LocationForm from "../Locations/Forms/LocationForm"


function StationCreateActionData(config) {
   return {
      title: "Registro de Estacion",
      message: "Esta seguro que desea registrar la Estacion con los datos antes mostrados ?",
      successMessage: "Estacion guardada exitosamente",
      errMessage: "No se pudo guardar la Estacion",
      endpoint: `${config.back_url}/api/v1/location/station/create`,
      method: "post"
   }
}

function StationUpdateActionData(config) {
   return {
      title: "Actualizacion de Estacion",
      message: "Esta seguro que desea actualizar la Estacion con los datos antes mostrados ?",
      successMessage: "Estacion actualizada Exitosamente",
      errMessage: "No se pudo actualizar la Estacion",
      endpoint: `${config.back_url}/api/v1/location/station/update`,
      method: "put"
   }
}

const getAllDataEndpoint = '/api/v1/location/station/all';

const deleteConfig = {
   singleDeleteTitle: 'Eliminar Estacion',
   multipleDeleteTitles: 'Eliminar Estaciones',
   successMessage: 'Estacion eliminada exitosamente:',
   failMessage: 'Error al eliminar la Estacion.',
   endpoint: '/api/v1/station/',
   showPropertyName: 'id',
};
const addConfig = {
   title: 'Agregar Nueva Estacion',
   AddActionData: StationCreateActionData
};
const updateConfig = {
   title: 'Actualizar Estacion',
   UpdateActionData: StationUpdateActionData
};


const detailTitle = "Detalles de la Estacion";

const stepsObjects = [
   {
      title: "Datos Básicos",
      content: <StationForm />,

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
               moduleName={"stations"}
            />
         </LayoutContexProvider>
      </>

   )
}