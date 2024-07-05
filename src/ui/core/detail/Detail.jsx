import { useMemo } from "react";
import Accordion from "../accordion/Accordion";
import ModalContainer from "../modal/ModalContainer";
import { useLayout } from "../context/LayoutContext";
import logger from "../../../logic/Logger/logger";

export function Detail({ data, title, onClose, showDetail }) {


    const { visibleGroups } = useLayout();

    const cleanData = useMemo(() => {

        if (!data)
            return null;



        return Object.entries(visibleGroups).map(([title, items]) => {
            const d = {};

            items.fields.forEach(item => {
                const columnName = Object.keys(item)[0];
                d[columnName] = data[columnName] || '';
            });

            return {
                title,
                "data": d
            };
        });

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