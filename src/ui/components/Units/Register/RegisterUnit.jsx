import { useRef, useState } from "react";
import ModalContainer from "../../../core/modal/ModalContainer";
import Stepper from "../../Stepper/Stepper";

import Accordion from "../../../core/accordion/Accordion";
import Button from "../../../core/buttons/Button";
import BasicInfoForm from "../Forms/BasicInfoForm";
import DataForm from "../Forms/DataForm";
import { UnitsFieldNameDictonary } from "./UnitsFieldDictonary";

const stepsObjects = [
    {
        title: "Datos Básicos",
        content: <BasicInfoForm />,

    },
    {
        title: "Características",
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
                title='Registro de Unidad'>
                {!showAccordion && <Stepper initialStep={initialStep.current} data={unitData} steps={stepsObjects} onFinish={(d) => {
                    setUnitData(d);
                    setShowAccordion(true);
                }} />}
                {showAccordion && unitData &&
                    <div className="flex flex-col space-y-4">
                        {unitData.map((v) => {
                            return <Accordion title={v.title} value={v.data} key={v.title} configNames={UnitsFieldNameDictonary}/>
                        })}

                        <div className="flex justify-between">

                            <Button colorType="bg-rose-700" hoverColor="hover:bg-rose-900" onClick={() => {
                                initialStep.current = stepsObjects.length - 1
                                setShowAccordion(false);
                            }}>Regresar</Button>

                            <Button>Confirmar</Button>
                        </div>

                    </div>
                }
            </ModalContainer>

        </>
    )
}
