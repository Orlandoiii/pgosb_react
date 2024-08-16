import React from 'react'

import { OverlayItem } from './models/overlay_item'
import Overlay from './overlay'

interface OverlayControllerProps {
    type?: 'Over' | 'Top-Stack' | 'Bottom-Stack'
    newesFirst?: boolean
    items: OverlayItem<any>[]
    onItemDismounted: (id: string) => void
    closeOverlay: (id: string) => void
}

function OverlayController({
    type = 'Over',
    newesFirst = true,
    items,
    onItemDismounted,
    closeOverlay,
}: OverlayControllerProps) {
    return (
        <>
            {type === 'Over' &&
                items.map((item) => (
                    <>
                        <Overlay
                            isVisible={item.isVisible}
                            key={item.id}
                            type={item.config.type}
                            animation={item.config.animation}
                            background={item.config.background}
                            closeOnClickOut={item.config.closeOnClickOut}
                            onClosed={() => {
                                onItemDismounted(item.id)
                            }}
                            closeOverlay={() => {
                                closeOverlay(item.id)
                            }}
                        >
                            {'closeOverlay' in item.props
                                ? item.element({
                                      ...item.props,
                                      closeOverlay: () => closeOverlay(item.id),
                                  })
                                : item.element(item.props)}
                        </Overlay>
                    </>
                ))}
            {type === 'Top-Stack' && (
                <div className="absolute top-0 left-0 flex flex-col h-full w-full justify-start items-center pointer-events-none">
                    <div
                        className={`flex ${newesFirst ? 'flex-col-reverse space-y-reverse' : 'flex-col'} space-y-4`}
                    >
                        {items.map((item) => (
                            <div key={item.id} className=" pointer-events-auto">
                                {item.element(item.props)}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {type === 'Bottom-Stack' && (
                <div className="absolute top-0 left-0 flex flex-col h-full w-full justify-end items-center pointer-events-none">
                    <div
                        className={`flex ${newesFirst ? 'flex-col' : 'flex-col-reverse space-y-reverse'} space-y-4`}
                    >
                        {items.map((item) => (
                            <div key={item.id} className=" pointer-events-auto">
                                {item.element(item.props)}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    )
}

export default OverlayController
