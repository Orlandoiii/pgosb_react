import { useContext, useEffect, useMemo, useState } from 'react'
import { StepContext } from '../../Stepper/Stepper'
import FormInput from '../../../core/inputs/FormInput'
import FormHiddenButton from '../../../core/buttons/FormHiddenButton'
import CustomForm from '../../../core/context/CustomFormContext'
import FormSelectSearch from '../../../core/inputs/FormSelectSearch'
import React from 'react'
import { Colors } from '../../../../domain/abstractions/colors/colors'
import { UnitSchemaBasicData } from '../../../../domain/models/unit/unit'
import logger from '../../../../logic/Logger/logger'
import { EnumToStringArray } from '../../../../utilities/converters/enum_converter'
import { UnitTypes } from '../../../../domain/abstractions/enums/unit_types'
import axios from 'axios'
import SelectSearch from '../../../core/inputs/SelectSearch'
import FormSelect from '../../../core/inputs/FormSelect'
import { FuelTypes } from '../../../../domain/abstractions/enums/fuel_types'
import { useConfig } from '../../../core/context/ConfigContext'


const carsCache = new Map();


// const stations = ['Station 1', 'Station 2', 'Station 3']

export default function BasicInfoForm({ clickSubmitRef, onSubmit }) {
    const { clickNextRef, currentData, Next } = useContext(StepContext)
    const unitTypes = EnumToStringArray(UnitTypes)

    function handleSubmitInternal(data) {
        if (onSubmit) onSubmit(data)

        if (Next) Next(data)
    }

    const { config } = useConfig();

    const [marca, setMarca] = useState(currentData?.make ?? "");


    const [marcas, setMarcas] = useState([])


    const [modelos, setModelos] = useState([]);

    const [modelo, setModelo] = useState(currentData?.model ?? "");


    const [stations, setStations] = useState([]);




    const [station, setStation] = useState(currentData?.station ?? "");


    logger.log("MARCA MODELO:", marca, modelo, modelos);

    useEffect(() => {
        axios.get(config.back_url + "/api/v1/vehicles/types").then(r => {
            setMarcas(r.data)
        })

        axios.get(config.back_url + "/api/v1/location/station/all").then(r => {
            logger.log("Stations: GET", r)
            setStations(r.data.map(v => v.name))
        }).catch(err => {
            logger.error("Station: GET", err);
        })

    }, [])





    useEffect(() => {

        logger.log("MARCA MODELO", marca, modelo);


        if (marca == null || marca == "") {
            setModelo("");
        }

        if (carsCache.has(marca)) {
            setModelos(carsCache.get(marca))
            return;
        }

        axios.post(config.back_url + "/api/v1/vehicles/types", { "model": marca }).then(r => {

            const modelsResult = r.data?.map(v => v.model);

            carsCache.set(marca, modelsResult);

            setModelos(modelsResult);

        })


    }, [marca])



    const initialData = currentData ? currentData : {
        color: "Gris",
        fuel_type: "GASOLINA"
    }

    return (
        <CustomForm
            schema={UnitSchemaBasicData}
            initValue={initialData}
            onSubmit={(data) => {
                logger.info(data)

                const newData = {
                    ...data,
                    make: marca,
                    model: modelo,
                    station: station

                }

                handleSubmitInternal(newData)
            }}
            classStyle="mx-auto my-4 w-full max-w-[500px] md:max-w-[100%]"
        >
            <div className="space-y-2 md:space-y-0 md:flex md:justify-around md:items-baseline">
                <div className="w-full space-y-3  px-2 max-w-[860px]">

                    <div className="md:flex md:space-x-2">

                        <FormSelectSearch
                            fieldName={"unit_type"}
                            description={'Tipo'}
                            initialValue={currentData?.unit_type ?? unitTypes[0]}
                            options={unitTypes}
                            openUp={false}
                        />

                        <SelectSearch
                            inputName={"make"}
                            label={"Marca"}
                            searhValue={marca}
                            setSearhValue={setMarca}
                            //value={state}
                            options={marcas}
                            openUp={false}

                        />
                        <SelectSearch

                            inputName={"model"}
                            label={"Modelo"}
                            options={modelos}

                            searhValue={modelo}
                            setSearhValue={setModelo}

                            openUp={false}




                        />
                    </div>

                    <div className="">
                        <SelectSearch

                            inputName={"station"}
                            label={"Estacion"}
                            options={stations}

                            searhValue={station}
                            setSearhValue={setStation}

                            openUp={false}
                            onSelected={v => {
                                setStation(v)

                            }}



                        />
                    </div>

                    <div className="md:flex md:space-x-2">
                        <FormInput
                            description={'Serial del Motor'}
                            fieldName={'motor_serial'}
                            placeholder="25FG80996645"
                        />

                        <FormInput
                            description={'Serial del Vehiculo'}
                            fieldName={'vehicle_serial'}
                            placeholder="80FG80996645"
                        />


                    </div>

                    <FormSelect
                        description={'Tipo de Combustible'}
                        fieldName={'fuel_type'}
                        placeholder="Diesel"
                        options={EnumToStringArray(FuelTypes)}
                        openUp={false}
                    />

                    <div className="md:flex  md:space-x-2">
                        <FormInput
                            description={'Alias'}
                            fieldName={'alias'}
                            placeholder="El Caballito"
                        />

                        <FormSelectSearch
                            fieldName={"color"}
                            description={'Color'}
                            initialValue={currentData?.color ?? Colors[0]}
                            options={Colors}
                            openUp={true}
                        />

                        <FormInput
                            description={'Placa'}
                            fieldName={'plate'}
                            placeholder="7HW33A"
                        />

                        <FormInput
                            description={'Año'}
                            fieldName={'year'}
                            placeholder="2022"

                        />

                    </div>
                </div>
            </div>

            <FormHiddenButton
                clickNextRef={clickNextRef}
                clickSubmitRef={clickSubmitRef}
            />
        </CustomForm>
    )
}
