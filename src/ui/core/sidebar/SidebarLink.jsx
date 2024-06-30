import { NavLink } from 'react-router-dom';


export default function SideBarLink({ icon = null, name = "", link = "" }) {

    return (
        <div>
            <NavLink to={link}>
                {({ isActive }) => (
                    <div className={`relative outline-none flex justify-between items-center px-3  py-2.5  
                    ${isActive ? "bg-[#2286DD]" : ""}   bg-opacity-80 rounded-sm shadow-sm cursor-pointer hover:bg-[#2286DD]`}>

                        <div className="flex space-x-2 text-md justify-center items-center">
                            {icon}
                            <h3 className="text-[whitesmoke] ">{name}</h3>
                        </div>
                    </div>
                )}
            </NavLink>
        </div>
    )

}