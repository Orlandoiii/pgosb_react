import SideBarLink from "./SidebarLink"
import TailAdminLogo from "../logo/TailAdminLogo"
import ServiceIcon from "../icons/ServiceIcon"
import UsersIcon from "../icons/UsersIcon"
import RolsIncon from "../icons/RolsIcon"
import StationIcon from "../icons/StationIcon"
import UnitIcon from "../icons/UnitIcon"
import LocationIcon from "../icons/LocationIcon"
import AmbulanceIcon from "../icons/AmbulanceIcon"
import TestIcon from "../icons/TestIcon"
import FireLogo from "../logo/FireLogo"

export default function Sidebar({ }) {
    return (

        <aside className='absolute top-0 z-10 h-screen min-w-[280px]  rounded-ms 
        bg-[#1C2434] shadow-lg  overflow-y-hidden  flex flex-col
         trasition-position ease-in-out duration-500 
         md:static md:translate-x-0 -translate-x-full'>

            <div className='py-6 '>
                <div className='flex justify-center items-center space-x-2  '>
                    <FireLogo />
                    <h1 className='text-[whitesmoke] text-3xl uppercase font-medium'>Pgosb</h1>
                </div>
            </div>
            <div className='flex flex-col overflow-y-auto no-scrollbar'>

                <nav className='w-full  mt-8 px-4'>

                    <div className='space-y-3'>

                        <h2 className='px-2 uppercase text-[whitesmoke] opacity-60  text-sm mb-5 font-semibold'>Menu</h2>

                        <div className="space-y-4">
                            <SideBarLink link="/users" icon={<UsersIcon />} name='Usuarios' />
                            <SideBarLink link="/services" icon={<ServiceIcon />} name='Servicios' />
                            <SideBarLink link="/roles" icon={<RolsIncon />} name='Roles' />
                            <SideBarLink link="/stations" icon={<StationIcon />} name='Estaciones' />
                            <SideBarLink link="/units" icon={<UnitIcon />} name='Unidades' />
                            <SideBarLink link="/locations" icon={<LocationIcon />} name='Locaciones' />
                            <SideBarLink link="/assist" icon={<AmbulanceIcon />} name='Centros Asistenciales' />
                            <SideBarLink link="/test" icon={<TestIcon />} name='Pruebas De Vistas' />

                        </div>
                    </div>


                </nav>
            </div>
        </aside>

    )
}