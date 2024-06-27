import { useRef, useState } from "react";
import ModalContainer from "../../../core/modal/ModalContainer";
import Stepper from "../../Stepper/Stepper";
import InfoPersonalForm from "../Forms/InfoPersonalForm";
import InstitutionInfoForm from "../Forms/InstitutionInfoForm";
import SkillForm from "../Forms/SkillsForm";
import Accordion from "../../../core/accordion/Accordion";
import Button from "../../../core/buttons/Button";
import LocationForm from "../../Locations/Forms/LocationForm";
import { UserFieldNameDictonary } from "./UserFieldDictonary"; import PDF from "./PDF"
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer'


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

    const [showPdf, setShowPdf] = useState(false)

    return (
        <>
            <ModalContainer show={showModal} onClose={() => { if (onClose) onClose() }}
                title='Registro de Usuario'>

                {!showAccordion && <Stepper initialStep={initialStep.current} data={userData}
                    steps={stepsObjects} onFinish={(d) => {
                        setUserData(d);
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

                            <PDFDownloadLink document={<PDF />} fileName="registeruser.pdf">
                                {({ loading, url, error, blob }) =>
                                    loading ? (
                                        <button  >Cargando documento...</button>
                                    ) : (
                                        <div className="">
                                            <button>Descargar PDF</button>

                                            <button onClick={(e) => { setShowPdf(true) }}>Ver Previo</button>
                                        </div>

                                    )
                                }
                            </PDFDownloadLink>

                            <ModalContainer show={showPdf} onClose={() => { setShowPdf(false) }} title="PDF">
                                <PDFViewer width={600} height={600}>
                                    <PDF />
                                </PDFViewer>
                            </ModalContainer>


                            <Button>Confirmar</Button>
                        </div>

                    </div>
                }

            </ModalContainer>

        </>
    )
}
