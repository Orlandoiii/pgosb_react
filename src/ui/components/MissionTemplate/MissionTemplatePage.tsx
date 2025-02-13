import React, { useEffect, useState } from 'react'

import TableDataGrid from '../../core/datagrid/TableDataGrid'

import {
    MissionFrontSchema,
    missionCrud,
    MissionFront,
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
import { get, getAll, getById, getSummary } from '../../../services/http'
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

const alertController = new AlertController()

const MissionTemplatePage = () => {
    const [missionSummaries, setMissionSummaries] = useState<any>([])

    const [mission, setMission] = useState<MissionFront | null>(null)
    const [openMissionModal, setOpenMissionModal] = useState(false)
    const missionsActions = useMissionActions('mission/template')

    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)
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
        const result = await getAll('mission/template')
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

    return (
        <>
            <LayoutContexProvider
                layoutName={!toggle ? 'service_layout' : 'mission_layout'}
            >
                <div className="relative flex w-full h-full overflow-hidden">
                    <TableDataGrid
                        showDownloadButton={true}
                        exportFileName="Missiones"
                        rawData={missionSummaries}
                        showDeleteButton={true}
                        onAdd={openAddMissionModal}
                        onUpdate={openMission}
                        onDoubleClickRow={() => {}}
                        permissions={permissions}
                        onDelete={() => {}}
                    />
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
                />
            )}
        </>
    )
}

export default MissionTemplatePage
