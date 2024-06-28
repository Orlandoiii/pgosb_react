import { useState } from "react"





function DragBox({ children, open, onClose }) {

    return (
        <div className={`fixed inset-0  w-full h-full bg-neutral-950   transition-all duration-500 rounded-t-3xl`} >



            < div className="absolute top-0 left-0 w-full h-[40px] bg-black  rounded-t-full">


            </div >

            <div className="w-full h-auto mt-[40px] mx-auto border border-white overflow-auto">

            </div>


        </div >
    )

}

export default function DragBoxComponent({ }) {
    const [open, setOpen] = useState(false)

    return (
        <>
            <div className="fixed inset-0 w-full h-full bg-black/80 flex justify-center items-center">
                <button className="p-4 bg-sky-600 text-[whitesmoke] rounded-md shadow-md" onClick={() => { setOpen(true) }}>Open Box</button>
            </div>
            {/* <DragBox open={open} /> */}
        </>


    )
}