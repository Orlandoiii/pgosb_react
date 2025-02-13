import React, { useEffect, useState } from 'react'

import TableDataGrid from '../../core/datagrid/TableDataGrid'

import {
    MissionFrontSchema,
    missionCrud,
    MissionFront,
    MissionFromApi,
    MissionToApi,
} from '../../../domain/models/mission/mission'

import { getDefaults } from '../../core/context/CustomFormContext'
import { modalService } from '../../core/overlay/overlay_service'
import MissionForm from './Forms/MissionForm'
import LoadingModal, {
    ReactiveLoadModalContextProvider,
} from '../../core/modal/LoadingModal'
import LayoutContexProvider from '../../core/context/LayoutContext'
import { OverlayModalConfig } from '../../core/overlay/models/overlay_item'
import Toggle from '../../alter/components/buttons/toggle'
import {
    serviceCrud,
    ServiceFromApi,
    TService,
} from '../../../domain/models/service/service'
import {
    get,
    getAll,
    getById,
    getGroup,
    getSummary,
    insert,
} from '../../../services/http'
import { DetailServicesSummaryPrint } from './Print/DetailServicesSummaryPrint'
import { RelevantServicesReportPrint } from './Print/RelevantServicesReportPrint'
import { PrintView } from './Print/PrintView'
import { MissionReports } from './Print/MissionReports'
import { useUser } from '../../core/context/UserDataContext'

import { useNavigate } from 'react-router-dom'
import AlertController from '../../core/alerts/AlertController'
import { useConfirmationModal } from '../../core/modal/ModalConfirmation'
import { ResultErr } from '../../../domain/abstractions/types/resulterr'
import { executeAndValidate } from '../../optimized/Utilities/execute_and_validate'
import {
    useMissionActions,
    useMissionCollection,
} from '../../../domain/models/mission/use_collection'
import { formatDateString } from '../../optimized/Utilities/date_string_formatter'
import ModalLayout from '../../optimized/components/layouts/modal_layout'
import Backdrop from '../../core/modal/Backdrop'
import LinearDots from '../../core/icons/LinearDots'
import {
    MissionServiceFromApi,
    MissionServiceToApi,
} from '../../../domain/models/mission/service/mission_service'
import {
    MissionUnitFromApi,
    MissionUnitToApi,
} from '../../../domain/models/mission/unit/mission_unit'
import {
    MissionFirefighterFromApi,
    MissionFirefighterToApi,
} from '../../../domain/models/mission/firefighter/mission_firefighter'
import {
    MissionLocationFromApi,
    MissionLocationToApi,
} from '../../../domain/models/mission/location/mission_location'
import { Modal } from '../../optimized/components/layouts/modal'

const alertController = new AlertController()

