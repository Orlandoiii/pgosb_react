import SideBarLink from "./SidebarLink"
import ServiceIcon from "../icons/ServiceIcon"
import UsersIcon from "../icons/UsersIcon"
import RolsIncon from "../icons/RolsIcon"
import StationIcon from "../icons/StationIcon"
import UnitIcon from "../icons/UnitIcon"
import LocationIcon from "../icons/LocationIcon"
import AmbulanceIcon from "../icons/AmbulanceIcon"
import FireLogo from "../logo/FireLogo"
import logger from "../../../logic/Logger/logger"
import { LogOutIcon } from "../icons/LogOutIcon"
import { useAuth } from "../../components/Authentication/AuthProvider"
import { useUser } from "../context/UserDataContext"
import { useMemo } from "react"
import { reversedModuleNameDictionary } from "../../components/Roles/RolesPages"
import AlertController from "../alerts/AlertController"

const alert = new AlertController();

export default function Sidebar({ }) {



    const { logout } = useAuth();


    const { modulesPermissions, userDataIsLoad } = useUser();




    const allowModules = useMemo(() => {

        if (!userDataIsLoad)
            return [];

        const allows = Object.keys(modulesPermissions).map(v => {
            return reversedModuleNameDictionary[v];
        })

        return allows

    }, [modulesPermissions, userDataIsLoad])


    logger.log("Renderizo SideBar", allowModules);


    function handleClick(e, moduleName) {
        if (allowModules.indexOf(moduleName) === -1) {
            e.preventDefault();
            alert.notifyInfo(`Usted no posee permisos para ${moduleName}`)
            return
        }
    }


    return (

        <>
            <aside className='absolute top-0 z-10 h-screen min-w-[300px]  rounded-ms 
        bg-[#1C2434] shadow-lg  overflow-y-hidden  flex flex-col
         trasition-position ease-in-out duration-700 
         md:static md:translate-x-0 -translate-x-full'>

                <div className='py-6 '>
                    <div className='flex justify-center items-center space-x-2  '>
                        <FireLogo />
                        <h1 className='text-[whitesmoke] text-3xl uppercase font-medium'>Pgosb</h1>
                    </div>
                </div>
                <div className='flex flex-col overflow-y-auto no-scrollbar'>

                    <nav className='w-full mt-8 px-4'>

                        <div className='space-y-3'>

                            <h2 className='px-2 uppercase text-[whitesmoke] opacity-60  text-sm mb-5 font-semibold'>Menu</h2>

                            <div className="space-y-4">
                                <SideBarLink link="/services" icon={<ServiceIcon />} name='Servicios' onClick={(e) => {
                                    handleClick(e, "Servicios")
                                }} />
                                <SideBarLink link="/users" icon={<UsersIcon />} name='Usuarios' onClick={(e) => {
                                    handleClick(e, "Usuarios")
                                }} />
                                <SideBarLink link="/roles" icon={<RolsIncon />} name='Roles' onClick={(e) => {
                                    handleClick(e, "Roles")
                                }} />
                                <SideBarLink link="/units" icon={<UnitIcon />} name='Unidades' onClick={(e) => {
                                    handleClick(e, "Unidades")
                                }} />
                                <SideBarLink link="/stations" icon={<StationIcon />} name='Estaciones' onClick={(e) => {
                                    handleClick(e, "Estaciones")
                                }} />
                                {/* <SideBarLink link="/assist" icon={<AmbulanceIcon />} name='Centros Asistenciales' /> */}
                                <SideBarLink link="/locations" icon={<LocationIcon />} name='Ubicaciones' onClick={(e) => {
                                    handleClick(e, "Ubicaciones")
                                }} />
                                {/* <SideBarLink link="/test" icon={<TestIcon />} name='Pruebas De Vistas' /> */}

                            </div>



                        </div>




                    </nav>
                </div>
                <button className="absolute  w-full px-6 top-[90%]" onClick={() => { logout() }}>

                    <div className=" py-3 flex  items-center space-x-4 hover:bg-[#1C6DB4] 
                hover:text-white rounded-md  px-2">
                        <LogOutIcon />
                        <p className="text-white text-xl">Cerrar Sesion</p>
                    </div>

                </button>



            </aside>

        </>


    )
}