import { useForm } from "react-hook-form";

import Input from "../../../core/inputs/Input";
import Select from "../../../core/inputs/Selects";
import SelectWithSearch from "../../../core/inputs/SelectWithSearch";

import { useContext, useState } from "react";
import { StepContext } from "../../Stepper/Stepper";
import FormHiddenButton from "../../../core/buttons/FormHiddenButton";
import FormTitle from "../../../core/titles/FormTitle";



const states = ["Miranda", "Caracas", "Bolivar", "Aragua", "Zulia"];

const municipality = {
    "Miranda": ["Chacao", "Baruta", "Sucre", "Hatillo"],
    "Caracas": ["Libertador", "El Hatillo", "Baruta"],
    "Bolivar": ["Caroní", "Heres", "Piar"],
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



const requiredRule = {
    required: {
        value: true,
        message: "El campo es requerido",
    }
}


export default function LocationForm({ clickSubmitRef, onSubmit }) {


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





    function handleSubmitInternal(data) {



        if (onSubmit)
            onSubmit(data);

        if (Next)
            Next(data);
    }

    return (

        <form
            noValidate

            onSubmit={handleSubmit((
                data) => {



                const newData = {
                    ...data
                }

                handleSubmitInternal(newData)
            })}
            className="mx-auto my-4 w-full max-w-[365px] md:max-w-[100%]">


            {/* <FormTitle title={"Ubicación"} /> */}


            <div className="space-y-2 md:space-y-0 md:flex md:justify-around md:items-baseline">

                <div className="w-full space-y-4 px-2 max-w-[720px]">



                    <div className="md:flex md:space-x-2">

                        <SelectWithSearch

                            label={"Estado"}
                            useDotLabel={true}
                            options={states}
                            value={estado}
                            onChange={(v) => { setEstado(v) }}
                            openUp={false}

                            errMessage={estadoErr}
                            onError={(err) => { setEstadoErr(err) }}
                            useStrongErrColor={isSubmitted} />

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
                            openUp={true}

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

                        <Input label={"Urbanizacion/Comunidad/Barrio"}
                            register={register}
                            // validationRules={requiredRule}

                            useStrongErrColor={isSubmitted}
                            errMessage={errors.sector?.message}

                            inputName={"urbanization"}
                            useDotLabel={true}
                            placeHolder="Urbanizacion..."

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

                        <Input label={"Playa/Rio/Quebrada"}
                            register={register}
                            // validationRules={requiredRule}

                            useStrongErrColor={isSubmitted}
                            errMessage={errors.sector?.message}

                            inputName={"urbanization"}
                            useDotLabel={true}
                            placeHolder="Urbanizacion/Comunidad/Barrio"

                        />

                    </div>










                    <Input label={"Direccion"}
                        register={register}
                        // validationRules={requiredRule}

                        useStrongErrColor={isSubmitted}
                        errMessage={errors.sector?.message}

                        inputName={"urbanization"}
                        useDotLabel={true}
                        placeHolder="Urbanizacion/Comunidad/Barrio"

                    />

                </div>

            </div>

            <FormHiddenButton clickNextRef={clickNextRef} clickSubmitRef={clickSubmitRef} />


        </form>
    )
}