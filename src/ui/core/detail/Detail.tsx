import React from "react";
import { useMemo } from "react";
import Accordion from "../accordion/Accordion";
import ModalContainer from "../modal/ModalContainer";
import { useLayout } from "../context/LayoutContext";
import logger from "../../../logic/Logger/logger";

export function Detail({ data, title, onClose, showDetail }) {


    const { visibleGroups } = useLayout();

    logger.log("DETALLE GROUP:", visibleGroups);

    logger.log("DETALLE DATA:", data);

    const cleanData = useMemo(() => {

        if (!data)
            return null;



        const firstClean = Object.entries(visibleGroups).map(([title, items]) => {
            const d = {};

            items?.fields?.forEach(item => {
                const columnName = Object.keys(item)[0];
                if (data[columnName])
                    d[columnName] = data[columnName];
            });

            return {
                title,
                "data": d
            };
        });

        return firstClean




    }, [data, visibleGroups]);



    return (
        <ModalContainer show={showDetail} onClose={onClose} title={title} >

            {cleanData && <div className="flex flex-col space-y-1">
                {cleanData.map((v) => {
                    return <Accordion title={v.title} value={v.data} key={v.title} />
                })}
            </div>}


        </ModalContainer>
    )

}