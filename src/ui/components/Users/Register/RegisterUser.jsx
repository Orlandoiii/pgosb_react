import { useRef } from "react";
import ModalContainer from "../../../core/modal/ModalContainer";
import Stepper from "../../Stepper/Stepper";
import InfoPersonalForm from "../Forms/InfoPersonalForm";
import InstitutionInfoForm from "../Forms/InstitutionInfoForm";
import SkillForm from "../Forms/SkillsForm";
import Accordion from "../../../core/accordion/Accordion";
import Button from "../../../core/buttons/Button";
import LocationForm from "../../Locations/Forms/LocationForm";
import logger from "../../../../logic/Logger/logger";



const stepsObjects = [
    {
        title: "Datos Básicos",
        content: <InfoPersonalForm />,

    },
    {
        title: "Ubicación",
        content: <LocationForm />
    },
    {
        title: "Características",
        content: <SkillForm />,

    },
    {
        title: "Datos Institucionales",
        content: <InstitutionInfoForm />
    }
]


export function RegisterUser({ showModal, onClose, showAccordion, setShowAccordion,
    userData, onSetUserData, title, onSubmit }) {


    const initialStep = useRef(0);


    function resetData() {

        initialStep.current = 0;
        onSetUserData([]);
        setShowAccordion(false);
    }

    function close() {
        if (onClose) {
            onClose();
            resetData();
        }
    }

    function onFinish(d) {
        onSetUserData(d);
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

                {!showAccordion && <Stepper initialStep={initialStep.current} data={userData}
                    onClose={close}
                    steps={stepsObjects}
                    onFinish={onFinish} />}

                {showAccordion && userData &&
                    <div className="flex flex-col space-y-1">

                        {userData.map((v) => {
                            return <Accordion title={v.title} value={v.data} key={v.title} />
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
