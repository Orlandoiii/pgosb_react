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

    return (
        <>
            <OverlayController
                key={'modalController'}
                items={modals}
                onItemDismounted={modalService.removeModal}
                closeOverlay={modalService.closeModal}
            />
            <OverlayController
                key={'notificationController'}
                type="Top-Stack"
                items={toasts}
                onItemDismounted={modalService.removeToast}
                closeOverlay={modalService.closeToast}
            />
        </>
    )
}

export default OverlayProvider
