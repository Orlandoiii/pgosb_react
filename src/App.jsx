import { useRef, useState } from 'react'
import Button from './ui/core/buttons/Button'
import InputFloatLabel from './ui/core/inputs/InputFloatLabel'
import Input from './ui/core/inputs/Input'
import FingerPrint from './ui/practice/Fingerprint'
import ToggleColorTheme from './ui/core/buttons/ToggleColorTheme'
import { Select, SelectWithSearch } from './ui/core/inputs/Selects'
import { useForm } from 'react-hook-form'
import { DevTool } from '@hookform/devtools'
import FireFigther from "./assets/logo-3.png"
import ShieldLogo from './ui/core/logo/ShieldLogo'
import LoginForm from './ui/components/Authentication/LoginForm'
import ModalContainer from './ui/core/modal/ModalContainer'
import Stepper from './ui/components/Stepper/Stepper'
import InfoPersonalForm from './ui/components/Users/Forms/InfoPersonalForm'
import AddInput from './ui/core/inputs/AddInput'
import SkillForm from './ui/components/Users/Forms/SkillsForm'
import InstitutionInfoForm from './ui/components/Users/Forms/InstitutionInfoForm'
import Toggle from './ui/core/buttons/Toggle'
function TestComponent({ }) {
    return <div className="w-10  text-center flex"></div>
}


function TestingStuff({ }) {
    return (<>

        <div className="relative w-full max-w-[400px] h-full p-8 space-y-5 bg-inherit">

            <div className='absolute top-1 right-1 bg-inherit'>
                <ToggleColorTheme />

            </div>
            <div>
                <Input
                    label={'Core Input Label'}
                    value={value}
                    onChange={(e) => {
                        setValue(e.target.value)
                    }}
                />
            </div>


            <InputFloatLabel
                label="Valor del Label Para Probar"
                value={inpValue}
                onChange={setInpValue}
            />


            <Select label="Test" options={["Opcion 1", "opcion 2"]} value={"Opcion 1"} />

            <SelectWithSearch label="Test" options={["Opcion 1", "opcion 2"]} value={"Opcion 1"} />

            <Button onClick={() => {

                const body = document.querySelector("body");
                body.classList.toggle("dark");



            }}>Toggle Dark Mode</Button>


            <div className="p-6 space-y-2">
                <p>DeepLink</p>
                <a href='http://pruebas.local.sypago.net/login/verify/123456AF88' onClickCapture={(e) => {

                }} className='block py-2 px-1 bg-sky-600 ring-1 ring-offset-1 
    ring-offset-violet-400 rounded-md cursor-pointer text-center text-[whitesmoke]'>Click Here To Test</a>
            </div>

            <div className="">
                <FingerPrint />
            </div>


        </div>

    </>)
}


let renderCount = 0;

