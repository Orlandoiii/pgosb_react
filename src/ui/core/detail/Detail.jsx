import { useMemo } from "react";
import logger from "../../../logic/Logger/logger";
import Accordion from "../accordion/Accordion";
import ModalContainer from "../modal/ModalContainer";

export function Detail({ data, title, onClose, showDetail, configLayout, groupedData, configNames }) {

    logger.log("Renderizando Detail Config", configLayout);

    logger.log("Renderizando Detail Data", data);

    const cleanData = useMemo(() => {

        if (!data)
            return null;


        return Object.entries(groupedData).map(([title, items]) => {
            const d = {};

            items.forEach(item => {
                const columnName = Object.keys(item)[0];
                d[columnName] = data[columnName] || '';
            });

            return {
                title,
                "data": d
            };
        });

    }, [data, groupedData]);



    return (
        <ModalContainer show={showDetail} onClose={onClose} title={title} >

            {cleanData && <div className="flex flex-col space-y-1">
                {cleanData.map((v) => {
                    return <Accordion title={v.title} value={v.data} key={v.title} configNames={configNames} />
                })}
            </div>}


        </ModalContainer>
    )

}