import ArrowIcon from '../icons/ArrowIcon'


function Opt({ name, link }) {
    return <a href={link} className='text-md text-gray-400'>
        {name}
    </a>
}


function OptionsContainer({ opts }) {
    return (
        <>
        </>
    )
}


function ArrowButton({ active, onClick }) {
    return (
        <button onClick={onClick}>
            <ArrowIcon active={active} />
        </button>
    )
}

export default function SideBarLink({ icon = null, name = "", active = false, link = "", optLinks = [] }) {



    let realLink = link;


    const isSectionLink = optLinks?.length > 0;

    if (isSectionLink) {
        realLink = "";
    }



    return (
        <a onClick={(e) => {
            if (isSectionLink)
                e.preventDefault();
        }} href={link} className={`relative outline-none flex justify-between items-center px-3  py-2.5  
       ${active ? "bg-gray-700" : "bg-gray-800"}   bg-opacity-80 rounded-sm shadow-sm cursor-pointer hover:bg-gray-700`}>

            <div className="flex space-x-2 text-sm justify-center items-center">
                {icon}
                <h3 className="text-[whitesmoke] ">{name}</h3>
            </div>
            {isSectionLink && <ArrowButton />}
        </a>
    )
}