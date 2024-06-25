import { useRef, useState } from "react";
import ModalContainer from "../../../core/modal/ModalContainer";
import Stepper from "../../Stepper/Stepper";
import Accordion from "../../../core/accordion/Accordion";
import Button from "../../../core/buttons/Button";
import LocationForm from "../../Locations/Forms/LocationForm";
import StationForm from "../Forms/StationForm";
import { StationFieldNameDictonary } from "./StationFieldDictonary";

const stepsObjects = [
    {
        title: "Datos Básicos",
        content: <StationForm />,

    },
    {
        title: "Ubicación",
        content: <LocationForm />
    }
]


export function RegisterStation({ showModal, onClose }) {

    const [userData, setUserData] = useState([]);


    const [showAccordion, setShowAccordion] = useState(false)


    const initialStep = useRef(0);

    return (
        <>
            <ModalContainer show={showModal} onClose={() => { if (onClose) onClose() }}
                title='Registro de Estación'>

                {!showAccordion && <Stepper initialStep={initialStep.current} data={userData} steps={stepsObjects} onFinish={(d) => {
                    setUserData(d);
                    setShowAccordion(true);
                }} />}
                {showAccordion && userData &&
                    <div className="flex flex-col space-y-4">
                        {userData.map((v) => {
                            return <Accordion title={v.title} value={v.data} key={v.title} configNames={StationFieldNameDictonary} />
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
