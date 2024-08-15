import axios from 'axios'
import logger from '../../../logic/Logger/logger'
import { useEffect, useState } from 'react'
import { useConfig } from '../context/ConfigContext'

class State {
    id?: string | number | undefined
    name?: string | undefined
}

class Municipality {
    id?: string | number | undefined
    state_id?: string | number | undefined
    name?: string | undefined
}

class Parish {
    id?: string | number | undefined
    state_id?: string | number | undefined
    municipality_id?: string | number | undefined
    name?: string | undefined
}

class Sector {
    id?: string | number | undefined
    parish_id?: string | number | undefined
    name?: string | undefined
}

class Urbanization {
    id?: string | number | undefined
    sector_id?: string | number | undefined
    name?: string | undefined
}

class LocationRawDataClass {
    States: Array<State> | undefined
    StatesIsLoad: boolean

    Municipalitys: Array<Municipality> | undefined
    MunicipalitysIsLoad: boolean

    Parish: Array<Parish> | undefined
    ParishIsLoad: boolean

    Sector: Array<Sector> | undefined
    SectorIsLoad: boolean


    Urbanization: Array<Urbanization> | undefined
    UrbanizationIsLoad: boolean

    constructor() {
        this.States = new Array()
        this.StatesIsLoad = false

        this.Municipalitys = new Array()
        this.MunicipalitysIsLoad = false

        this.Parish = new Array()
        this.ParishIsLoad = false

        this.Sector = new Array()
        this.SectorIsLoad = false
    }
}

let LocationRawData = new LocationRawDataClass()

function SetStates(data: State[] | undefined) {
    LocationRawData.States = data
    LocationRawData.StatesIsLoad = true
}

function SetMunicipalitys(data: Municipality[] | undefined) {
    LocationRawData.Municipalitys = data
    LocationRawData.MunicipalitysIsLoad = true
}

function SetPerish(data: Parish[] | undefined) {
    LocationRawData.Parish = data
    LocationRawData.ParishIsLoad = true
}

function SetSector(data: Sector[] | undefined) {
    LocationRawData.Sector = data
    LocationRawData.SectorIsLoad = true
}

function SetUrbanization(data: Urbanization[] | undefined) {
    LocationRawData.Urbanization = data
    LocationRawData.UrbanizationIsLoad = true
}

function getEstadoId(estado) {
    const canSearch = LocationRawData?.StatesIsLoad && estado && estado != ''

    if (!canSearch) return 0

    return LocationRawData?.States?.find((state) => state.name == estado)?.id
}

function getMunicipioId(estado, municipio) {
    const stateId = getEstadoId(estado)

    if (!stateId || stateId == 0) return 0

    const canSearch =
        LocationRawData?.MunicipalitysIsLoad && municipio && municipio != ''

    if (!canSearch) return 0

    return LocationRawData?.Municipalitys?.find(
        (m) => m.state_id == stateId && m.name == municipio
    )?.id
}

function getParishId(estado, municipio, parroquia) {
    const municipioId = getMunicipioId(estado, municipio)

    if (!municipioId || municipioId == 0) return 0

    if (LocationRawData?.ParishIsLoad) {
        return LocationRawData?.Parish?.find(
            (p) => p.municipality_id == municipioId && p.name == parroquia
        )?.id
    }

    return 0
}

function getSectorId(estado, municipio, parroquia, sector) {
    const parishId = getParishId(estado, municipio, parroquia)

    if (!parishId || parishId == 0) return 0

    if (!LocationRawData?.SectorIsLoad) {
        return 0
    }

    return LocationRawData?.Sector?.find(
        (s) => s.parish_id == parishId && s.name == sector
    )?.id
}

function getUrbanizationId(estado, municipio, parroquia, sector, urbanization) {
    const sectorId = getSectorId(estado, municipio, parroquia, sector)

    if (!sectorId || sectorId == 0) return 0

    if (!LocationRawData?.UrbanizationIsLoad) {
        return 0
    }

    return LocationRawData?.Urbanization?.find(
        (s) => s.sector_id == sectorId && s.name == urbanization
    )?.id
}

