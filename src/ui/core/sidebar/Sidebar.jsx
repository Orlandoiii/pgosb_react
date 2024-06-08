import SideBarLink from "./SidebarLink"
import TailAdminLogo from "../logo/TailAdminLogo"
import ServiceIcon from "../icons/ServiceIcon"
import UsersIcon from "../icons/UsersIcon"
import RolsIncon from "../icons/RolsIcon"
import StationIcon from "../icons/StationIcon"
import UnitIcon from "../icons/UnitIcon"
import LocationIcon from "../icons/LocationIcon"
import AmbulanceIcon from "../icons/AmbulanceIcon"

export default function Sidebar({ }) {
    return (

        <aside className='absolute top-0 z-10 h-screen min-w-[280px]  rounded-ms 
        bg-[#1C2434] shadow-lg  overflow-y-hidden  flex flex-col
         trasition-position ease-in-out duration-500 
         md:static md:translate-x-0 -translate-x-full'>

            <div className='py-6 pl-6'>
                <div className='flex space-x-2'>
                    <TailAdminLogo />
                    <h1 className='text-[whitesmoke] text-3xl uppercase font-medium'>Pgosb</h1>
                </div>
            </div>



            <div className='flex flex-col overflow-y-auto no-scrollbar'>

                <nav className='w-full  mt-8 px-4'>

                    <div className='space-y-3'>
                        <h2 className='px-2 uppercase text-[whitesmoke] opacity-60  text-sm mb-5 font-semibold'>Menu</h2>
                        <SideBarLink icon={<UsersIcon />} name='Usuarios' />
                        <SideBarLink icon={<ServiceIcon />} name='Servicios' />
                        <SideBarLink icon={<RolsIncon />} name='Roles' />
                        <SideBarLink icon={<StationIcon />} name='Estaciones' />
                        <SideBarLink icon={<UnitIcon />} name='Unidades' />
                        <SideBarLink icon={<LocationIcon />} name='Locaciones' />
                        <SideBarLink icon={<AmbulanceIcon />} name='Centros Asistenciales' />
                    </div>
                </nav>
            </div>
        </aside>

    )
}