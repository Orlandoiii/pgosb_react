import React, { useState } from "react";
import { FaSquare, FaCheckSquare, FaMinusSquare } from "react-icons/fa";
import { IoMdArrowDropright } from "react-icons/io";
import TreeView, { flattenTree } from "react-accessible-treeview";
import cx from "classnames";
import "./style.css";
const folder = {
    name: "",
    children: [
        {

            name: "Miranda",
            children: [
                { name: "Chacao" },
                { name: "Hatillo" },
                {
                    name: "Baruta",
                    children: [
                        { name: "Altamira" },
                        {
                            name: "El Cigarral",
                            children: [
                                { name: "los Naranjos" },
                                { name: "El Cigarral" },
                                { name: "La Lagunita" },
                            ],
                        },


                    ],
                },
            ],
        },
        {

            name: "Caracas",
            children: [
                {
                    name: "Libertador",
                    children: [
                        { name: "El Paraíso" },
                        { name: "El Recreo" },

                    ],
                },

            ],
        },
        {
            name: "Bolivar"

        },
    ],
};

const ArrowIcon = ({ isOpen, className }) => {
    const baseClass = "arrow";
    const classes = cx(
        baseClass,
        { [`${baseClass}--closed`]: !isOpen },
        { [`${baseClass}--open`]: isOpen },
        className
    );
    return <IoMdArrowDropright className={classes} />;
};

const CheckBoxIcon = ({ variant, ...rest }) => {
    switch (variant) {
        case "all":
            return <FaCheckSquare {...rest} />;
        case "none":
            return <FaSquare {...rest} />;
        case "some":
            return <FaMinusSquare {...rest} />;
        default:
            return null;
    }
};

const data = flattenTree(folder);

export default function TreeViewCustom() {
    const [selectedIds, setSelectedIds] = useState([]);

    const onKeyDown = (e) => {
        if (e.key === "Enter") {
            getAndSetIds();
        }
    };

    const getAndSetIds = () => {
        setSelectedIds(
            document
                .querySelector("#txtIdsToSelect")
                .value.split(",")
                .filter(val => !!val.trim())
                .map((x) => {
                    if (isNaN(parseInt(x.trim()))) {
                        return x;
                    }
                    return parseInt(x.trim());
                })
        );
    };

    return (
        <div>

            <div className="checkbox">
                <TreeView
                    data={data}
                    aria-label="Checkbox tree"
                    multiSelect
                    selectedIds={selectedIds}
                    defaultExpandedIds={[1]}
                    propagateSelect
                    propagateSelectUpwards
                    togglableSelect
                    onSelect={(props) => console.log('onSelect callback: ', props)}
                    onNodeSelect={(props) => console.log('onNodeSelect callback: ', props)}
                    nodeRenderer={({
                        element,
                        isBranch,
                        isExpanded,
                        isSelected,
                        isHalfSelected,
                        isDisabled,
                        getNodeProps,
                        level,
                        handleSelect,
                        handleExpand,
                    }) => {
                        return (
                            <div
                                {...getNodeProps({ onClick: handleExpand })}
                                style={{
                                    marginLeft: 40 * (level - 1),

                                }}
                                className="flex space-x-3 space-y-1 items-center "
                            >
                                {isBranch && <ArrowIcon isOpen={isExpanded} />}
                                <CheckBoxIcon
                                    className="checkbox-icon "
                                    onClick={(e) => {
                                        handleSelect(e);
                                        e.stopPropagation();
                                    }}
                                    variant={
                                        isHalfSelected ? "some" : isSelected ? "all" : "none"
                                    }
                                />
                                <span className="name">
                                    {element.name}
                                </span>
                            </div>
                        );
                    }}
                />
            </div>
        </div>
    );
}



