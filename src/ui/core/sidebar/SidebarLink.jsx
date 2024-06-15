import { NavLink } from 'react-router-dom';
import ArrowIcon from '../icons/ArrowIcon'

function ArrowButton({ active, onClick }) {
    return (
        <button onClick={onClick}>
            <ArrowIcon active={active} />
        </button>
    )
}

export default function SideBarLink({ icon = null, name = "", link = "" }) {



    // let realLink = link;

    // const isSectionLink = optLinks?.length > 0;

    // if (isSectionLink) {
    //     realLink = "";
    // }

    return (
        <div className="">
            <NavLink to={link}>
                {({ isActive }) => (
                    <div className={`relative outline-none flex justify-between items-center px-3  py-2.5  
                    ${isActive ? "bg-gray-700" : ""}   bg-opacity-80 rounded-sm shadow-sm cursor-pointer hover:bg-gray-700`}>

                        <div className="flex space-x-2 text-md justify-center items-center">
                            {icon}
                            <h3 className="text-[whitesmoke] ">{name}</h3>
                        </div>
                        {/* {isSectionLink && <ArrowButton />} */}
                    </div>
                )}
            </NavLink>
        </div>
    )

}