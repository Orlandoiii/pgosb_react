import { useContext, useEffect, useState } from 'react'
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
import { useConfig } from '../../../../logic/Config/ConfigContext'
import SelectSearch from '../../../core/inputs/SelectSearch'
import FormSelect from '../../../core/inputs/FormSelect'
import { FuelTypes } from '../../../../domain/abstractions/enums/fuel_types'



// const stations = ['Station 1', 'Station 2', 'Station 3']

export default function BasicInfoForm({ clickSubmitRef, onSubmit }) {
    const { clickNextRef, currentData, Next } = useContext(StepContext)
    const unitTypes = EnumToStringArray(UnitTypes)

    function handleSubmitInternal(data) {
        if (onSubmit) onSubmit(data)

        if (Next) Next(data)
    }

    const { config } = useConfig();

    const [marcas, setMarcas] = useState([])

    const [marca, setMarca] = useState(currentData?.make ?? "");

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
        axios.post(config.back_url + "/api/v1/vehicles/types", { "model": marca }).then(r => {
            setModelos(r.data?.map(v => v.model));
            setModelo("");
        })
    }, [marca])



    return (
        <CustomForm
            schema={UnitSchemaBasicData}
            initValue={currentData}
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
                <div className="w-full space-y-4 px-2 max-w-[720px]">
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
                            onSelected={v => {
                                setMarca(v);



                            }}
                        />
                        <SelectSearch

                            inputName={"model"}
                            label={"Modelo"}
                            options={modelos}

                            searhValue={modelo}
                            setSearhValue={setModelo}

                            openUp={false}
                            onSelected={v => {
                                setModelo(v)

                            }}



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

                        <FormSelect
                            description={'Tipo de Combustible'}
                            fieldName={'fuel_type'}
                            placeholder="Diesel"
                            options={EnumToStringArray(FuelTypes)}
                            openUp={false}
                        />
                    </div>

                    <div className="md:flex  md:space-x-2">
                        <div className="md:w-[w-[50%]]">
                            <FormInput
                                description={'Alias'}
                                fieldName={'alias'}
                                placeholder="El Caballito"
                            />
                        </div>

                        <div className="md:w-[25%]">
                            <FormSelectSearch
                                fieldName={"color"}
                                description={'Color'}
                                initialValue={currentData?.color ?? Colors[0]}
                                options={Colors}
                                openUp={true}
                            />
                        </div>

                        <div className="md:w-[25%]">
                            <FormInput
                                description={'Placa'}
                                fieldName={'plate'}
                                placeholder="7HW33A"
                            />
                        </div>

                        <div className="md:w-[18%]">
                            <FormInput
                                description={'Año'}
                                fieldName={'year'}
                                placeholder="2022"
                                mask={Number}
                            />
                        </div>
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
