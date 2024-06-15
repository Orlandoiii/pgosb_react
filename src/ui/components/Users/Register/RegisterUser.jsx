import {  useRef } from "react";
import ModalContainer from "../../../core/modal/ModalContainer";
import Stepper from "../../Stepper/Stepper";
import InfoPersonalForm from "../Forms/InfoPersonalForm";
import InstitutionInfoForm from "../Forms/InstitutionInfoForm";
import SkillForm from "../Forms/SkillsForm";

const stepsObjects = [
    {
        title: "Registro Datos Basicos Usuario",
        content: <InfoPersonalForm />

    },
    {
        title: "Registro Datos Alergias y Habilidades",
        content: <SkillForm />
    },
    {
        title: "Registro Datos Institucionales",
        content: <InstitutionInfoForm />
    }
]


export function RegisterUser({ showModal, onClose, onFinish }) {

    const infoUserForm = useRef(null)

    function handleNextClick(e) {
        infoUserForm.current?.click()
    }

    return (
        <>
            <ModalContainer show={showModal} onClose={() => { if (onClose) onClose() }}
                title='Registro de Usuario'>
                <Stepper steps={stepsObjects} onClickNext={() => {
                    return true;
                }} onFinish={() => { if (onFinish) onFinish() }}>

                </Stepper>
            </ModalContainer>
        </>
    )
}
