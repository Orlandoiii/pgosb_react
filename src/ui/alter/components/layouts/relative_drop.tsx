import React, { ReactNode, useEffect, useState } from 'react'

export interface RelativeDropProps {
    relativeContainer: React.RefObject<HTMLButtonElement>
    Position?: 'TOP' | 'BOTTOM'
    gap?: string
    children?: ReactNode
}

function RelativeDrop({
    Position = 'BOTTOM',
    gap = '',
    relativeContainer,
    children,
}: RelativeDropProps) {
    const [width, setWidth] = useState(0)

    useEffect(() => {
        const updateWidth = () => {
            if (relativeContainer.current) {
                setWidth(
                    relativeContainer.current.getBoundingClientRect().width
                )
            }
        }

        updateWidth()
        window.addEventListener('resize', updateWidth)

        return () => {
            window.removeEventListener('resize', updateWidth)
        }
    }, [relativeContainer])

    return (
        <div
            className={`absolute top-0 left-0 ${gap} pointer-events-auto`}
            style={{
                width: width,
                left: relativeContainer.current
                    ? relativeContainer.current.getBoundingClientRect().left
                    : undefined,
                top:
                    relativeContainer.current && Position === 'BOTTOM'
                        ? relativeContainer.current.getBoundingClientRect()
                              .top +
                          relativeContainer.current.getBoundingClientRect()
                              .height
                        : undefined,

                bottom:
                    relativeContainer.current && Position === 'TOP'
                        ? relativeContainer.current.getBoundingClientRect().top
                        : undefined,
            }}
        >
            {children}
        </div>
    )
}

export default RelativeDrop
