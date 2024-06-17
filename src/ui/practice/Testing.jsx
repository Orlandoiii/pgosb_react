import { useReducer, useState } from "react";
import { useForm } from "react-hook-form";
import { Select, SelectWithSearch } from "../core/inputs/Selects";
import logger from "../../logic/Logger/logger";
import Input from "../core/inputs/Input";
import AddInput from "../core/inputs/AddInput";
import Button from "../core/buttons/Button";



function UseStateCounter({ }) {
    const [counter, setCounter] = useState(0);



    return (
        <div className="w-full h-full flex flex-col justify-center text-center p-4">

            <h2>Contador Con useState</h2>


            <h3>Counter: {counter}</h3>

            <div className="flex justify-center items-center space-x-4">
                <button
                    onClick={() => { setCounter(c => c - 1) }}
                    className="p-4 bg-sky-600 outline-none rounded-md text-white shadow-md">Click Me -</button>
                <button
                    onClick={() => { setCounter(c => c + 1) }}
                    className="p-4 bg-sky-600 outline-none rounded-md text-white shadow-md">Click Me +</button>

            </div>

        </div>
    )
}


const initialState = { count: 0 };

function reducer(state, action) {


    switch (action.type) {
        case "INC":
            return { count: state.count + 1 }
        case "DEC":
            return { count: state.count - 1 }
    }
    // throw new Error("action unknow");
}

function UseStateReducer({ }) {


    const [state, dispatch] = useReducer(reducer, initialState);



    return (
        <div className="w-full h-full flex flex-col justify-center text-center p-4">

            <h2>Contador Con useReducer</h2>


            <h3>Counter: {state?.count}</h3>

            <div className="flex justify-center items-center space-x-4">
                <button
                    onClick={() => dispatch({ type: "DEC" })}
                    className="p-4 bg-sky-600 outline-none rounded-md text-white shadow-md">Click Me -</button>
                <button
                    onClick={() => dispatch({ type: "INC" })}
                    className="p-4 bg-sky-600 outline-none rounded-md text-white shadow-md">Click Me +</button>

            </div>

        </div>
    )
}





function UseStateVsUseReducer({ }) {



    return (
        <div className="h-full w-full">

            <div className="">
                <UseStateCounter />
            </div>

            <div className="">
                <UseStateReducer />
            </div>

        </div>
    )
}


const requiredRule = {
    required: {
        value: true,
        message: "El campo es requerido",
    }
}


const civilStatusList = ["Solter@", "Casad@", "Divorciad@", "Viud@"]
const rolList = ["Administrador", "Usuario", "Otro"]



function FormTest({ }) {

    const [rol, setRol] = useState(rolList[0]);

    const [rolErr, setRolErr] = useState("");

    const [allergies, setAllergies] = useState([]);


    const [civilStatus, setCivilStatus] = useState(civilStatusList[0]);

    const { register, handleSubmit, formState } = useForm({
        mode: "onChange",

    });

    const { errors, isSubmitted } = formState;




    return (
        <div className="flex flex-col justify-center items-center mt-8">
            <h1>Probando Lista</h1>
            <form className="w-full max-w-[420px]" noValidate

                onSubmit={
                    handleSubmit((data) => {

                        logger.log("RolErr", rolErr)

                        logger.log(data)

                    })}>



                <Input label={"Nombre"}

                    register={register}
                    validationRules={requiredRule}

                    useStrongErrColor={isSubmitted}
                    errMessage={errors.name?.message}

                    inputName={"name"}
                    useDotLabel={true}
                    placeHolder="Jon"

                />


                <Select label={"Estado Civil"} useDotLabel={true} options={civilStatusList}
                    value={civilStatus} onChange={(v) => { setCivilStatus(v) }} openUp={true} />


                <SelectWithSearch

                    onError={(err) => { setRolErr(err) }}
                    label={"Rol"}
                    useDotLabel={true}
                    options={rolList}
                    value={rol}
                    onChange={(v) => { setRol(v) }}
                    openUp={true}
                    useStrongErrColor={isSubmitted} />

                <AddInput

                    label={"Alergias"}
                    inputName={"allergies"}
                    useDotLabel={true}
                    placeHolder="Alergia Ejem:Nuez"
                    useStrongErrColor={isSubmitted}
                    items={allergies}
                    setItems={setAllergies}
                />

                <Button>Submit</Button>

            </form>
        </div>
    )
}


export default function Testing({ }) {
    return (
        <FormTest />
    )
}