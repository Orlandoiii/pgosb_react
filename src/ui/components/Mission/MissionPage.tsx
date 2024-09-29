import React, { useEffect, useState } from 'react'

import TableDataGrid from '../../core/datagrid/TableDataGrid'

import {
    MissionSchema,
    missionCrud,
    TMission,
} from '../../../domain/models/mission/mission'

import { getDefaults } from '../../core/context/CustomFormContext'
import { modalService } from '../../core/overlay/overlay_service'
import MissionForm from './Forms/MissionForm'
import LoadingModal from '../../core/modal/LoadingModal'
import LayoutContexProvider from '../../core/context/LayoutContext'
import { OverlayModalConfig } from '../../core/overlay/models/overlay_item'
import Toggle from '../../alter/components/buttons/toggle'
import { serviceCrud, ServiceFromApi, TService } from '../../../domain/models/service/service'
import { get, getById, getSummary } from '../../../services/http'
import { DetailServicesSummaryPrint } from './Print/DetailServicesSummaryPrint'
import { RelevantServicesReportPrint } from './Print/RelevantServicesReportPrint'
import { PrintView } from './Print/PrintView'
import { MissionReports } from './Print/MissionReports'
import { useUser } from '../../core/context/UserDataContext'

import { useNavigate } from 'react-router-dom'
import AlertController from '../../core/alerts/AlertController'
import { useConfirmationModal } from '../../core/modal/ModalConfirmation'
import ServiceForm from './Forms/ServiceForm'

const alertController = new AlertController();


const MissionPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false)
    const [toggle, setToggle] = useState(true)
    const [data, setData] = useState<any[]>([])


    const { modulesPermissions, userDataIsLoad, userRolData } = useUser();

    const permissions = userDataIsLoad &&
        modulesPermissions.hasOwnProperty("services") ?
        modulesPermissions["services"] : []


    const { showConfirmationModal } = useConfirmationModal();

    useEffect(() => {
        setData([])
        updateData()
    }, [toggle])

    function updateData() {
        setLoading(true)
        if (!toggle) getServices()
        else getMissions()
        setLoading(false)
    }

    async function getMissions() {
        const result = await missionCrud.getAll()
        if (result.success && result.result) {
            setData(result.result)
        }
    }

    async function getServices() {
        const result = await getSummary('mission/service')
        if (result.success && result.result) {
            setData(result.result)
        }
    }

    function openAddMissionModal() {
        showConfirmationModal("Agregar Mision",
            "¿Estás seguro de que deseas agregar una nueva misión?")
            .then((result) => {
                if (result) {
                    addNewMission();
                }
            });
    }


    async function addNewMission() {
        var errorMessage: string = ''
        try {
            setLoading(true)

            const missionResult = await missionCrud.insert(
                getDefaults<TMission>(MissionSchema)
            )

            if (missionResult.success && missionResult.result?.id) {
                modalService.pushModal(
                    MissionForm,
                    {
                        missionId: missionResult.result?.id,
                        missionCode: missionResult.result.code,
                        closeOverlay: undefined,
                    },
                    new OverlayModalConfig(),
                    updateData
                )
            } else if (!missionResult.success)
                errorMessage =
                    'Lo sentimos tenemos problemas para agregar la misión'
            else if (!missionResult.result?.id) {
                errorMessage = 'El Id no fue retornado en el agregar la misión'
            }
        } catch (error) {
            errorMessage =
                'Lo sentimos ocurrio un error inesperado al agregar la misión'
            console.error(error)
        } finally {
            setLoading(false)
        }
        if (errorMessage != '') modalService.pushAlert('Error', errorMessage)
    }

    async function openMission(service: any) {
        console.log('service', service)

        const result = await missionCrud.getById(service.id)

        if (result.success && result.result) {
            modalService.pushModal(
                MissionForm,
                {
                    initValue: result.result,
                    missionId: result.result?.id,
                    missionCode: result.result.code,
                    closeOverlay: undefined,
                },
                new OverlayModalConfig(),
                updateData
            )
        } else {
            modalService.pushAlert(
                'Error',
                `No se pudo abrir la missión por: ${result.error}`
            )
        }
    }

    function openPrintModal(service: Array<any>) {
        const list = service.map(s => s.id)
        modalService.pushModal(
            MissionReports,
            {
                servicesIds: list,
                closeOverlay: undefined,
            },
            new OverlayModalConfig(),
            updateData
        )
    }

    useEffect(() => {

        if (!userDataIsLoad || !modulesPermissions.hasOwnProperty("services")) {
            alertController.notifyInfo("Usted no tiene permiso para el modulo Roles");
            navigate("/");
            return;
        }


        if (userDataIsLoad && !userRolData.st_role) {
            alertController.notifyInfo(`Lo sentimos pero su rol se encuentra inactivo`);
            navigate("/");
            return;
        }

    }, [modulesPermissions, userDataIsLoad])

    async function editService(service: any) {
        const result = await getById("", service.id, ServiceFromApi)
        if (result.success) {
            if (result.result && result.result.missionId) {
                modalService.pushModal(
                    ServiceForm,
                    {
                        missionId: result.result.missionId,
                        initValue: result.result,
                        closeOverlay: undefined,
                    },
                    new OverlayModalConfig(),
                    updateData
                )
            }
            else modalService.toastError(`El registro retorno sin datos`)
        } else modalService.toastError(`No se pudo encontrar el registro`)
    }



    return (
        <LayoutContexProvider
            layoutName={!toggle ? 'service_layout' : 'mission_layout'}
        >
            <div className="relative flex w-full h-full overflow-hidden">
                <div
                    className={`${toggle ? '' : '-translate-x-full opacity-0'} absolute top-0 left-0 h-full w-full duration-200`}
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
                        showDownloadButton={true}
                        exportFileName="Missiones"
                        rawData={data}
                        showDeleteButton={false}
                        onAdd={openAddMissionModal}
                        onUpdate={openMission}
                        showPrintButton={false}
                        onPrint={openPrintModal}
                        onDoubleClickRow={() => { }}
                        permissions={permissions}
                        onDelete={() => { }}
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
                        showEditButton={false}
                        showDeleteButton={false}
                        showDownloadButton={true}
                        exportFileName="Servicios"
                        rawData={data}
                        onAdd={addNewMission}
                        onUpdate={editService}
                        showPrintButton={true}
                        onPrint={openPrintModal}
                        onDoubleClickRow={() => { }}
                        permissions={permissions}
                        onDelete={() => { }}
                    />
                </div>
            </div>

            <LoadingModal initOpen={loading} children={null} />
        </LayoutContexProvider>

        //  <>
        //      {/* <DetailServicesSummaryPrint services={services} groupBy={"Antares"} /> */}
        //      {/* <DetailServicesSummaryPrint services={services} groupBy={"Stations"} /> */}
        //      <RelevantServicesReportPrint services={services} missions={data}/>
        //  </>
    )
}

export default MissionPage