const MissionPage = () => {
    const [missionSummaries, setMissionSummaries] = useState<any>([])

    const [mission, setMission] = useState<MissionFront | null>(null)
    const [openMissionModal, setOpenMissionModal] = useState(false)
    const missionsActions = useMissionActions()

    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)
    const [creatingMissionFromTemplate, setCreatingMissionFromTemplate] =
        useState(false)
    const [toggle, setToggle] = useState(true)
    const [data, setData] = useState<any[]>([])

    const { modulesPermissions, userDataIsLoad, userRolData } = useUser()

    const permissions =
        userDataIsLoad && modulesPermissions.hasOwnProperty('services')
            ? modulesPermissions['services']
            : []

    useEffect(() => {
        UpdatemissionSummaries()
    }, [])

    const { showConfirmationModal } = useConfirmationModal()

    async function UpdatemissionSummaries() {
        setLoading(true)
        const result = await getAll('mission')
        setLoading(false)
        if (result.success) {
            setMissionSummaries(result.result)
        }
    }

    useEffect(() => {
        setData([])
        updateData()
    }, [toggle])

    function updateData() {
        if (!toggle) getServices()
        else getMissions()
    }

    async function getMissions() {
        try {
            setLoading(true)

            const result = await missionCrud.getAll()
            if (result.success && result.result) {
                setData(result.result)
            }
        } finally {
            setLoading(false)
        }
    }

    async function getServices() {
        const result = await getSummary('mission/service')
        if (result.success && result.result) {
            setData(result.result)
        }
    }

    function openAddMissionModal() {
        showConfirmationModal(
            'Agregar Mision',
            '¿Estás seguro de que deseas agregar una nueva misión?'
        ).then((result) => {
            if (result) {
                addNewMission()
            }
        })
    }

    async function addNewMission() {
        // let defaultMission = getDefaults<MissionFront>(MissionFrontSchema)
        // defaultMission.manualMissionDate = formatDateString(new Date)

        // const result = await executeAndValidate(
        //     "misión", 'FEMALE', 'guardar',
        //     async () => await missionsActions.insertFront(
        //         defaultMission
        //     ),
        //     setLoading,
        //     'id'
        // );

        // if (result.success && result.result) setMission(result.result)
        setOpenMissionModal(true)
    }

    async function openMission(service: any) {
        const result = await missionsActions.getById(service.id)
        if (result.success && result.result) {
            setMission(result.result)
            setOpenMissionModal(true)
        }
    }

    async function openMissionById(id: string) {
        const result = await missionsActions.getById(id)
        if (result.success && result.result) {
            setMission(result.result)
            setOpenMissionModal(true)
        }
    }

    function openPrintModal(missions: any) {
        const missionsIDs = missions.data.map((s) => s.id)
        console.log(missions)

        const filters = (
            Object.entries(missions.filters) as [string, any][]
        ).map(([key, { value }]) => ({
            name: key,
            value: value,
        }))

        modalService.pushModal(
            MissionReports,
            {
                missionsIds: missionsIDs,
                filters: filters,
                closeOverlay: undefined,
            },
            new OverlayModalConfig(),
            updateData
        )
    }

    useEffect(() => {
        if (!userDataIsLoad || !modulesPermissions.hasOwnProperty('services')) {
            alertController.notifyInfo(
                'Usted no tiene permiso para el modulo Roles'
            )
            navigate('/')
            return
        }

        if (userDataIsLoad && !userRolData.st_role) {
            alertController.notifyInfo(
                `Lo sentimos pero su rol se encuentra inactivo`
            )
            navigate('/')
            return
        }
    }, [modulesPermissions, userDataIsLoad])

    async function editService(service: any) {
        const result = await getById(
            'mission/service',
            service.id,
            ServiceFromApi
        )
        if (result.success) {
            if (result.result && result.result.missionId) {
                // modalService.pushModal(
                //     ServiceForm,
                //     {
                //         missionId: result.result.missionId,
                //         initValue: result.result,
                //         closeOverlay: undefined,
                //     },
                //     new OverlayModalConfig(),
                //     updateData
                // )
            } else modalService.toastError(`El registro retorno sin datos`)
        } else modalService.toastError(`No se pudo encontrar el registro`)
    }
    console.log(mission)

    async function CreateMissionFromTemplate(templateId: string) {
        let successful = false
        let missionId = ''

        try {
            setCreatingMissionFromTemplate(true)
            let newMission = getDefaults<MissionFront>(MissionFrontSchema)

            const missionTemplate = await getById(
                'mission/template',
                templateId,
                MissionFromApi
            )

            if (newMission && missionTemplate.success) {
                newMission.alias = `PLANTILLA - ${missionTemplate.result?.alias}`
                newMission.stationId = missionTemplate.result?.stationId ?? ''

                newMission.locationId = missionTemplate.result?.locationId ?? ''
                newMission.locationDestinyId =
                    missionTemplate.result?.locationDestinyId ?? ''
                newMission.operativeAreas =
                    missionTemplate.result?.operativeAreas ?? []
                newMission.level = missionTemplate.result?.level ?? ''
                newMission.peaceQuadrant =
                    missionTemplate.result?.peaceQuadrant ?? ''

                const parsed = MissionToApi(newMission)

                if (parsed.success) {
                    const result = await insert<MissionFront>(
                        'mission',
                        parsed.result
                    )

                    if (result.success) {
                        if (result.result?.id) {
                            successful = true

                            missionId = result.result.id
                            await UpdateMissionServices(templateId, missionId)
                            await UpdateMissionUnits(templateId, missionId)
                            await UpdateMissionFirefighter(
                                templateId,
                                missionId
                            )
                            await UpdateMissionLocations(templateId, missionId)
                        } else
                            alertController.notifyError(
                                `La misión no retornó el ID`
                            )
                    } else
                        alertController.notifyError(
                            `No se pudo agregar la misión`
                        )
                } else
                    alertController.notifyError(`No se pudo agregar la misión`)
            }
        } finally {
            if (successful) openMissionById(missionId)
            setCreatingMissionFromTemplate(false)
        }
    }

    async function UpdateMissionServices(id: string, mission_id: string) {
        const services = await getGroup(
            'mission/service/template',
            id,
            MissionServiceFromApi
        )

        if (services.success) {
            await services.result?.forEach(async (service) => {
                service.id = ''
                service.missionId = mission_id
                const serviceMap = MissionServiceToApi(service)

                if (serviceMap.success)
                    await insert('mission/service', serviceMap.result)
            })
        }
    }

    async function UpdateMissionUnits(id: string, mission_id: string) {
        const units = await getGroup(
            'mission/unit/template',
            id,
            MissionUnitFromApi
        )

        if (units.success) {
            console.log('template group unit', units)

            await units.result?.forEach(async (unit) => {
                unit.missionId = mission_id
                const unitMap = MissionUnitToApi(unit)

                if (unitMap.success)
                    await insert('mission/unit', unitMap.result)
                else console.log('Not parsed unit')
            })
        }
    }

    async function UpdateMissionFirefighter(id: string, mission_id: string) {
        const firefighters = await getGroup(
            'mission/firefighter/template',
            id,
            MissionFirefighterFromApi
        )

        if (firefighters.success) {
            await firefighters.result?.forEach(async (firefighter) => {
                firefighter.missionId = mission_id
                const firefighterMap = MissionFirefighterToApi(firefighter)

                if (firefighterMap.success)
                    await insert('mission/firefighter', firefighterMap.result)
            })
        }
    }

    async function UpdateMissionLocations(id: string, mission_id: string) {
        const locations = await getGroup(
            'mission/location/template',
            id,
            MissionLocationFromApi
        )

        if (locations.success) {
            await locations.result?.forEach(async (location) => {
                location.id = ''
                location.missionId = mission_id
                const locationMap = MissionLocationToApi(location)

                if (locationMap.success)
                    await insert('mission/location', locationMap.result)
            })
        }
    }

    return (
        <>
            <LayoutContexProvider
                layoutName={!toggle ? 'service_layout' : 'mission_layout'}
            >
                <div className="relative flex w-full h-full overflow-hidden">
                    <div
                        className={`${toggle ? '' : '-translate-x-full opacity-0'} absolute top-0 left-0 h-full w-full duration-200`}
                    >
                        <TableDataGrid
                            // child={
                            //     <Toggle
                            //         useActiveColors={false}
                            //         toggle={toggle}
                            //         toggleChanged={() => setToggle(!toggle)}
                            //         option1="Misiones"
                            //         option2="Servicios"
                            //     />
                            // }
                            showDownloadButton={true}
                            exportFileName="Missiones"
                            rawData={missionSummaries}
                            showDeleteButton={false}
                            onAdd={openAddMissionModal}
                            onUpdate={openMission}
                            showPrintButton={true}
                            onPrint={openPrintModal}
                            onDoubleClickRow={() => {}}
                            permissions={permissions}
                            onDelete={() => {}}
                        />
                    </div>

                    <div
                        className={`${toggle ? 'translate-x-full opacity-0' : ''} absolute top-0 left-0 h-full w-full duration-200`}
                    >
                        <TableDataGrid
                            child={
                                <Toggle
                                    useActiveColors={false}
                                    toggle={toggle}
                                    toggleChanged={() => setToggle(!toggle)}
                                    option1="Misiones"
                                    option2="Servicios"
                                />
                            }
                            showAddButton={false}
                            showEditButton={true}
                            showDeleteButton={false}
                            showDownloadButton={true}
                            exportFileName="Servicios"
                            rawData={data}
                            onAdd={addNewMission}
                            onUpdate={editService}
                            showPrintButton={true}
                            onPrint={openPrintModal}
                            onDoubleClickRow={() => {}}
                            permissions={permissions}
                            onDelete={() => {}}
                        />
                    </div>
                </div>
            </LayoutContexProvider>

            <ReactiveLoadModalContextProvider open={loading} />

            {openMissionModal && (
                <MissionForm
                    isVisible={openMissionModal}
                    initValue={mission}
                    closeOverlay={() => {
                        setMission(null)
                        setOpenMissionModal(false)
                        UpdatemissionSummaries()
                    }}
                    reOpen={(id) => {
                        setMission(null)
                        setOpenMissionModal(false)
                        CreateMissionFromTemplate(id)
                    }}
                />
            )}
            {creatingMissionFromTemplate && (
                <Modal
                    animation={'FadeIn'}
                    isVisible={true}
                    // onClose={closeOverlay}
                >
                    <Backdrop>
                        <div
                            onClick={(e) => e.stopPropagation()}
                            className={`
               flex justify-center items-center  
               min-h-[320px] min-w-[320px] md:min-h-[380px]  md:min-w-[460px]`}
                        >
                            <LinearDots height={100} />
                        </div>
                    </Backdrop>
                </Modal>
            )}
        </>
    )
}

export default MissionPage
