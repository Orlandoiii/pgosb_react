import React, { useState } from "react";

import ModalLayout from "../../../core/layouts/modal_layout";
import Chips from "../../../alter/components/menus/chips";
import { PrintView } from "./PrintView";
import { DetailServicesSummaryPrint } from "./DetailServicesSummaryPrint";
import { RelevantServicesReportPrint } from "./RelevantServicesReportPrint";
import { EnumToStringArray } from "../../../../utilities/converters/enum_converter";
import { NewsSummaryPrint } from "./NewsSummaryPrint";

interface MissionReportsProps {
    servicesIds: string[]
    filters: { name: string, value: string }[]
    closeOverlay?: () => void
}

enum reportTypes {
    StatisticsForAntares = "Estadísticas por Antares",
    StatisticsForAntaresTypes = "Estadísticas por Tipos de Antares",
    StatisticsForStation = "Estadísticas por Estaciones",
    ServiceDetails = "Servicios detallados",
    NewsSummary = "Resumen de Novedades",
}

export function MissionReports({ servicesIds, filters, closeOverlay }: MissionReportsProps) {
    const [selectedReport, setSelectedReport] = useState<string>(reportTypes.StatisticsForAntares)
    const reports: string[] = EnumToStringArray(reportTypes)

    return <ModalLayout
        title={'Registro de Persona'}
        onClose={closeOverlay}
    ><div className="h-[80vh] w-[80vw] flex flex-col p-6">
            <div className="relative flex h-full w-full space-x-8">
                <div className="flex h-full w-72 flex-col space-y-4 flex-none ">
                    <Chips options={reports} direction="Vertical" selectedOption={selectedReport} onSelectionChanged={setSelectedReport} />
                </div>

                <div className="h-full w-full flex flex-col rounded-lg border border-slate-400 bg-slate-300 overflow-auto">
                    <PrintView>
                        {selectedReport === reportTypes.StatisticsForAntares &&
                            <DetailServicesSummaryPrint servicesIds={servicesIds} groupBy={'Antares'} filters={filters} />
                        }

                        {selectedReport === reportTypes.StatisticsForAntaresTypes &&
                            <DetailServicesSummaryPrint servicesIds={servicesIds} groupBy={'AntaresTypes'} filters={filters} />
                        }

                        {selectedReport === reportTypes.StatisticsForStation &&
                            <DetailServicesSummaryPrint servicesIds={servicesIds} groupBy={'Stations'} filters={filters} />
                        }

                        {selectedReport === reportTypes.ServiceDetails &&
                            <RelevantServicesReportPrint servicesIds={servicesIds} filters={filters} />
                        }

                        {selectedReport === reportTypes.NewsSummary &&
                            <NewsSummaryPrint servicesIds={servicesIds} filters={filters} />
                        }

                    </PrintView>

                </div>
            </div>
        </div>
    </ModalLayout>
}