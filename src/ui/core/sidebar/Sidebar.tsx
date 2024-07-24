import React, { useState } from 'react'
import SideBarLink from "./SidebarLink"
import ServiceIcon from "../icons/ServiceIcon"
import UsersIcon from "../icons/UsersIcon"
import RolsIncon from "../icons/RolsIcon"
import StationIcon from "../icons/StationIcon"
import UnitIcon from "../icons/UnitIcon"
import LocationIcon from "../icons/LocationIcon"
import logger from "../../../logic/Logger/logger"
import { LogOutIcon } from "../icons/LogOutIcon"
import { useAuth } from "../../components/Authentication/AuthProvider"
import { useUser } from "../context/UserDataContext"
import { useMemo } from "react"
import { reversedModuleNameDictionary } from "../../components/Roles/RolesPages"
import AlertController from "../alerts/AlertController"
import { BiArrowFromRight } from 'react-icons/bi'
import { useConfirmationModal } from '../modal/ModalConfirmation'
import FireLogo from '../logo/FireLogo'

const alert = new AlertController();

export default function Sidebar({ }) {


    const [collapse, setCollapse] = useState(false);
    const { logout } = useAuth();

    const { showConfirmationModal } = useConfirmationModal();


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


    function onClikcLogOut() {
        const respose = showConfirmationModal("Cerrar Sesion", "Esta segur@ que desea salir del sistema");

        respose.then(r => {
            if (!r)
                return;

            logout();
        })
    }

    function handleClick(e, moduleName) {
        if (allowModules.indexOf(moduleName) === -1) {
            e.preventDefault();
            alert.notifyInfo(`Usted no posee permisos para ${moduleName}`)
            return
        }
    }


    return (

        <>

            <aside className={`relative h-screen min-w-[90px]   
        bg-[#1C2434] shadow-xl  overflow-hidden  flex flex-col
         trasition-position ease-in-out duration-500 
         rounded-r-3xl ${collapse ? "" : " md:min-w-[300px]"}`}>


                <div className={`relative  py-6 ${collapse ? "" : "md:px-10"}`}>
                    <div className={`w-full flex justify-center  items-center  ${collapse ? "" : " md:justify-start md:space-x-2"}`}>
                        <div className='relative p-1 flex justify-center items-center'>
                            <div className="absolute w-full h-full border-1 rounded-full ring-1 ring-[#2286DD]  animate-pulse"></div>
                            <FireLogo />
                        </div>

                        <h1 className={`absolute text-[whitesmoke] 
                        ${collapse ? "" : "md:left-24  md:opacity-100"}
                        transition-all ease-in-out duration-500 opacity-0 left-0  
                        text-3xl uppercase font-medium`}>Gres</h1>

                        <button className={`absolute ${collapse ? "opacity-0" : " md:top-1/2  md:right-1 md:transform md:-translate-y-1/2"}  
                        p-1   hover:scale-125 rounded-lg  transition-all ease-in-out duration-500 `}
                            onClick={() => { setCollapse(o => !o) }}>
                            <div className={`${collapse ? "rotate-180 right-8" : "rotate-0 right-1"}`}>
                                <BiArrowFromRight color='whitesmoke' size={30} />
                            </div>
                        </button>


                    </div>


                </div>

                <div className='flex flex-col overflow-y-auto no-scrollbar'>

                    <nav className='w-full mt-8 px-4'>

                        <div className='space-y-3'>

                            <h2 className='px-2 uppercase text-[whitesmoke] text-center md:text-left opacity-60  text-md mb-5 font-semibold'>Menu</h2>

                            <div className="space-y-4">
                                <SideBarLink collpase={collapse} link="/services" icon={<ServiceIcon />} name='Servicios' onClick={(e) => {
                                    handleClick(e, "Servicios")
                                }} />
                                <SideBarLink collpase={collapse} link="/users" icon={<UsersIcon />} name='Usuarios' onClick={(e) => {
                                    handleClick(e, "Usuarios")
                                }} />
                                <SideBarLink collpase={collapse} link="/roles" icon={<RolsIncon />} name='Roles' onClick={(e) => {
                                    handleClick(e, "Roles")
                                }} />
                                <SideBarLink collpase={collapse} link="/units" icon={<UnitIcon />} name='Unidades' onClick={(e) => {
                                    handleClick(e, "Unidades")
                                }} />
                                <SideBarLink collpase={collapse} link="/stations" icon={<StationIcon />} name='Estaciones' onClick={(e) => {
                                    handleClick(e, "Estaciones")
                                }} />
                                {/* <SideBarLink link="/assist" icon={<AmbulanceIcon />} name='Centros Asistenciales' /> */}
                                <SideBarLink collpase={collapse} link="/locations" icon={<LocationIcon />} name='Ubicaciones' onClick={(e) => {
                                    handleClick(e, "Ubicaciones")
                                }} />
                            </div>
                        </div>

                    </nav>
                </div>

                <button className="absolute w-full   px-6 top-[90%]" onClick={() => { onClikcLogOut() }}>

                    <div className={`relative w-full py-3 flex justify-center   items-center space-x-4 hover:bg-[#1C6DB4] 
                hover:text-white rounded-xl  px-2 ${collapse ? "" : "md:justify-start"}`}>



                        <div className='w-[40px] h-[40px]'>
                            <LogOutIcon />
                        </div>

                        <p className={`absolute left-0 transition-all ease-in-out duration-500 
                        opacity-0 text-white text-xl ${collapse ? "" : " md:left-10 md:opacity-100 "}`}>Cerrar Sesion</p>

                    </div>

                </button>
            </aside>

        </>


    )
}