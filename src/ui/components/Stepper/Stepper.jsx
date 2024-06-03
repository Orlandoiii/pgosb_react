class StepObject {

    constructor(title, content, isValid) {
        this.title = title;
        this.content = content;
        this.isValid = isValid;
    }
}


function PrevIcon({ }) {
    return (
        <svg className="w-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd">
            </path>
        </svg>
    )
}

function NextIcon({ }) {
    return (
        <svg className="w-5 ml-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd">
            </path>
        </svg>
    )
}


function NextButton({ children }) {
    return (
        <>
            <p className="ml-2 text-sm">{children}</p>
            <NextIcon />
        </>
    )
}

function PrevButton({ children }) {
    return (
        <>
            <PrevIcon />
            <p className="ml-2 text-sm">{children}</p>
        </>
    )
}



function StepButton({ children, nextButton = true, onClick }) {
    return (

        <button type="button"
            onClick={(e) => { if (onClick) onClick(e) }}
            className={`bg-[#3C50E0] text-white block
          ${nextButton ? "border-l rounded-r-md" : " rounded-l-md border-r"} 
        border-gray-100 py-2 hover:bg-sky-400 
        hover:text-white px-3`} >
            <div className="flex flex-row align-middle">
                {nextButton ?
                    <NextButton>
                        {children}
                    </NextButton> :
                    <PrevButton>
                        {children}
                    </PrevButton>}
            </div>
        </button>
    )
}

function StepperTrackerItem({ title, number, isActive = false }) {

    return (
        <li className="flex-1 md:max-w-[310px] shadow-sm">
            <div className={`flex items-center font-medium px-4 py-5 w-full rounded-lg ${isActive ? 'bg-indigo-50' : 'bg-slate-200'} `}>
                <span className={`w-8 h-8 ${isActive ? 'bg-indigo-600 text-white' : 'bg-[whitesmoke] text-slate-700'} 
                   rounded-full flex justify-center items-center 
                   mr-3 text-sm lg:w-[40px] lg:h-[40px]`}>{number}</span>
                <h4 className={`text-center text-sm ${isActive ? 'text-indigo-600' : 'text-[#0054AE]'}`}>{title}</h4>
            </div>
        </li>
    )

}

function StepperTracker({ steps }) {
    return (
        <ol className="w-full space-y-4  md:flex md:flex-row md:items-center  md:justify-between
            md:space-y-0 md:space-x-1  ">
            {steps.map((st, idx) => {
                return (
                    <StepperTrackerItem title={st.title}
                        key={st.title} isActive={false} number={`${0}${idx}`} />
                )
            })}
        </ol>
    )


}

function Step({ children, title, onValid }) {



}


export { StepperTracker }


export default function Stepper({ steps, children, onClickNext, onClickPrev }) {



    return (
        <div className="h-full w-full flex flex-col justify-between p-2">

            <div>
                <StepperTracker steps={steps} />

            </div>

            <div className="w-full">

                {children}


            </div>



            <div className="flex justify-between">

                <StepButton nextButton={false} onClick={onClickPrev}>Anterior</StepButton>

                <StepButton nextButton={true} onClick={onClickNext}>Siguiente</StepButton>

            </div>

        </div>
    )
}