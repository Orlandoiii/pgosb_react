import { useState } from "react";
import LoadSwipe from "./LoadSwipe";
import Button from "../core/buttons/Button";

export default function SycomComponent({ }) {

    const [openSwipe, setOpenSwipe] = useState(false);

    return (
        <div className="flex flex-col justify-center items-center mx-auto bg-[whitesmoke] p-4 mt-2 max-w-[600px] border border-gray space-y-2">

            <h2 className="">
                Link para probar SyPago
            </h2>


            <a href="https://desarrollo.sypago.net/checkout/free/12345789"
                className="p-2 bg-sky-400 text-white rounded-sm">Click Me</a>


            <button onClick={(e) => {
                setOpenSwipe(o => !o)
            }} className="bg-sky-400 p-2 rounded-sm text-white">Click To Open Swipe</button>

            <LoadSwipe show={openSwipe} />

        </div>
    )
}