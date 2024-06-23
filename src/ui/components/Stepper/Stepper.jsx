import { createContext, useEffect, useRef, useState } from "react";
import logger from "../../../logic/Logger/logger";


function PrevIcon({ }) {
    return (
        <svg className="w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd">
            </path>
        </svg>
    )
}

function NextIcon({ }) {
    return (
        <svg className="w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd">
            </path>
        </svg>
    )
}


function NextButton({ children }) {
    return (
        <>

            {/* <div className="relative min-w-[90px]"> */}
            <p className=" absolute transition-all ease-in-out 
            duration-300 top-1/2 left-1/2 transform  -translate-x-1/2  -translate-y-1/2  text-sm group-hover:translate-x-0 group-hover:left-2">{children}</p>
            <div className="absolute transition-all ease-in-out duration-300 
            opacity-0 top-1/2 right-1/2 transform  -translate-x-1/2  -translate-y-1/2 group-hover:translate-x-0 group-hover:right-2 group-hover:opacity-100">
                <NextIcon />
            </div>

            {/* </div> */}

        </>
    )
}

function PrevButton({ children }) {
    return (
        <>
            <div className="absolute transition-all ease-in-out duration-300 
            opacity-0 top-1/2 left-1/2 transform  -translate-x-1/2  -translate-y-1/2 group-hover:translate-x-0 group-hover:left-2 group-hover:opacity-100">
                <PrevIcon />
            </div>
            <p className=" absolute transition-all ease-in-out 
            duration-300 top-1/2 right-0 transform  -translate-x-1/2  -translate-y-1/2  text-sm group-hover:translate-x-0 group-hover:right-2">{children}</p>
        </>
    )
}

function StepButton({ children, nextButton = true, onClick }) {
    return (

        <button type="button"
            onClick={(e) => { if (onClick) onClick(e) }}
            className={`group relative min-w-[100px] min-h-[40px] transition-all ease-in-out duration-300 bg-slate-700 text-white block
          ${nextButton ? "border-l rounded-r-md" : " rounded-l-md border-r"} 
                border-gray-100  hover:bg-[#3C50E0] 
                hover:text-white`} >

            {nextButton ?
                <NextButton>
                    {children}
                </NextButton> :
                <PrevButton>
                    {children}
                </PrevButton>}

        </button>
    )
}

function StepTrackerItem({ title, number, isActive = false, isCompleted = false }) {



    return (
        <li className={`md:w-full md:max-w-[300px] ${isActive ? "shadow-xl" : "shadow-sm"} md:min-w-[120px] transform transition-all ease-in-out duration-300 
        ${isActive ? " scale-110" : "scale-95"}`}>

            <div className={`relative flex items-center ${isActive ? "font-semibold" : ""}  
            px-1 py-5 w-full    ${isCompleted ? 'bg-indigo-200' : 'bg-slate-200'}`}>

                <span className={`absolute top-1/2 transform -translate-y-1/2 left-0 w-[0.10rem] h-full  rounded-lg ${isCompleted ? "bg-[#3C50E0]" : "bg-slate-400"}`} />

                <span className={`w-[30px] h-[30px] ${isCompleted ? 'bg-[#3C50E0] text-white' : 'bg-[whitesmoke] text-slate-700'}
                   rounded-full flex justify-center items-center 
                   mr-3 text-sm lg:w-[35px] lg:h-[35px] `}>{number}</span>

                <h4 className={`text-center text-md ${isCompleted ? 'text-indigo-600' : ''}`}>{title}</h4>

            </div>




        </li>
    )

}

function StepperTracker({ steps, stepCounter = 0 }) {
    return (
        <ol className="w-full space-y-4  md:flex md:flex-row md:items-center  md:justify-center
            md:space-y-0 md:space-x-4">
            {steps.map((st, idx) => {
                return (
                    <StepTrackerItem title={st.title}
                        key={st.title} isActive={idx == stepCounter}
                        isCompleted={idx < stepCounter} number={`${0}${idx}`} />
                )
            })}
        </ol>
    )
}


export const StepContext = createContext({
    stepCounter: 0,
    currentStep: null,
    clickNextRef: null,
    currentData: null,
    Next: () => { }
});

export default function Stepper({ steps, onFinish, onClose, initialStep = 0, data = [] }) {



    const [stepCounter, setStepCounter] = useState(initialStep);

    const [currentStep, setCurrentStep] = useState(steps[stepCounter]);

    const stepsData = useRef(data)

    const clickNextRef = useRef(null)

    function Next(data) {

        logger.log("En Next Function Data:", data);

        stepsData.current[stepCounter] = {
            title: currentStep.title,
            data: data,
        };

        if (stepCounter == steps.length - 1) {

            if (onFinish)
                onFinish(stepsData.current);

            return;
        }

        setStepCounter(stepCounter + 1)
        setCurrentStep(steps[stepCounter + 1])
    }

    function Previous() {

        logger.log("En Previous Function");


        if (stepCounter == 0) {

            if (onClose)
                onClose();

            return;

        }

        setStepCounter(stepCounter - 1);
        setCurrentStep(steps[stepCounter - 1])
    }

    const currentData = stepsData?.current != null && stepsData.current[stepCounter]?.data;


    logger.log(`Renderizo Stepper con: 
        StepCounter:${stepCounter}`)
    logger.log("CurrentStep:", currentStep);
    logger.log("CurrentData:", currentData);


    return (
        <StepContext.Provider
            value={{
                stepCounter,
                currentStep,
                clickNextRef,
                currentData,
                Next
            }}
        >
            <div className="h-full  w-full md:w-[900px] md:h-[720px] flex flex-col justify-between p-1.5 space-y-4">

                <div className="py-2 px-4 border border-gray-200 rounded-md shadow-md bg-slate-50">
                    <StepperTracker steps={steps} stepCounter={stepCounter} />
                </div>

                <div className="w-full  border bg-slate-50 px-4 py-0.5 rounded-md shadow-lg">
                    {currentStep.content}
                </div>


                <div className="flex justify-between">

                    <StepButton nextButton={false} onClick={Previous}>Anterior</StepButton>

                    <StepButton nextButton={true} onClick={() => { clickNextRef.current?.click() }}>Siguiente</StepButton>

                </div>

            </div >
        </StepContext.Provider >
    )
}