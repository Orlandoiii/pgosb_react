import { useRef, useState } from "react";
import ModalContainer from "../../../core/modal/ModalContainer";
import Stepper from "../../Stepper/Stepper";
import Accordion from "../../../core/accordion/Accordion";
import Button from "../../../core/buttons/Button";
import LocationForm from "../../Locations/Forms/LocationForm";
import { HealthcareFieldDictonary } from "./HealthcareFieldDictonary";
import HealthcareCenterForm from "../Forms/HealthcareCenterForm";
import { useConfirmationModal } from "../../../core/modal/ModalConfirmation";
import LoadingModal from "../../../core/modal/LoadingModal";
import AlertController from "../../../core/alerts/AlertController";

const alertController = new AlertController();

const stepsObjects = [
    {
        title: "Datos Básicos",
        content: <HealthcareCenterForm />,

    },
    {
        title: "Ubicación",
        content: <LocationForm />
    }
]


export function RegisterHealthcareCenter({ showModal, onClose }) {

    const [userData, setUserData] = useState([]);


    const [showAccordion, setShowAccordion] = useState(false)


    const initialStep = useRef(0);

    const { showConfirmationModal } = useConfirmationModal();

    const [openLoadingModal, setOpenLoadingModal] = useState(false);

    function handleAccept() {
        let result = showConfirmationModal("Registro de Centro Asistencial", "Esta seguro que desea registrar este centro asistencial con los datos antes mostrados ?");
        result.then(r => {
            if (!r)
                return;

            setShowAccordion(false);
            onClose();
            initialStep.current = 0;

            setOpenLoadingModal(true);
            setTimeout(() => {

                setOpenLoadingModal(false);
                alertController.notifySuccess("Centro Asistencial guardada exitosamente");

            }, 1000)


        })
    }


    return (
        <>
            <ModalContainer show={showModal} onClose={() => { if (onClose) onClose() }}
                title='Registro Centro Asistencial'>

                {!showAccordion && <Stepper initialStep={initialStep.current} data={userData} steps={stepsObjects} onFinish={(d) => {
                    setUserData(d);
                    setShowAccordion(true);
                }} />}
                {showAccordion && userData &&
                    <div className="flex flex-col space-y-4">
                        {userData.map((v) => {
                            return <Accordion title={v.title} value={v.data} key={v.title} configNames={HealthcareFieldDictonary} />
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

            <LoadingModal open={openLoadingModal} />

        </>
    )
}
