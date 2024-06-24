import { useRef, useState } from "react";
import ModalContainer from "../../../core/modal/ModalContainer";
import Stepper from "../../Stepper/Stepper";

import Accordion from "../../../core/accordion/Accordion";
import Button from "../../../core/buttons/Button";
import BasicInfoForm from "../Forms/BasicInfoForm";
import DataForm from "../Forms/DataForm";


const stepsObjects = [
    {
        title: "Datos Básicos del Vehículo",
        content: <BasicInfoForm />,

    },
    {
        title: "Características del Vehículo",
        content: <DataForm />,
    }
]


export function RegisterUnit({ showModal, onClose }) {

    const [unitData, setUnitData] = useState([]);


    const [showAccordion, setShowAccordion] = useState(false)


    const initialStep = useRef(0);

    return (
        <>
            <ModalContainer show={showModal} onClose={() => { if (onClose) onClose() }}
                title='Registro de Vehículo'>
                {!showAccordion && <Stepper initialStep={initialStep.current} data={unitData} steps={stepsObjects} onFinish={(d) => {
                    setUnitData(d);
                    setShowAccordion(true);
                }} />}
                {showAccordion && unitData &&
                    <div className="flex flex-col space-y-4">
                        {unitData.map((v) => {
                            return <Accordion title={v.title} value={v.data} key={v.title} />
                        })}

                        <div className="flex justify-between">

                            <Button colorType="bg-rose-700" hoverColor="hover:bg-rose-900" onClick={() => {
                                initialStep.current = stepsObjects.length - 1
                                setShowAccordion(false);
                            }}>Cancelar</Button>

                            <Button>Aceptar</Button>
                        </div>

                    </div>
                }
            </ModalContainer>

        </>
    )
}
