import { useRef, useState } from "react";
import ModalContainer from "../../../core/modal/ModalContainer";
import Stepper from "../../Stepper/Stepper";
import InfoPersonalForm from "../Forms/InfoPersonalForm";
import InstitutionInfoForm from "../Forms/InstitutionInfoForm";
import SkillForm from "../Forms/SkillsForm";
import Accordion from "../../../core/accordion/Accordion";
import Button from "../../../core/buttons/Button";
import LocationForm from "../../Locations/Forms/LocationForm";
import { UserFieldNameDictonary } from "./UserFieldDictonary";
import PDF from "./PDF"
import { useConfirmationModal } from "../../../core/modal/ModalConfirmation";
import AlertController from "../../../core/alerts/AlertController";
import LoadingModal, { useLoadModal } from "../../../core/modal/LoadingModal";
import logger from "../../../../logic/Logger/logger";
import { useConfig } from "../../../../logic/Config/ConfigContext";
import axios from "axios";


const alertController = new AlertController();

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


export function RegisterUser({ showModal, onClose, onSubmit }) {

    const [userData, setUserData] = useState([]);


    const [showAccordion, setShowAccordion] = useState(false)


    const initialStep = useRef(0);



    const { showConfirmationModal } = useConfirmationModal();

    const { openLoadModal, closeLoadModal } = useLoadModal();


    const { config } = useConfig();


    function resetData() {
        setUserData([]);
        setShowAccordion(false);
        initialStep.current = 0;
    }

    function close() {
        if (onClose) {
            onClose();
            resetData();
        }
    }

    function handleAccept() {

        logger.log("Handle Accept");

        let result = showConfirmationModal("Registro de Usuario",
            "Esta seguro que desea registrar el usuario con los datos antes mostrados ?");


        result.then(r => {
            if (!r)
                return;


            openLoadModal();
            close();
            const mergedData = userData.reduce((acc, obj) => {
                return { ...acc, ...obj.data };
            }, {});

            axios.post(`${config.back_url}/api/v1/user/create`, mergedData).then(r => {
                closeLoadModal()
                logger.info("USER CREATE:", r)
                if (r.status >= 200 && r.status <= 299) {
                    alertController.notifySuccess("Usuario guardado Exitosamente")
                }
            }).catch(err => {
                closeLoadModal();
                logger.error("USER CREATE ERROR", err);
                alertController.notifyError("No se pudo guardar el usuario");
            });

        })
    }

    return (
        <>
            <ModalContainer show={showModal} onClose={() => {
                if (onClose) {
                    onClose();
                    resetData();
                }
            }}
                title='Registro de Usuario'>

                {!showAccordion && <Stepper initialStep={initialStep.current} data={userData}

                    onClose={close}
                    steps={stepsObjects}
                    onFinish={(d) => {
                        setUserData(d);
                        logger.log("Data al final del Stepper", d);
                        setShowAccordion(true);
                    }} />}
                {showAccordion && userData &&
                    <div className="flex flex-col space-y-1">
                        {userData.map((v) => {
                            return <Accordion title={v.title} value={v.data} key={v.title} configNames={UserFieldNameDictonary} />
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
