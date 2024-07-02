import { useReducer, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import Select from "../core/inputs/Selects";
import SelectWithSearch from '../core/inputs/SelectWithSearch';
import logger from "../../logic/Logger/logger";
import Input from "../core/inputs/Input";
import AddInput from "../core/inputs/AddInput";
import Button from "../core/buttons/Button";
import SycomComponent from "./SycomComponent";
import TableDataGridV2 from "../core/datagrid/TableDataGridV2";
import LocationForm from "../components/Locations/Forms/LocationForm";
import PDFtest from "./PDFtest";
import {PDFDownloadLink, PDFViewer} from '@react-pdf/renderer'



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




function FormTest({ }) {

    const [rol, setRol] = useState(rolList[0]);

    const [rolErr, setRolErr] = useState("");

    const [allergies, setAllergies] = useState([]);


    const [civilStatus, setCivilStatus] = useState(civilStatusList[0]);

    const { register, handleSubmit, formState, setValue } = useForm({
        mode: "onChange",

    });

    const [outside, setOutSide] = useState("");

    const outSideRef = useRef("");

    const { errors, isSubmitted } = formState;


    logger.log("Renderizo Forma Test")


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


                <Input

                    label={"Apellido"}

                    readOnly={false}


                    register={register}
                    validationRules={requiredRule}

                    useStrongErrColor={isSubmitted}
                    errMessage={errors.last_name?.message}

                    inputName={"last_name"}
                    useDotLabel={true}
                    placeHolder="Doe"
                    onChangeEvent={(e) => { logger.log("Cambio Uncontrolled Input") }}

                />


                <Select register={register}
                    label={"Estado Civil"}
                    inputName={"civil_state"}
                    useDotLabel={true}
                    options={civilStatusList}
                    value={civilStatus}
                    setValue={setValue}
                    openUp={true} />


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

            <div className="flex flex-col justify-center items-center mt-8">
                <h2>Outside Form Input</h2>

                <Input

                    label={"Outside"}

                    readOnly={false}


                    controlled={false}

                    useStrongErrColor={isSubmitted}

                    value={"Init"}
                    inputName={"outside"}
                    useDotLabel={true}
                    placeHolder="Outside"
                    inputRef={outSideRef}
                    onChangeEvent={(e) => {
                        logger.log("Cambio controlled Input: ", outSideRef.current.value);

                    }}

                />

            </div>
        </div>
    )
}

