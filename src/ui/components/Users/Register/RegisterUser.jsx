import { useRef, useState } from "react";
import ModalContainer from "../../../core/modal/ModalContainer";
import Stepper from "../../Stepper/Stepper";
import InfoPersonalForm from "../Forms/InfoPersonalForm";
import InstitutionInfoForm from "../Forms/InstitutionInfoForm";
import SkillForm from "../Forms/SkillsForm";
import Accordion from "../../../core/accordion/Accordion";
import Button from "../../../core/buttons/Button";
import LocationForm from "../../Locations/Forms/LocationForm";


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


export function RegisterUser({ showModal, onClose }) {

    const [userData, setUserData] = useState([]);


    const [showAccordion, setShowAccordion] = useState(false)


    const initialStep = useRef(0);

    return (
        <>
            <ModalContainer show={showModal} onClose={() => { if (onClose) onClose() }}
                title='Registro de Usuario'>

                {!showAccordion && <Stepper initialStep={initialStep.current} data={userData} steps={stepsObjects} onFinish={(d) => {
                    setUserData(d);
                    setShowAccordion(true);
                }} />}
                {showAccordion && userData &&
                    <div className="flex flex-col space-y-4">
                        {userData.map((v) => {
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
