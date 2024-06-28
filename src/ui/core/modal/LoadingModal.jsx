import Logo from "../../../assets/logo_pgosb_fire.png"
import LinearDots from "../icons/LinearDots"

export default function LoadingModal({ open }) {

    console.log("Renderizo", open)
    return (

        <div className={`fixed  w-full h-full z-10 inset-0 flex justify-center items-center transition-colors
        ${open ? "visible bg-white/50" : "invisible"}`}
        >


            <div
                onClick={(e) => e.stopPropagation()}
                className={`
               flex justify-center items-center transition-all  min-h-[320px] min-w-[320px] md:min-h-[380px]  md:min-w-[460px]
              ${open ? "scale-100 opacity-100" : "scale-125 opacity-0"}
            `}
            >
                <LinearDots height={"100"} />
            </div>



        </div>
    )

}