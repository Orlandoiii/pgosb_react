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
import { serviceCrud, TService } from '../../../domain/models/service/service'
import { get, getSummary } from '../../../services/http'
import { DetailServicesSummaryPrint } from './Print/DetailServicesSummaryPrint'
import { RelevantServicesReportPrint } from './Print/RelevantServicesReportPrint'

const MissionPage = () => {
    const [loading, setLoading] = useState(false)
    const [toggle, setToggle] = useState(true)
    const [data, setData] = useState<any[]>([])

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

    return (
        // <LayoutContexProvider
        //     layoutName={!toggle ? 'service_layout' : 'mission_layout'}
        // >
        //     <div className="relative flex w-full h-full overflow-hidden">
        //         <div
        //             className={`${toggle ? '' : '-translate-x-full opacity-0'} absolute top-0 left-0 h-full w-full duration-200`}
        //         >
        //             <TableDataGrid
        //                 child={
        //                     <Toggle
        //                         useActiveColors={false}
        //                         toggle={toggle}
        //                         toggleChanged={() => setToggle(!toggle)}
        //                         option1="Misiones"
        //                         option2="Servicios"
        //                     />
        //                 }
        //                 showDownloadButton={true}
        //                 exportFileName="Missiones"
        //                 rawData={data}
        //                 onAdd={addNewMission}
        //                 onUpdate={openMission}
        //                 onDoubleClickRow={() => {}}
        //                 permissions={{
        //                     add: true,
        //                     delete: true,
        //                     export: true,
        //                     print: true,
        //                     update: true,
        //                 }}
        //                 onDelete={() => {}}
        //             />
        //         </div>

        //         <div
        //             className={`${toggle ? 'translate-x-full opacity-0' : ''} absolute top-0 left-0 h-full w-full duration-200`}
        //         >
        //             <TableDataGrid
        //                 child={
        //                     <Toggle
        //                         useActiveColors={false}
        //                         toggle={toggle}
        //                         toggleChanged={() => setToggle(!toggle)}
        //                         option1="Misiones"
        //                         option2="Servicios"
        //                     />
        //                 }
        //                 showAddButton={false}
        //                 showEditButton={false}
        //                 showDeleteButton={false}
        //                 showDownloadButton={true}
        //                 exportFileName="Servicios"
        //                 rawData={data}
        //                 onAdd={addNewMission}
        //                 onUpdate={openMission}
        //                 onDoubleClickRow={() => {}}
        //                 permissions={{
        //                     add: true,
        //                     delete: true,
        //                     export: true,
        //                     print: true,
        //                     update: true,
        //                 }}
        //                 onDelete={() => {}}
        //             />
        //         </div>
        //     </div>

        //     <LoadingModal initOpen={loading} children={null} />
        // </LayoutContexProvider>

         <>
             {/* <DetailServicesSummaryPrint services={services} groupBy={"Antares"} /> */}
             {/* <DetailServicesSummaryPrint services={services} groupBy={"Stations"} /> */}
             <RelevantServicesReportPrint services={services} missions={data}/>
         </>
    )
}

export default MissionPage



const services : TService[] = [
    {
        id: "1",
        missionId: "1",
        antaresId: "3",
        stationId: "1",
        units: ["A321" , "AS565"],
        firefighter: ["001", "002"],
        unharmed: "5",
        injured: "2",
        transported: "0",
        deceased: "0",
        isImportant: true,
        operativeAreas: [""]
    }
]