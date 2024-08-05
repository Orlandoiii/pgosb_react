import React, { useEffect, useState } from 'react'
import OverlayController from './overlay_controller'
import { OverlayItem } from './models/overlay_item'
import { modalService } from './overlay_service'

const OverlayProvider: React.FC = () => {
    const [modals, setModals] = useState<OverlayItem<any>[]>([])
    const [toasts, setToasts] = useState<OverlayItem<any>[]>([])

    useEffect(() => {
        modalService.registerModalUpdateCallback(setModals)
        modalService.registerToastUpdateCallback(setToasts)
    }, [])

    console.log(`Modales ${modals.length} toast: ${toasts.length}`)

    console.log(
        modals.map((item) => {
            ;`${item.id} ${item.onClosed}`
        })
    )

    return (
        <>
            <OverlayController
                items={modals}
                onItemDismounted={modalService.removeModal}
                closeOverlay={modalService.closeModal}
            />
            <OverlayController
                type="Top-Stack"
                items={toasts}
                onItemDismounted={modalService.removeToast}
                closeOverlay={modalService.closeToast}
            />
        </>
    )
}

export default OverlayProvider