function getMunicipios(stateName) {
    if (
        !stateName ||
        stateName == '' ||
        !LocationRawData.StatesIsLoad ||
        !LocationRawData.MunicipalitysIsLoad
    )
        return []

    const foundState = LocationRawData.States?.find(
        (item) => item?.name?.toLowerCase() === stateName.toLowerCase()
    )

    if (!foundState || !LocationRawData.MunicipalitysIsLoad) return []

    const result = LocationRawData.Municipalitys?.filter(
        (m) => m.state_id == foundState.id
    )

    if (!result || result.length == 0) {
        return ['N/A']
    }

    return result.map((result) => result.name)
}

function getParroquias(estado, municipio) {
    logger.log('Buscando parroquias')

    if (!estado || estado == '' || !municipio || municipio == '') return []

    if (
        !LocationRawData.StatesIsLoad ||
        !LocationRawData.MunicipalitysIsLoad ||
        !LocationRawData?.ParishIsLoad
    )
        return []

    const foundState = LocationRawData.States?.find(
        (item) => item?.name?.toLowerCase() === estado.toLowerCase()
    )

    logger.log('Buscando parroquias state', foundState)

    if (!foundState) return []

    const foundMunicipio = LocationRawData.Municipalitys?.find(
        (item) => item?.name?.toLowerCase() === municipio.toLowerCase()
    )

    if (!foundMunicipio) return []

    logger.log('Buscando parroquias muni', foundMunicipio)

    const result = LocationRawData.Parish?.filter(
        (m) => m.municipality_id == foundMunicipio.id
    )

    logger.log('Buscando parroquias; Resutl', result)

    if (!result || result.length == 0) {
        return ['N/A']
    }

    return result.map((result) => result.name)
}

function getSectores(estado, municipio, parroquia) {
    logger.log('Buscando parroquias')

    if (!estado || estado == '' || !municipio || municipio == '') return []

    if (
        !LocationRawData.StatesIsLoad ||
        !LocationRawData.MunicipalitysIsLoad ||
        !LocationRawData?.ParishIsLoad
    )
        return []

    const foundState = LocationRawData.States?.find(
        (item) => item?.name?.toLowerCase() === estado.toLowerCase()
    )

    logger.log('Buscando parroquias state', foundState)

    if (!foundState) return []

    const foundMunicipio = LocationRawData.Municipalitys?.find(
        (item) => item?.name?.toLowerCase() === municipio.toLowerCase()
    )

    if (!foundMunicipio) return []

    logger.log('Buscando parroquias muni', foundMunicipio)

    const foundParroquia = LocationRawData.Parish?.find(
        (item) => item?.name?.toLowerCase() === parroquia.toLowerCase()
    )

    if (!foundParroquia) return []

    const result = LocationRawData.Sector?.filter(
        (m) => m.parish_id == foundParroquia.id
    )

    if (!result || result.length == 0) {
        return ['N/A']
    }

    return result.map((result) => result.name)
}

function getUrbanizations(estado, municipio, parroquia, sector) {


    const sectorId = getSectorId(estado, municipio, parroquia, sector)

    if (!sectorId)
        return []

    if (!LocationRawData.UrbanizationIsLoad)
        return []


    const result = LocationRawData.Urbanization?.filter(
        (m) => m.sector_id == sectorId
    )

    if (!result || result.length == 0) {
        return ['N/A']
    }

    return result.map((result) => result.name)
}


async function makeRequest(endpoint, token, setData) {
    axios
        .get(endpoint, {
            cancelToken: token,
        })
        .then((response) => {
            if (response.status >= 200 && response.status <= 299) {
                logger.log('DATA:', response.data)
                setData(response.data)
            }
        })
        .catch((err) => {
            logger.error(err)
        })
}

