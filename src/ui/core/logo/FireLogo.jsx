import FireLogoImg from "../../../assets/logo_pgosb_fire.png"


export default function FireLogo({ width = "w-[45px]", height = "h-[45px]", textColor = "text-black", space = "",
    bgColor = "bg-[whitesmoke]" }) {
    return (
        <div className={`${width} ${height}  rounded-full ${bgColor}`}>
            <img className='m-0 p-0' src={FireLogoImg} alt='fire figther logo'></img>
        </div>
    )
}