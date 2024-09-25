import { ReactNode, useEffect, useState } from "react";
import React from "react";

export interface RelativeDropProps {
    relativeContainer: HTMLElement;
    Position?: "TOP" | "BOTTOM";
    gap?: string;
    children?: ReactNode;
}

function RelativeDrop({ Position = "BOTTOM", gap = "", relativeContainer, children }: RelativeDropProps) {
    const [width, setWidth] = useState(0);

    useEffect(() => {
        const updateWidth = () => {
            if (relativeContainer) {
                setWidth(relativeContainer.getBoundingClientRect().width);
            }
        };

        updateWidth();
        window.addEventListener("resize", updateWidth);

        return () => {
            window.removeEventListener("resize", updateWidth);
        };
    }, [relativeContainer]);

    return (
        <div
            className={`absolute top-0 left-0 ${gap} pointer-events-auto`}
            style={{
                width: width,
                left: relativeContainer ? relativeContainer.getBoundingClientRect().left : undefined,
                top:
                    relativeContainer && Position === "BOTTOM"
                        ? relativeContainer.getBoundingClientRect().top +
                        relativeContainer.getBoundingClientRect().height
                        : undefined,

                bottom:
                    relativeContainer && Position === "TOP"
                        ? relativeContainer.getBoundingClientRect().top
                        : undefined,
            }}
        >
            {children}
        </div>
    );
}

export default RelativeDrop;
