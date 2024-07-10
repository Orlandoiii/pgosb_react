import LayoutContexProvider from "../../core/context/LayoutContext";
import ModuleComponent from "../Module/ModuleComponent";
import InfoPersonalForm from "./Forms/InfoPersonalForm";
import LocationForm from "../Locations/Forms/LocationForm";
import SkillForm from "./Forms/SkillsForm";
import InstitutionInfoForm from "./Forms/InstitutionInfoForm";




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

const getAllDataEndpoint = '/api/v1/user/all';

const deleteConfig = {
   singleDeleteTitle: 'Eliminar Usuario',
   multipleDeleteTitles: 'Eliminar Usuarios',
   successMessage: 'Usuario eliminado exitosamente:',
   failMessage: 'Error al eliminar usuario.',
   endpoint: '/api/v1/user/',
   showPropertyName: 'user_name',
};
const addConfig = {
   title: 'Agregar Nuevo Usuario',
   AddActionData: UserCreateActionData
};
const updateConfig = {
   title: 'Actualizar Usuario',
   UpdateActionData: UserUpdateActionData
};


const detailTitle = "Detalles del Usuario";

const stepsObjects = [
   {
      title: "Datos Básicos",
      content: <InfoPersonalForm />,

   },
   {
      title: "Ubicación",
      content: <LocationForm />
   },
   {
      title: "Características",
      content: <SkillForm />,

   },
   {
      title: "Datos Institucionales",
      content: <InstitutionInfoForm />
   }
]


export default function UserPage({ }) {
   return (
      <>
         <LayoutContexProvider layoutName={"user_layout"}>
            <ModuleComponent
               getAllDataEndpoint={getAllDataEndpoint}
               deleteConfig={deleteConfig}
               updateConfig={updateConfig}
               addConfig={addConfig}
               steps={stepsObjects}
               detailTitle={detailTitle}
               moduleName="users"
            />
         </LayoutContexProvider>
      </>

   )
}