const testJson = `[
    {
       "Estado ":"Aceptada",
       "Referencia":"00012024051711074636877661",
       "Fecha Registro ":"2024-05-17T11:37:46.841438",
       "Monto":"868.85",
       "Moneda":"VES",
       "Fecha Instrucción":"2024-05-17",
       "Iniciador":"",
       "Canal ":"0040",
       "Producto":"040",
       "Sub Producto":"223",
       "Banco Emisor ":"0001",
       "Cuenta Emisor":"00010001380100018503",
       "Id. Emisor":"J77822180",
       "Nombre Emisor":"Nom Deudor 77822180",
       "Id. Último Emisor":"",
       "Nombre Último Emisor":"",
       "Concepto ":"CONCEPTO CREDITO",
       "Banco Receptor":"0115",
       "Cuenta Receptor":"01151780239290295633",
       "Id. Receptor":"J52229941",
       "Nombre Receptor":"Nom Acreedor 52229941",
       "Tlf./Alias Receptor":null,
       "Id Último Receptor":"",
       "Nombre Último Receptor":"",
       "Fecha Liquidación":"2024-05-17",
       "Corte":"2",
       "Rechazo ":null,
       "Descripción Rechazo":null,
       "Originador":null,
       "Estatus Entrega Banco":"Entregado",
       "Contrato y Factura":null,
       "Contrato y Factura JSON":null
    },
    {
       "Estado ":"Aceptada",
       "Referencia":"00012024051812015119584411",
       "Fecha Registro ":"2024-05-18T12:31:51.786137",
       "Monto":"730.23",
       "Moneda":"VES",
       "Fecha Instrucción":"2024-05-18",
       "Iniciador":"",
       "Canal ":"0040",
       "Producto":"040",
       "Sub Producto":"229",
       "Banco Emisor ":"0001",
       "Cuenta Emisor":"00010001380100012789",
       "Id. Emisor":"J83031220",
       "Nombre Emisor":"Nom Deudor 83031220",
       "Id. Último Emisor":"",
       "Nombre Último Emisor":"",
       "Concepto ":"CONCEPTO CREDITO",
       "Banco Receptor":"0151",
       "Cuenta Receptor":"01515402314680638397",
       "Id. Receptor":"J23139688",
       "Nombre Receptor":"Nom Acreedor 23139688",
       "Tlf./Alias Receptor":null,
       "Id Último Receptor":"",
       "Nombre Último Receptor":"",
       "Fecha Liquidación":"2024-05-17",
       "Corte":"2",
       "Rechazo ":null,
       "Descripción Rechazo":null,
       "Originador":null,
       "Estatus Entrega Banco":"Entregado",
       "Contrato y Factura":null,
       "Contrato y Factura JSON":null
    },
    {
       "Estado ":"Rechazada",
       "Referencia":"00012024051710234342220155",
       "Fecha Registro ":"2024-05-17T10:23:42.056555",
       "Monto":"659.19",
       "Moneda":"VES",
       "Fecha Instrucción":"2024-05-17",
       "Iniciador":"",
       "Canal ":"0040",
       "Producto":"040",
       "Sub Producto":"224",
       "Banco Emisor ":"0001",
       "Cuenta Emisor":"00010001380100015419",
       "Id. Emisor":"J08101420",
       "Nombre Emisor":"Nom Deudor 08101420",
       "Id. Último Emisor":"",
       "Nombre Último Emisor":"",
       "Concepto ":"CONCEPTO CREDITO",
       "Banco Receptor":"0166",
       "Cuenta Receptor":"01661986543103617311",
       "Id. Receptor":"J01911873",
       "Nombre Receptor":"Nom Acreedor 01911873",
       "Tlf./Alias Receptor":null,
       "Id Último Receptor":"",
       "Nombre Último Receptor":"",
       "Fecha Liquidación":"2024-05-17",
       "Corte":"2",
       "Rechazo ":"VE01",
       "Descripción Rechazo":"Rechazo técnico ",
       "Originador":"SIMF",
       "Estatus Entrega Banco":"Entregado",
       "Contrato y Factura":null,
       "Contrato y Factura JSON":null
    },
    {
       "Estado ":"Aceptada",
       "Referencia":"00012024051710350055176484",
       "Fecha Registro ":"2024-05-17T10:35:54.925605",
       "Monto":"531.75",
       "Moneda":"VES",
       "Fecha Instrucción":"2024-05-17",
       "Iniciador":"",
       "Canal ":"0040",
       "Producto":"040",
       "Sub Producto":"220",
       "Banco Emisor ":"0001",
       "Cuenta Emisor":"00010001380100016570",
       "Id. Emisor":"J147546331",
       "Nombre Emisor":"Graham and Sons",
       "Id. Último Emisor":"",
       "Nombre Último Emisor":"",
       "Concepto ":"CONCEPTO CREDITO",
       "Banco Receptor":"0171",
       "Cuenta Receptor":"01711773934668060370",
       "Id. Receptor":"J842392553",
       "Nombre Receptor":"Boyle-Johnson",
       "Tlf./Alias Receptor":null,
       "Id Último Receptor":"",
       "Nombre Último Receptor":"",
       "Fecha Liquidación":"2024-05-17",
       "Corte":"2",
       "Rechazo ":null,
       "Descripción Rechazo":null,
       "Originador":null,
       "Estatus Entrega Banco":"Entregado",
       "Contrato y Factura":null,
       "Contrato y Factura JSON":null
    },
    {
       "Estado ":"Aceptada",
       "Referencia":"00012024051710254683815845",
       "Fecha Registro ":"2024-05-17T10:55:46.868278",
       "Monto":"895.85",
       "Moneda":"VES",
       "Fecha Instrucción":"2024-05-17",
       "Iniciador":"",
       "Canal ":"0040",
       "Producto":"040",
       "Sub Producto":"222",
       "Banco Emisor ":"0001",
       "Cuenta Emisor":"00010001380100010889",
       "Id. Emisor":"J93656794",
       "Nombre Emisor":"Nom Deudor 93656794",
       "Id. Último Emisor":"",
       "Nombre Último Emisor":"",
       "Concepto ":"CONCEPTO CREDITO",
       "Banco Receptor":"0138",
       "Cuenta Receptor":"01385143456088685206",
       "Id. Receptor":"J14233937",
       "Nombre Receptor":"Nom Acreedor 14233937",
       "Tlf./Alias Receptor":null,
       "Id Último Receptor":"",
       "Nombre Último Receptor":"",
       "Fecha Liquidación":"2024-05-17",
       "Corte":"2",
       "Rechazo ":null,
       "Descripción Rechazo":null,
       "Originador":null,
       "Estatus Entrega Banco":"Entregado",
       "Contrato y Factura":null,
       "Contrato y Factura JSON":null
    },
     {
       "Estado ":"Aceptada",
       "Referencia":"00012024051711074636877661",
       "Fecha Registro ":"2024-05-17T11:37:46.841438",
       "Monto":"868.85",
       "Moneda":"VES",
       "Fecha Instrucción":"2024-05-17",
       "Iniciador":"",
       "Canal ":"0040",
       "Producto":"040",
       "Sub Producto":"223",
       "Banco Emisor ":"0001",
       "Cuenta Emisor":"00010001380100018503",
       "Id. Emisor":"J77822180",
       "Nombre Emisor":"Nom Deudor 77822180",
       "Id. Último Emisor":"",
       "Nombre Último Emisor":"",
       "Concepto ":"CONCEPTO CREDITO",
       "Banco Receptor":"0115",
       "Cuenta Receptor":"01151780239290295633",
       "Id. Receptor":"J52229941",
       "Nombre Receptor":"Nom Acreedor 52229941",
       "Tlf./Alias Receptor":null,
       "Id Último Receptor":"",
       "Nombre Último Receptor":"",
       "Fecha Liquidación":"2024-05-17",
       "Corte":"2",
       "Rechazo ":null,
       "Descripción Rechazo":null,
       "Originador":null,
       "Estatus Entrega Banco":"Entregado",
       "Contrato y Factura":null,
       "Contrato y Factura JSON":null
    },
    {
       "Estado ":"Aceptada",
       "Referencia":"00012024051812015119584411",
       "Fecha Registro ":"2024-05-18T12:31:51.786137",
       "Monto":"730.23",
       "Moneda":"VES",
       "Fecha Instrucción":"2024-05-18",
       "Iniciador":"",
       "Canal ":"0040",
       "Producto":"040",
       "Sub Producto":"229",
       "Banco Emisor ":"0001",
       "Cuenta Emisor":"00010001380100012789",
       "Id. Emisor":"J83031220",
       "Nombre Emisor":"Nom Deudor 83031220",
       "Id. Último Emisor":"",
       "Nombre Último Emisor":"",
       "Concepto ":"CONCEPTO CREDITO",
       "Banco Receptor":"0151",
       "Cuenta Receptor":"01515402314680638397",
       "Id. Receptor":"J23139688",
       "Nombre Receptor":"Nom Acreedor 23139688",
       "Tlf./Alias Receptor":null,
       "Id Último Receptor":"",
       "Nombre Último Receptor":"",
       "Fecha Liquidación":"2024-05-17",
       "Corte":"2",
       "Rechazo ":null,
       "Descripción Rechazo":null,
       "Originador":null,
       "Estatus Entrega Banco":"Entregado",
       "Contrato y Factura":null,
       "Contrato y Factura JSON":null
    },
    {
       "Estado ":"Rechazada",
       "Referencia":"00012024051710234342220155",
       "Fecha Registro ":"2024-05-17T10:23:42.056555",
       "Monto":"659.19",
       "Moneda":"VES",
       "Fecha Instrucción":"2024-05-17",
       "Iniciador":"",
       "Canal ":"0040",
       "Producto":"040",
       "Sub Producto":"224",
       "Banco Emisor ":"0001",
       "Cuenta Emisor":"00010001380100015419",
       "Id. Emisor":"J08101420",
       "Nombre Emisor":"Nom Deudor 08101420",
       "Id. Último Emisor":"",
       "Nombre Último Emisor":"",
       "Concepto ":"CONCEPTO CREDITO",
       "Banco Receptor":"0166",
       "Cuenta Receptor":"01661986543103617311",
       "Id. Receptor":"J01911873",
       "Nombre Receptor":"Nom Acreedor 01911873",
       "Tlf./Alias Receptor":null,
       "Id Último Receptor":"",
       "Nombre Último Receptor":"",
       "Fecha Liquidación":"2024-05-17",
       "Corte":"2",
       "Rechazo ":"VE01",
       "Descripción Rechazo":"Rechazo técnico ",
       "Originador":"SIMF",
       "Estatus Entrega Banco":"Entregado",
       "Contrato y Factura":null,
       "Contrato y Factura JSON":null
    },
    {
       "Estado ":"Aceptada",
       "Referencia":"00012024051710350055176484",
       "Fecha Registro ":"2024-05-17T10:35:54.925605",
       "Monto":"531.75",
       "Moneda":"VES",
       "Fecha Instrucción":"2024-05-17",
       "Iniciador":"",
       "Canal ":"0040",
       "Producto":"040",
       "Sub Producto":"220",
       "Banco Emisor ":"0001",
       "Cuenta Emisor":"00010001380100016570",
       "Id. Emisor":"J147546331",
       "Nombre Emisor":"Graham and Sons",
       "Id. Último Emisor":"",
       "Nombre Último Emisor":"",
       "Concepto ":"CONCEPTO CREDITO",
       "Banco Receptor":"0171",
       "Cuenta Receptor":"01711773934668060370",
       "Id. Receptor":"J842392553",
       "Nombre Receptor":"Boyle-Johnson",
       "Tlf./Alias Receptor":null,
       "Id Último Receptor":"",
       "Nombre Último Receptor":"",
       "Fecha Liquidación":"2024-05-17",
       "Corte":"2",
       "Rechazo ":null,
       "Descripción Rechazo":null,
       "Originador":null,
       "Estatus Entrega Banco":"Entregado",
       "Contrato y Factura":null,
       "Contrato y Factura JSON":null
    },
    {
       "Estado ":"Aceptada",
       "Referencia":"00012024051710254683815845",
       "Fecha Registro ":"2024-05-17T10:55:46.868278",
       "Monto":"895.85",
       "Moneda":"VES",
       "Fecha Instrucción":"2024-05-17",
       "Iniciador":"",
       "Canal ":"0040",
       "Producto":"040",
       "Sub Producto":"222",
       "Banco Emisor ":"0001",
       "Cuenta Emisor":"00010001380100010889",
       "Id. Emisor":"J93656794",
       "Nombre Emisor":"Nom Deudor 93656794",
       "Id. Último Emisor":"",
       "Nombre Último Emisor":"",
       "Concepto ":"CONCEPTO CREDITO",
       "Banco Receptor":"0138",
       "Cuenta Receptor":"01385143456088685206",
       "Id. Receptor":"J14233937",
       "Nombre Receptor":"Nom Acreedor 14233937",
       "Tlf./Alias Receptor":null,
       "Id Último Receptor":"",
       "Nombre Último Receptor":"",
       "Fecha Liquidación":"2024-05-17",
       "Corte":"2",
       "Rechazo ":null,
       "Descripción Rechazo":null,
       "Originador":null,
       "Estatus Entrega Banco":"Entregado",
       "Contrato y Factura":null,
       "Contrato y Factura JSON":null
    },
     {
       "Estado ":"Aceptada",
       "Referencia":"00012024051711074636877661",
       "Fecha Registro ":"2024-05-17T11:37:46.841438",
       "Monto":"868.85",
       "Moneda":"VES",
       "Fecha Instrucción":"2024-05-17",
       "Iniciador":"",
       "Canal ":"0040",
       "Producto":"040",
       "Sub Producto":"223",
       "Banco Emisor ":"0001",
       "Cuenta Emisor":"00010001380100018503",
       "Id. Emisor":"J77822180",
       "Nombre Emisor":"Nom Deudor 77822180",
       "Id. Último Emisor":"",
       "Nombre Último Emisor":"",
       "Concepto ":"CONCEPTO CREDITO",
       "Banco Receptor":"0115",
       "Cuenta Receptor":"01151780239290295633",
       "Id. Receptor":"J52229941",
       "Nombre Receptor":"Nom Acreedor 52229941",
       "Tlf./Alias Receptor":null,
       "Id Último Receptor":"",
       "Nombre Último Receptor":"",
       "Fecha Liquidación":"2024-05-17",
       "Corte":"2",
       "Rechazo ":null,
       "Descripción Rechazo":null,
       "Originador":null,
       "Estatus Entrega Banco":"Entregado",
       "Contrato y Factura":null,
       "Contrato y Factura JSON":null
    },
    {
       "Estado ":"Aceptada",
       "Referencia":"00012024051812015119584411",
       "Fecha Registro ":"2024-05-18T12:31:51.786137",
       "Monto":"730.23",
       "Moneda":"VES",
       "Fecha Instrucción":"2024-05-18",
       "Iniciador":"",
       "Canal ":"0040",
       "Producto":"040",
       "Sub Producto":"229",
       "Banco Emisor ":"0001",
       "Cuenta Emisor":"00010001380100012789",
       "Id. Emisor":"J83031220",
       "Nombre Emisor":"Nom Deudor 83031220",
       "Id. Último Emisor":"",
       "Nombre Último Emisor":"",
       "Concepto ":"CONCEPTO CREDITO",
       "Banco Receptor":"0151",
       "Cuenta Receptor":"01515402314680638397",
       "Id. Receptor":"J23139688",
       "Nombre Receptor":"Nom Acreedor 23139688",
       "Tlf./Alias Receptor":null,
       "Id Último Receptor":"",
       "Nombre Último Receptor":"",
       "Fecha Liquidación":"2024-05-17",
       "Corte":"2",
       "Rechazo ":null,
       "Descripción Rechazo":null,
       "Originador":null,
       "Estatus Entrega Banco":"Entregado",
       "Contrato y Factura":null,
       "Contrato y Factura JSON":null
    },
    {
       "Estado ":"Rechazada",
       "Referencia":"00012024051710234342220155",
       "Fecha Registro ":"2024-05-17T10:23:42.056555",
       "Monto":"659.19",
       "Moneda":"VES",
       "Fecha Instrucción":"2024-05-17",
       "Iniciador":"",
       "Canal ":"0040",
       "Producto":"040",
       "Sub Producto":"224",
       "Banco Emisor ":"0001",
       "Cuenta Emisor":"00010001380100015419",
       "Id. Emisor":"J08101420",
       "Nombre Emisor":"Nom Deudor 08101420",
       "Id. Último Emisor":"",
       "Nombre Último Emisor":"",
       "Concepto ":"CONCEPTO CREDITO",
       "Banco Receptor":"0166",
       "Cuenta Receptor":"01661986543103617311",
       "Id. Receptor":"J01911873",
       "Nombre Receptor":"Nom Acreedor 01911873",
       "Tlf./Alias Receptor":null,
       "Id Último Receptor":"",
       "Nombre Último Receptor":"",
       "Fecha Liquidación":"2024-05-17",
       "Corte":"2",
       "Rechazo ":"VE01",
       "Descripción Rechazo":"Rechazo técnico ",
       "Originador":"SIMF",
       "Estatus Entrega Banco":"Entregado",
       "Contrato y Factura":null,
       "Contrato y Factura JSON":null
    },
    {
       "Estado ":"Aceptada",
       "Referencia":"00012024051710350055176484",
       "Fecha Registro ":"2024-05-17T10:35:54.925605",
       "Monto":"531.75",
       "Moneda":"VES",
       "Fecha Instrucción":"2024-05-17",
       "Iniciador":"",
       "Canal ":"0040",
       "Producto":"040",
       "Sub Producto":"220",
       "Banco Emisor ":"0001",
       "Cuenta Emisor":"00010001380100016570",
       "Id. Emisor":"J147546331",
       "Nombre Emisor":"Graham and Sons",
       "Id. Último Emisor":"",
       "Nombre Último Emisor":"",
       "Concepto ":"CONCEPTO CREDITO",
       "Banco Receptor":"0171",
       "Cuenta Receptor":"01711773934668060370",
       "Id. Receptor":"J842392553",
       "Nombre Receptor":"Boyle-Johnson",
       "Tlf./Alias Receptor":null,
       "Id Último Receptor":"",
       "Nombre Último Receptor":"",
       "Fecha Liquidación":"2024-05-17",
       "Corte":"2",
       "Rechazo ":null,
       "Descripción Rechazo":null,
       "Originador":null,
       "Estatus Entrega Banco":"Entregado",
       "Contrato y Factura":null,
       "Contrato y Factura JSON":null
    },
    {
       "Estado ":"Aceptada",
       "Referencia":"00012024051710254683815845",
       "Fecha Registro ":"2024-05-17T10:55:46.868278",
       "Monto":"895.85",
       "Moneda":"VES",
       "Fecha Instrucción":"2024-05-17",
       "Iniciador":"",
       "Canal ":"0040",
       "Producto":"040",
       "Sub Producto":"222",
       "Banco Emisor ":"0001",
       "Cuenta Emisor":"00010001380100010889",
       "Id. Emisor":"J93656794",
       "Nombre Emisor":"Nom Deudor 93656794",
       "Id. Último Emisor":"",
       "Nombre Último Emisor":"",
       "Concepto ":"CONCEPTO CREDITO",
       "Banco Receptor":"0138",
       "Cuenta Receptor":"01385143456088685206",
       "Id. Receptor":"J14233937",
       "Nombre Receptor":"Nom Acreedor 14233937",
       "Tlf./Alias Receptor":null,
       "Id Último Receptor":"",
       "Nombre Último Receptor":"",
       "Fecha Liquidación":"2024-05-17",
       "Corte":"2",
       "Rechazo ":null,
       "Descripción Rechazo":null,
       "Originador":null,
       "Estatus Entrega Banco":"Entregado",
       "Contrato y Factura":null,
       "Contrato y Factura JSON":null
    },
     {
       "Estado ":"Aceptada",
       "Referencia":"00012024051711074636877661",
       "Fecha Registro ":"2024-05-17T11:37:46.841438",
       "Monto":"868.85",
       "Moneda":"VES",
       "Fecha Instrucción":"2024-05-17",
       "Iniciador":"",
       "Canal ":"0040",
       "Producto":"040",
       "Sub Producto":"223",
       "Banco Emisor ":"0001",
       "Cuenta Emisor":"00010001380100018503",
       "Id. Emisor":"J77822180",
       "Nombre Emisor":"Nom Deudor 77822180",
       "Id. Último Emisor":"",
       "Nombre Último Emisor":"",
       "Concepto ":"CONCEPTO CREDITO",
       "Banco Receptor":"0115",
       "Cuenta Receptor":"01151780239290295633",
       "Id. Receptor":"J52229941",
       "Nombre Receptor":"Nom Acreedor 52229941",
       "Tlf./Alias Receptor":null,
       "Id Último Receptor":"",
       "Nombre Último Receptor":"",
       "Fecha Liquidación":"2024-05-17",
       "Corte":"2",
       "Rechazo ":null,
       "Descripción Rechazo":null,
       "Originador":null,
       "Estatus Entrega Banco":"Entregado",
       "Contrato y Factura":null,
       "Contrato y Factura JSON":null
    },
    {
       "Estado ":"Aceptada",
       "Referencia":"00012024051812015119584411",
       "Fecha Registro ":"2024-05-18T12:31:51.786137",
       "Monto":"730.23",
       "Moneda":"VES",
       "Fecha Instrucción":"2024-05-18",
       "Iniciador":"",
       "Canal ":"0040",
       "Producto":"040",
       "Sub Producto":"229",
       "Banco Emisor ":"0001",
       "Cuenta Emisor":"00010001380100012789",
       "Id. Emisor":"J83031220",
       "Nombre Emisor":"Nom Deudor 83031220",
       "Id. Último Emisor":"",
       "Nombre Último Emisor":"",
       "Concepto ":"CONCEPTO CREDITO",
       "Banco Receptor":"0151",
       "Cuenta Receptor":"01515402314680638397",
       "Id. Receptor":"J23139688",
       "Nombre Receptor":"Nom Acreedor 23139688",
       "Tlf./Alias Receptor":null,
       "Id Último Receptor":"",
       "Nombre Último Receptor":"",
       "Fecha Liquidación":"2024-05-17",
       "Corte":"2",
       "Rechazo ":null,
       "Descripción Rechazo":null,
       "Originador":null,
       "Estatus Entrega Banco":"Entregado",
       "Contrato y Factura":null,
       "Contrato y Factura JSON":null
    },
    {
       "Estado ":"Rechazada",
       "Referencia":"00012024051710234342220155",
       "Fecha Registro ":"2024-05-17T10:23:42.056555",
       "Monto":"659.19",
       "Moneda":"VES",
       "Fecha Instrucción":"2024-05-17",
       "Iniciador":"",
       "Canal ":"0040",
       "Producto":"040",
       "Sub Producto":"224",
       "Banco Emisor ":"0001",
       "Cuenta Emisor":"00010001380100015419",
       "Id. Emisor":"J08101420",
       "Nombre Emisor":"Nom Deudor 08101420",
       "Id. Último Emisor":"",
       "Nombre Último Emisor":"",
       "Concepto ":"CONCEPTO CREDITO",
       "Banco Receptor":"0166",
       "Cuenta Receptor":"01661986543103617311",
       "Id. Receptor":"J01911873",
       "Nombre Receptor":"Nom Acreedor 01911873",
       "Tlf./Alias Receptor":null,
       "Id Último Receptor":"",
       "Nombre Último Receptor":"",
       "Fecha Liquidación":"2024-05-17",
       "Corte":"2",
       "Rechazo ":"VE01",
       "Descripción Rechazo":"Rechazo técnico ",
       "Originador":"SIMF",
       "Estatus Entrega Banco":"Entregado",
       "Contrato y Factura":null,
       "Contrato y Factura JSON":null
    },
    {
       "Estado ":"Aceptada",
       "Referencia":"00012024051710350055176484",
       "Fecha Registro ":"2024-05-17T10:35:54.925605",
       "Monto":"531.75",
       "Moneda":"VES",
       "Fecha Instrucción":"2024-05-17",
       "Iniciador":"",
       "Canal ":"0040",
       "Producto":"040",
       "Sub Producto":"220",
       "Banco Emisor ":"0001",
       "Cuenta Emisor":"00010001380100016570",
       "Id. Emisor":"J147546331",
       "Nombre Emisor":"Graham and Sons",
       "Id. Último Emisor":"",
       "Nombre Último Emisor":"",
       "Concepto ":"CONCEPTO CREDITO",
       "Banco Receptor":"0171",
       "Cuenta Receptor":"01711773934668060370",
       "Id. Receptor":"J842392553",
       "Nombre Receptor":"Boyle-Johnson",
       "Tlf./Alias Receptor":null,
       "Id Último Receptor":"",
       "Nombre Último Receptor":"",
       "Fecha Liquidación":"2024-05-17",
       "Corte":"2",
       "Rechazo ":null,
       "Descripción Rechazo":null,
       "Originador":null,
       "Estatus Entrega Banco":"Entregado",
       "Contrato y Factura":null,
       "Contrato y Factura JSON":null
    },
    {
       "Estado ":"Aceptada",
       "Referencia":"00012024051710254683815845",
       "Fecha Registro ":"2024-05-17T10:55:46.868278",
       "Monto":"895.85",
       "Moneda":"VES",
       "Fecha Instrucción":"2024-05-17",
       "Iniciador":"",
       "Canal ":"0040",
       "Producto":"040",
       "Sub Producto":"222",
       "Banco Emisor ":"0001",
       "Cuenta Emisor":"00010001380100010889",
       "Id. Emisor":"J93656794",
       "Nombre Emisor":"Nom Deudor 93656794",
       "Id. Último Emisor":"",
       "Nombre Último Emisor":"",
       "Concepto ":"CONCEPTO CREDITO",
       "Banco Receptor":"0138",
       "Cuenta Receptor":"01385143456088685206",
       "Id. Receptor":"J14233937",
       "Nombre Receptor":"Nom Acreedor 14233937",
       "Tlf./Alias Receptor":null,
       "Id Último Receptor":"",
       "Nombre Último Receptor":"",
       "Fecha Liquidación":"2024-05-17",
       "Corte":"2",
       "Rechazo ":null,
       "Descripción Rechazo":null,
       "Originador":null,
       "Estatus Entrega Banco":"Entregado",
       "Contrato y Factura":null,
       "Contrato y Factura JSON":null
    },
     {
       "Estado ":"Aceptada",
       "Referencia":"00012024051711074636877661",
       "Fecha Registro ":"2024-05-17T11:37:46.841438",
       "Monto":"868.85",
       "Moneda":"VES",
       "Fecha Instrucción":"2024-05-17",
       "Iniciador":"",
       "Canal ":"0040",
       "Producto":"040",
       "Sub Producto":"223",
       "Banco Emisor ":"0001",
       "Cuenta Emisor":"00010001380100018503",
       "Id. Emisor":"J77822180",
       "Nombre Emisor":"Nom Deudor 77822180",
       "Id. Último Emisor":"",
       "Nombre Último Emisor":"",
       "Concepto ":"CONCEPTO CREDITO",
       "Banco Receptor":"0115",
       "Cuenta Receptor":"01151780239290295633",
       "Id. Receptor":"J52229941",
       "Nombre Receptor":"Nom Acreedor 52229941",
       "Tlf./Alias Receptor":null,
       "Id Último Receptor":"",
       "Nombre Último Receptor":"",
       "Fecha Liquidación":"2024-05-17",
       "Corte":"2",
       "Rechazo ":null,
       "Descripción Rechazo":null,
       "Originador":null,
       "Estatus Entrega Banco":"Entregado",
       "Contrato y Factura":null,
       "Contrato y Factura JSON":null
    },
    {
       "Estado ":"Aceptada",
       "Referencia":"00012024051812015119584411",
       "Fecha Registro ":"2024-05-18T12:31:51.786137",
       "Monto":"730.23",
       "Moneda":"VES",
       "Fecha Instrucción":"2024-05-18",
       "Iniciador":"",
       "Canal ":"0040",
       "Producto":"040",
       "Sub Producto":"229",
       "Banco Emisor ":"0001",
       "Cuenta Emisor":"00010001380100012789",
       "Id. Emisor":"J83031220",
       "Nombre Emisor":"Nom Deudor 83031220",
       "Id. Último Emisor":"",
       "Nombre Último Emisor":"",
       "Concepto ":"CONCEPTO CREDITO",
       "Banco Receptor":"0151",
       "Cuenta Receptor":"01515402314680638397",
       "Id. Receptor":"J23139688",
       "Nombre Receptor":"Nom Acreedor 23139688",
       "Tlf./Alias Receptor":null,
       "Id Último Receptor":"",
       "Nombre Último Receptor":"",
       "Fecha Liquidación":"2024-05-17",
       "Corte":"2",
       "Rechazo ":null,
       "Descripción Rechazo":null,
       "Originador":null,
       "Estatus Entrega Banco":"Entregado",
       "Contrato y Factura":null,
       "Contrato y Factura JSON":null
    },
    {
       "Estado ":"Rechazada",
       "Referencia":"00012024051710234342220155",
       "Fecha Registro ":"2024-05-17T10:23:42.056555",
       "Monto":"659.19",
       "Moneda":"VES",
       "Fecha Instrucción":"2024-05-17",
       "Iniciador":"",
       "Canal ":"0040",
       "Producto":"040",
       "Sub Producto":"224",
       "Banco Emisor ":"0001",
       "Cuenta Emisor":"00010001380100015419",
       "Id. Emisor":"J08101420",
       "Nombre Emisor":"Nom Deudor 08101420",
       "Id. Último Emisor":"",
       "Nombre Último Emisor":"",
       "Concepto ":"CONCEPTO CREDITO",
       "Banco Receptor":"0166",
       "Cuenta Receptor":"01661986543103617311",
       "Id. Receptor":"J01911873",
       "Nombre Receptor":"Nom Acreedor 01911873",
       "Tlf./Alias Receptor":null,
       "Id Último Receptor":"",
       "Nombre Último Receptor":"",
       "Fecha Liquidación":"2024-05-17",
       "Corte":"2",
       "Rechazo ":"VE01",
       "Descripción Rechazo":"Rechazo técnico ",
       "Originador":"SIMF",
       "Estatus Entrega Banco":"Entregado",
       "Contrato y Factura":null,
       "Contrato y Factura JSON":null
    },
    {
       "Estado ":"Aceptada",
       "Referencia":"00012024051710350055176484",
       "Fecha Registro ":"2024-05-17T10:35:54.925605",
       "Monto":"531.75",
       "Moneda":"VES",
       "Fecha Instrucción":"2024-05-17",
       "Iniciador":"",
       "Canal ":"0040",
       "Producto":"040",
       "Sub Producto":"220",
       "Banco Emisor ":"0001",
       "Cuenta Emisor":"00010001380100016570",
       "Id. Emisor":"J147546331",
       "Nombre Emisor":"Graham and Sons",
       "Id. Último Emisor":"",
       "Nombre Último Emisor":"",
       "Concepto ":"CONCEPTO CREDITO",
       "Banco Receptor":"0171",
       "Cuenta Receptor":"01711773934668060370",
       "Id. Receptor":"J842392553",
       "Nombre Receptor":"Boyle-Johnson",
       "Tlf./Alias Receptor":null,
       "Id Último Receptor":"",
       "Nombre Último Receptor":"",
       "Fecha Liquidación":"2024-05-17",
       "Corte":"2",
       "Rechazo ":null,
       "Descripción Rechazo":null,
       "Originador":null,
       "Estatus Entrega Banco":"Entregado",
       "Contrato y Factura":null,
       "Contrato y Factura JSON":null
    },
    {
       "Estado ":"Aceptada",
       "Referencia":"00012024051710254683815845",
       "Fecha Registro ":"2024-05-17T10:55:46.868278",
       "Monto":"895.85",
       "Moneda":"VES",
       "Fecha Instrucción":"2024-05-17",
       "Iniciador":"",
       "Canal ":"0040",
       "Producto":"040",
       "Sub Producto":"222",
       "Banco Emisor ":"0001",
       "Cuenta Emisor":"00010001380100010889",
       "Id. Emisor":"J93656794",
       "Nombre Emisor":"Nom Deudor 93656794",
       "Id. Último Emisor":"",
       "Nombre Último Emisor":"",
       "Concepto ":"CONCEPTO CREDITO",
       "Banco Receptor":"0138",
       "Cuenta Receptor":"01385143456088685206",
       "Id. Receptor":"J14233937",
       "Nombre Receptor":"Nom Acreedor 14233937",
       "Tlf./Alias Receptor":null,
       "Id Último Receptor":"",
       "Nombre Último Receptor":"",
       "Fecha Liquidación":"2024-05-17",
       "Corte":"2",
       "Rechazo ":null,
       "Descripción Rechazo":null,
       "Originador":null,
       "Estatus Entrega Banco":"Entregado",
       "Contrato y Factura":null,
       "Contrato y Factura JSON":null
    }
 ]`

export default function Testing({ }) {
    return (

        <>

            <div className="w-full flex flex-col justify-center items-center"></div>
            <div className="max-w-[520px] mx-auto">
                <LocationForm />
            </div>


            <div>
                <h1>PDF TEST</h1>      
                  <PDFDownloadLink document={<PDFtest />} fileName="registeruser.pdf">
                     {({ loading, url, error, blob }) =>
                         loading ? (
                             <button  >Cargando documento...</button>
                         ) : (
                              <Button>Descargar PDF</Button>
                           )
                     }
                 </PDFDownloadLink> 
            </div>

        </>
    )
}