import { useForm } from "react-hook-form";

import Input from "../../../core/inputs/Input";
import Select from "../../../core/inputs/Selects";
import SelectWithSearch from "../../../core/inputs/SelectWithSearch";

import { useContext, useEffect, useState } from "react";
import { StepContext } from "../../Stepper/Stepper";
import FormHiddenButton from "../../../core/buttons/FormHiddenButton";
import Button from "../../../core/buttons/Button";



const states = ["Miranda", "Caracas", "Bolívar", "Aragua", "Zulia"];

const municipality = {
    "Miranda": ["Chacao", "Baruta", "Sucre", "Hatillo"],
    "Caracas": ["Libertador", "Sucre", "Baruta"],
    "Bolívar": ["Caroní", "Heres", "Piar"],
    "Aragua": ["Girardot", "Mario Briceño Iragorry", "Santiago Mariño"],
    "Zulia": ["Maracaibo", "San Francisco", "Cabimas"]
};

const parish = {
    "Chacao": ["Altamira", "El Rosal", "La Castellana"],
    "Baruta": ["Las Mercedes", "La Trinidad", "El Cafetal"],
    "Sucre": ["Petare", "Leoncio Martínez", "Caucagüita"],
    "Hatillo": ["La Lagunita", "El Cigarral", "Oripoto"],
    "Libertador": ["23 de Enero", "San Juan", "La Pastora"],
    "Caroní": ["Unare", "Cachamay", "Pozo Verde"],
};


const fathersRegion = ["Estado", "Municipio", "Parroquia"]

const requiredRule = {
    required: {
        value: true,
        message: "El campo es requerido",
    }
}


