import { useRef } from "react";
import ModalContainer from "../../../core/modal/ModalContainer";
import Stepper from "../../Stepper/Stepper";

import Accordion from "../../../core/accordion/Accordion";
import Button from "../../../core/buttons/Button";
import BasicInfoForm from "../Forms/BasicInfoForm";
import DataForm from "../Forms/DataForm";
import logger from "../../../../logic/Logger/logger";



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


export default function RegisterUnit({ showModal, onClose, showAccordion, setShowAccordion,
    unitData, onSetUnitData, title, configNames, onSubmit }) {


    const initialStep = useRef(0);


    function resetData() {

        initialStep.current = 0;
        onSetUnitData([]);
        setShowAccordion(false);
    }

    function close() {
        if (onClose) {
            onClose();
            resetData();
        }
    }

    function onFinish(d) {
        onSetUnitData(d);
        logger.log("Data al final del Stepper", d);
        setShowAccordion(true);
    }

    function handleAccept() {

        logger.log("Handle Accept");
        initialStep.current = 0;
        if (onSubmit)
            onSubmit()
    }

    return (
        <>
            <ModalContainer show={showModal} onClose={close}
                title={title}>

                {!showAccordion && <Stepper initialStep={initialStep.current} data={unitData}
                    onClose={close}
                    steps={stepsObjects}
                    onFinish={onFinish} />}

                {showAccordion && unitData &&
                    <div className="flex flex-col space-y-1">

                        {unitData.map((v) => {
                            return <Accordion title={v.title} value={v.data} key={v.title} configNames={configNames} />
                        })}



                        <div className="flex justify-between">
                            <Button colorType="bg-rose-700" hoverColor="hover:bg-rose-900" onClick={() => {
                                initialStep.current = stepsObjects.length - 1
                                setShowAccordion(false);
                            }}>Regresar</Button>

                            <Button onClick={handleAccept}>Confirmar</Button>
                        </div>

                    </div>
                }

            </ModalContainer>


        </>
    )
}

