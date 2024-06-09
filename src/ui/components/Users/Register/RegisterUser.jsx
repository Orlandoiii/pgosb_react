import { useState, useRef } from "react";
import Button from "../../../core/buttons/Button";
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


export function RegisterUser({ }) {

    const [openModel, setOpenModal] = useState(false);



    const infoUserForm = useRef(null)

    function handleNextClick(e) {
        infoUserForm.current?.click()
    }

    return (
        <>

            <Button onClick={(e) => { setOpenModal(o => !o) }}>Click Me</Button>




            <ModalContainer show={openModel} onClose={() => setOpenModal(false)}
                title='Registro de Usuario'>
                <Stepper steps={stepsObjects} onClickNext={() => {
                    return true;
                }} onFinish={() => setOpenModal(false)}>

                </Stepper>
            </ModalContainer>
        </>
    )
}
