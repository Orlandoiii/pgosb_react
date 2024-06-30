import { useMemo } from "react";
import logger from "../../../logic/Logger/logger";
import Accordion from "../accordion/Accordion";
import ModalContainer from "../modal/ModalContainer";

export function Detail({ data, title, onClose, showDetail, configLayout }) {

    logger.log("Renderizando Detail Config", configLayout);

    logger.log("Renderizando Detail Data", data);

    const groupedData = useMemo(() => {

        if (!configLayout) {
            return null;
        }

        return configLayout.reduce((acc, obj) => {
            const group = obj.group_name;
            acc[group] ||= []; // Conditional nullish assignment for cleaner initialization
            acc[group].push({ [obj.column_name]: obj.display_name });
            return acc;
        }, {});

    }, [configLayout]);

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


    const configNames = useMemo(() => {
        if (!groupedData)
            return null;

        let c = {};

        Object.entries(groupedData).forEach((v, _) => {

            logger.log("DETAIL", v[1]);

            const singleObject = Object.assign({}, ...v[1]);

            c = { ...c, ...singleObject };


        })

        return c;

    }, [groupedData]);


    // logger.log("DETAIL GROUP DATA:", groupedData);

    // logger.log("DETAIL CLEAN DATA:", cleanData);


    // logger.log("DETAIL CONFIG NAMES:", configNames);


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