export function useLocation(
    initEstado,
    initMunicipio,
    initParroquia,
    initSector,
    initUrbanization
) {

    const [states, setStates] = useState(
        LocationRawData.StatesIsLoad
            ? LocationRawData?.States?.map((s) => s.name)
            : ['Miranda']
    )

    const [estado, setEstado] = useState(initEstado ?? 'MIRANDA')

    const [estadoId, setEstadoId] = useState<string | number | undefined>(0)

    const canLoadMunicipios =
        LocationRawData.StatesIsLoad &&
        LocationRawData.MunicipalitysIsLoad &&
        estado &&
        estado != ''

    const [municipios, setMunicipios] = useState(
        canLoadMunicipios ? getMunicipios(estado) : []
    )

    const [municipio, setMunicipio] = useState(initMunicipio ?? '')

    const [municipioId, setMunicipioId] = useState<string | number | undefined>(
        0
    )

    const canLoadParroquias =
        canLoadMunicipios &&
        LocationRawData.ParishIsLoad &&
        municipio &&
        municipio != ''

    const [parroquias, setParroquias] = useState(
        canLoadParroquias ? getParroquias(estado, municipio) : []
    )
    const [parroquia, setParroquia] = useState(initParroquia ?? '')

    const [parroquiaId, setParroquiaId] = useState<string | number | undefined>(
        0
    )

    const canLoadSectores =
        canLoadParroquias &&
        LocationRawData.SectorIsLoad &&
        parroquia &&
        parroquia != ''

    const [sectores, setSectores] = useState(
        canLoadSectores ? getSectores(estado, municipio, parroquia) : []
    )
    const [sector, setSector] = useState(initSector ?? '')

    const [sectorId, setSectorId] = useState<string | number | undefined>(0)


    const canLoadUrbanizaciones =
        canLoadSectores &&
        LocationRawData.UrbanizationIsLoad &&
        sector &&
        sector != ''

    const [urbanizaciones, setUrbanizaciones] = useState(
        canLoadUrbanizaciones ? getUrbanizations(estado, municipio, parroquia, sector) : []
    )
    const [urbanizacion, setUrbanizacion] = useState(initUrbanization ?? '')

    const [urbanizationId, setUrbanizationId] = useState<string | number | undefined>(0)


    const { config } = useConfig()





    function SetStatesLocally(data) {
        if (!LocationRawData.StatesIsLoad) {
            SetStates(data)
        }
        setStates(LocationRawData?.States?.map((s) => s.name))
    }

    function SetMunicipalityLocally(data) {
        if (!LocationRawData.MunicipalitysIsLoad) {
            SetMunicipalitys(data)
        }

        if (LocationRawData.StatesIsLoad && LocationRawData.MunicipalitysIsLoad)
            setMunicipios(getMunicipios(estado))
    }

    function SetParishLocally(data) {
        if (!LocationRawData.ParishIsLoad) {
            SetPerish(data)
        }

        if (
            LocationRawData.StatesIsLoad &&
            LocationRawData.MunicipalitysIsLoad &&
            LocationRawData.ParishIsLoad
        )
            setParroquias(getParroquias(estado, municipio))
    }

    function SetSectorLocally(data) {
        if (!LocationRawData.SectorIsLoad) {
            SetSector(data)
        }

        if (
            LocationRawData.StatesIsLoad &&
            LocationRawData.MunicipalitysIsLoad &&
            LocationRawData.ParishIsLoad &&
            LocationRawData.SectorIsLoad
        )
            setSectores(getSectores(estado, municipio, parroquia))
    }

    function SetUrbanizationLocally(data) {
        if (!LocationRawData.UrbanizationIsLoad) {
            SetUrbanization(data)
        }

        if (
            LocationRawData.StatesIsLoad &&
            LocationRawData.MunicipalitysIsLoad &&
            LocationRawData.ParishIsLoad &&
            LocationRawData.SectorIsLoad &&
            LocationRawData.UrbanizationIsLoad
        )
            setUrbanizaciones(getUrbanizations(estado, municipio, parroquia, sector))
    }

    logger.log(
        'RENDERIZANDO FORM LOCATION:-1',
        initEstado,
        initMunicipio,
        initParroquia
    )

    logger.log('RENDERIZANDO FORM LOCATION:-2', estado, municipio, parroquia)

    useEffect(() => {
        const cancelTokenSource = axios.CancelToken.source()

        const endpointState =
            `${config.back_url}` + '/api/v1/location/state/all'

        if (!LocationRawData.StatesIsLoad)
            makeRequest(
                endpointState,
                cancelTokenSource.token,
                SetStatesLocally
            )

        const endpointMunicipality =
            `${config.back_url}` + '/api/v1/location/municipality/all'

        if (!LocationRawData.MunicipalitysIsLoad)
            makeRequest(
                endpointMunicipality,
                cancelTokenSource.token,
                SetMunicipalityLocally
            )

        const endpointParish =
            `${config.back_url}` + '/api/v1/location/parish/all'

        if (!LocationRawData.ParishIsLoad)
            makeRequest(
                endpointParish,
                cancelTokenSource.token,
                SetParishLocally
            )

        const endpointSector =
            `${config.back_url}` + '/api/v1/location/sector/all'

        if (!LocationRawData.SectorIsLoad)
            makeRequest(
                endpointSector,
                cancelTokenSource.token,
                SetSectorLocally
            )

        const endpointUrbanization =
            `${config.back_url}` + '/api/v1/location/urbanization/all'

        if (!LocationRawData.UrbanizationIsLoad)
            makeRequest(
                endpointUrbanization,
                cancelTokenSource.token,
                SetUrbanizationLocally
            )

        return () => {
            cancelTokenSource.cancel('unmonted')
        }
    }, [])

    useEffect(() => {
        if (estado == null || estado == '') {
            setMunicipio('')
            setMunicipios([])
            return
        }

        setEstadoId(getEstadoId(estado) ?? 0)

        let m = getMunicipios(estado)

        setMunicipios(m)
        // if (m[0])
        //     setMunicipio(m[0])
    }, [estado])

    useEffect(() => {
        if (municipio == null || municipio == '') {
            setParroquia('')
            setParroquias([])
            return
        }

        let p = getParroquias(estado, municipio)

        setMunicipioId(getMunicipioId(estado, municipio) ?? 0)

        setParroquias(p)
        // if (p[0])
        //     setParroquia(p[0]);
    }, [estado, municipio])

    useEffect(() => {
        if (!parroquia || parroquia == '') {
            setSector('')
            setSectores([])
            return
        }

        let sec = getSectores(estado, municipio, parroquia)

        setParroquiaId(getParishId(estado, municipio, parroquia) ?? 0)

        setSectores(sec)
    }, [estado, municipio, parroquia])

    useEffect(() => {

        if (!sector || sector == "") {
            setUrbanizacion("")
            setUrbanizaciones([])
            return

        }

        let urb = getUrbanizations(estado, municipio, parroquia, sector)

        setSectorId(getSectorId(estado, municipio, parroquia, sector))

        setUrbanizaciones(urb)
    }, [estado, municipio, parroquia, sector])


    useEffect(() => {
        if (
            !estado ||
            estado == '' ||
            !municipio ||
            municipio == '' ||
            !parroquia ||
            parroquia == '' ||
            !sector ||
            sector == '' ||
            urbanizacion ||
            urbanizacion == ''
        )
            return

        setUrbanizationId(getUrbanizationId(estado, municipio, parroquia, sector, urbanizacion) ?? 0)
    }, [estado, municipio, parroquia, sector])

    return {
        states,
        state: estado,

        municipalitys: municipios,
        municipality: municipio,

        parishs: parroquias,
        parish: parroquia,

        sectores: sectores,
        sector: sector,

        urbanizaciones: urbanizaciones,
        urbanizacion: urbanizacion,


        setState: setEstado,
        setMunicipality: setMunicipio,
        setParish: setParroquia,
        setSector: setSector,
        setUrbanizacion: setUrbanizacion,

        estadoId,
        municipioId,
        parroquiaId,
        sectorId,
        urbanizationId
    }
}
