import { useRef, useState } from "react";

import { ModalStepPage, useModalSidePage } from "../../../core/modal/ModalStepPage";



function RegisterRegionContent({ }) {

    const { close } = useModalSidePage();

    return <div className="">
        TABLA TEST
        <button onClick={() => close()}>Close</button>
    </div>
}


export function RegisterRegion({ }) {

    const [show, setShow] = useState(false);

  


    return (
        <>
            <ModalStepPage show={show} onClose={setShow(false)}>
                <RegisterRegionContent />
            </ModalStepPage>

        </>
    )
}