export default function RegionForm({ clickSubmitRef, onSubmit }) {


    const { clickNextRef, currentData, Next } = useContext(StepContext);


    const { register, handleSubmit, formState, setValue } = useForm({
        mode: "onChange",
        defaultValues: currentData
    });

    const { errors, isSubmitted } = formState;



    const [estado, setEstado] = useState("");


    const [estadoErr, setEstadoErr] = useState("");



    const [municipios, setMunicipios] = useState()

    const [municipio, setMunicipio] = useState("");


    const [municipioErr, setMunicipioErr] = useState("");


    const [parroquias, setParroquias] = useState([])
    const [parroquia, setParroquia] = useState("");

    const [parroquiaErr, setParroquiaErr] = useState("");


    const [regionName, setRegionName] = useState("");
    const [regionNameErr, setRegionNameErr] = useState("");


    const [regionCode, setRegionCode] = useState("");
    const [regionCodeErr, setRegionCodeErr] = useState("");



    const [father, setFather] = useState(fathersRegion[0])

    const [open, setOpen] = useState(true);

    function handleSubmitInternal(data) {
        if (onSubmit)
            onSubmit(data);

        if (Next)
            Next(data);
    }


    useEffect(() => {
        if (estado == null || estado == "") {
            setMunicipio("");
            return;

        }


        if (!municipality[estado])
            return;


        setMunicipios(municipality[estado])
        setMunicipio(municipality[estado][0])
    }, [estado, setMunicipio, setMunicipios])

    useEffect(() => {
        if (municipio == null || municipio == "") {
            setParroquia("");
            return;

        }

        if (!parish[municipio])
            return

        setParroquias(parish[municipio])
        setParroquia(parish[municipio][0])
    }, [municipio, setParroquia, setParroquias])


    return (


        <div className="px-2 space-y-4 max-w-[720px] mx-auto ">

            <div className="space-y-2">

                <Input label={"Nombre de Región"}
                    controlled={true}
                    value={regionName}
                    onChange={(e) => {
                        setRegionName(e.target.value)
                    }}
                    useStrongErrColor={isSubmitted}
                    errMessage={regionNameErr}

                    inputName={"region_name"}
                    useDotLabel={true}
                    placeHolder="Zona de Paz M10"

                />
                <div className="md:flex md:space-x-2">

                    <div className="md:w-[60%]">
                        <Input label={"Código de la Región"}
                            controlled={true}
                            value={regionCode}
                            onChange={(e) => {
                                setRegionCode(e.target.value)
                            }}
                            useStrongErrColor={isSubmitted}
                            errMessage={regionCodeErr}

                            inputName={"region_code"}
                            useDotLabel={true}
                            placeHolder="ZM10"

                        />
                    </div>

                    <Select

                        inputName={"father_region"}
                        label={"Padre Principal"}
                        useDotLabel={true}
                        options={fathersRegion}
                        value={father}
                        controlled={true}
                        onSelected={(v) => { setFather(v) }}
                        openUp={false} />




                </div>


                <div className="md:flex md:space-x-2">



                    {(father == "Estado" || father == "Municipio") && <SelectWithSearch

                        label={"Estado"}
                        useDotLabel={true}
                        options={states}
                        value={estado}
                        onChange={(v) => { setEstado(v) }}
                        openUp={false}

                        errMessage={estadoErr}
                        onError={(err) => { setEstadoErr(err) }}
                        useStrongErrColor={isSubmitted} />}




                    <SelectWithSearch

                        label={"Municipio"}
                        useDotLabel={true}
                        options={municipios}
                        value={municipio}
                        onChange={(v) => { setMunicipio(v) }}
                        openUp={false}

                        errMessage={municipioErr}
                        onError={(err) => { setMunicipioErr(err) }}
                        useStrongErrColor={isSubmitted} />

                    <SelectWithSearch

                        label={"Parroquia"}
                        useDotLabel={true}
                        options={parroquias}
                        value={parroquia}
                        onChange={(v) => { setParroquia(v) }}
                        openUp={false}

                        errMessage={parroquiaErr}
                        onError={(err) => { setParroquiaErr(err) }}
                        useStrongErrColor={isSubmitted} />



                </div>



            </div>

            <div className="flex justify-between items-center">
                <h3 className="text-2xl text-[#0A2F4E]">
                    Datos de la Ubicación
                </h3>
                <button id="open-affiliate-form-btn" className="w-12 h-12 px-2 py-2 
                flex justify-center items-center border border-slate-600 rounded-lg" onClick={(e) => { setOpen(o => !o) }}>
                    <div className="w-full relative flex justify-center items-center">
                        <div className="w-5 rounded-full h-1 bg-[#0A2F4E]">
                        </div>
                        <div className={`absolute w-5 rounded-full h-1 ${open ? "rotate-0" : "rotate-90"}  transition ease-in-out duration-300 bg-[#0A2F4E]`}>
                        </div>
                    </div>
                </button>
            </div>



            <form
                noValidate

                onSubmit={handleSubmit((
                    data) => {



                    const newData = {
                        ...data
                    }

                    handleSubmitInternal(newData)
                })}
                className={`mx-auto my-4 w-full max-w-[365px] md:max-w-[100%] transition-all duration-300 origin-top ${open ? "scale-y-100" : "scale-y-0"}`}>


                <div className="space-y-2 md:space-y-0 md:flex md:justify-around md:items-baseline">

                    <div className="w-full space-y-2">



                        <div className="md:flex md:space-x-2">



                            {father != "Estado" && <SelectWithSearch

                                label={"Estado"}
                                useDotLabel={true}
                                options={states}
                                value={estado}
                                onChange={(v) => { setEstado(v) }}
                                openUp={false}

                                errMessage={estadoErr}
                                onError={(err) => { setEstadoErr(err) }}
                                useStrongErrColor={isSubmitted} />}

                            <SelectWithSearch

                                label={"Municipio"}
                                useDotLabel={true}
                                options={municipios}
                                value={municipio}
                                onChange={(v) => { setMunicipio(v) }}
                                openUp={false}

                                errMessage={municipioErr}
                                onError={(err) => { setMunicipioErr(err) }}
                                useStrongErrColor={isSubmitted} />

                            <SelectWithSearch

                                label={"Parroquia"}
                                useDotLabel={true}
                                options={parroquias}
                                value={parroquia}
                                onChange={(v) => { setParroquia(v) }}
                                openUp={false}

                                errMessage={parroquiaErr}
                                onError={(err) => { setParroquiaErr(err) }}
                                useStrongErrColor={isSubmitted} />



                        </div>



                        <div className="md:flex md:space-x-2">





                            <Input label={"Sector"}
                                register={register}
                                // validationRules={requiredRule}

                                useStrongErrColor={isSubmitted}
                                errMessage={errors.sector?.message}

                                inputName={"sector"}
                                useDotLabel={true}
                                placeHolder="Sector..."

                            />

                            <Input label={"Urbanización/Comunidad/Barrio"}
                                register={register}
                                // validationRules={requiredRule}

                                useStrongErrColor={isSubmitted}
                                errMessage={errors.sector?.message}

                                inputName={"urbanization"}
                                useDotLabel={true}
                                placeHolder="Urbanización..."

                            />



                        </div>

                        <div className="md:flex md:space-x-2">


                            <Input label={"Autopista/Carretera/Avenida/Calle"}
                                register={register}
                                // validationRules={requiredRule}

                                useStrongErrColor={isSubmitted}
                                errMessage={errors.sector?.message}

                                inputName={"urbanization"}
                                useDotLabel={true}
                                placeHolder="Autopista..."

                            />

                            <Input label={"Playa/Río/Quebrada"}
                                register={register}
                                // validationRules={requiredRule}

                                useStrongErrColor={isSubmitted}
                                errMessage={errors.sector?.message}

                                inputName={"urbanization"}
                                useDotLabel={true}
                                placeHolder="Urbanización/Comunidad/Barrio"

                            />

                        </div>


                        <Input label={"Dirección"}
                            register={register}
                            // validationRules={requiredRule}

                            useStrongErrColor={isSubmitted}
                            errMessage={errors.sector?.message}

                            inputName={"urbanization"}
                            useDotLabel={true}
                            placeHolder="Urbanización/Comunidad/Barrio"

                        />

                    </div>

                </div>

                <FormHiddenButton clickNextRef={clickNextRef} clickSubmitRef={clickSubmitRef} />

                <Button width="w-full">Agregar</Button>
            </form>



        </div>






    )
}