function FormValidationTest({ }) {

    const { register, handleSubmit, control, formState } = useForm({ mode: "onChange" });

    const { errors, isSubmitted } = formState;


    const [selectValue, setSelectValue] = useState("test")




    const [selectValue2, setSelectValue2] = useState("test")


    const selectErr = useRef(false);

    const [value, setValue] = useState("TestLol");

    console.log(errors);

    console.log(isSubmitted);

    const [items, setItems] = useState([]);


    renderCount++;

    return (
        <>


            <form noValidate className='space-y-3 transition-all duration-1000 bg-white w-full' onSubmit={handleSubmit((data) => {
                console.log(data);
                if (selectErr) {
                    console.log("Is on err");
                    return;
                }
            })}>

                {/* <Input register={register}
                    validationRules={{
                        required: "Es campo es requerido",
                        minLength: { value: 5, message: "El campo debe superar 5" },
                        maxLength: { value: 10, message: "El campo no debe superar 10" }
                    }}
                    label="First Name" useDotLabel={true} inputName="firstName" useStrongErrColor={isSubmitted}
                    errMessage={errors.firstName?.message} />

                <Input label="Last Name" inputName="lastName" useDotLabel={true} />

                <Input label="Email" useDotLabel={true} />

                <InputFloatLabel label={"Password"} value={value} onChangeEvent={(e) => { setValue(e.target.value) }} />

                <InputFloatLabel label="Test" inputName="test" register={register} validationRules={{
                    required: "Es campo es requerido",
                    minLength: { value: 5, message: "El campo debe superar 5" },
                    maxLength: { value: 10, message: "El campo no debe superar 10" }

                }}
                    useStrongErrColor={isSubmitted}
                    errMessage={errors.test?.message} /> */}


                {/* <AddInputFloat label="Test" inputName="test" register={register} validationRules={{
                    required: "Es campo es requerido",
                    minLength: { value: 5, message: "El campo debe superar 5" },
                    maxLength: { value: 10, message: "El campo no debe superar 10" }

                }}
                    useStrongErrColor={isSubmitted}
                    errMessage={errors.test?.message} /> */}

                <AddInput label="Habilidad" inputName="skill"
                    items={items}
                    setItems={setItems}
                    useDotLabel={true}
                    useStrongErrColor={isSubmitted}
                    errMessage={errors.test?.message} />

                {/* <Select useFloatingLabel={true} label={"Selec Label"} options={["test", "test-2"]} value={selectValue} onChange={(v) => { setSelectValue(v) }} />


                <SelectWithSearch
                    onError={(isErr) => { selectErr.current = isErr }}
                    useFloatingLabel={true}
                    useStrongErrColor={isSubmitted}
                    label={"Select With Search"}
                    options={["test", "test-2"]}
                    value={selectValue2} onChange={(v) => { setSelectValue2(v) }} /> */}

                <Button>Submit</Button>




            </form>

            <DevTool control={control} />
        </>



    )
}

const steps = [
    {
        title: "Titulo Uno tu sabes lo hacemos largo"
    },
    {
        title: "Titulo Dos tu sabes lo hacemos largo"
    },

    {
        title: "Titulo Tres tu sabes lo hacemos largo"
    },
]



function LoginTestEffect() {
    return (
        <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
            <div className="relative py-3 sm:max-w-xl sm:mx-auto">
                <div
                    className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-sky-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl">
                </div>

                <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">



                </div>
            </div>
        </div>
    )
}

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


function StepperTest({ }) {

    const [openModel, setOpenModal] = useState(false);



    const infoUserForm = useRef(null)

    function handleNextClick(e) {
        infoUserForm.current?.click()
    }

    return (
        <>

            <Button onClick={(e) => { setOpenModal(o => !o) }}>Click Me</Button>




            <ModalContainer show={openModel} onClose={() => setOpenModal(false)} title='Registro de Usuario'>
                <Stepper steps={stepsObjects} onClickNext={() => {
                    return true;
                }} onFinish={() => setOpenModal(false)}>

                </Stepper>
            </ModalContainer>
        </>
    )
}

function App() {



    return (
        <>
            <div className="bg-[#F1F5F9] w-full h-full">


                <div className='max-w-[1900px]'>

                    <div className='relative flex w-full h-screen overflow-hidden'>


                        <aside className='absolute top-0 z-10 h-screen w-[17rem] rounded-ms 
                          overflow-y-hidden bg-[#1C2434] shadow-lg 
                          trasition-position ease-in-out duration-500 
                          md:static md:translate-x-0 -translate-x-full '>
                        </aside>

                        <div className='w-full overflow-y-auto overflow-x-hidden'>

                            <nav className='sticky top-0 flex w-full h-[70px] 
                            bg-[whitesmoke] shadow-lg rounded-sm'>
                                TEST
                            </nav>

                            <main className='overflow-auto w-full h-auto'>
                                  
                                  <div className='w-20 h-20 border border-black'>

                                  </div>

                                  <div className='h-[900px] w-20'>

                                  </div>

                            </main>

                        </div>

                    </div>


                </div>

            </div>

            <div id="modal-root"></div>
        </>
    )
}

export default App
