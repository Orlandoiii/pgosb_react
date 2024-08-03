import {
    CreateElementFunction,
    OverlayItem,
    OverlayModalConfig,
} from './models/overlay_item'
import { Alert, AlertTypes } from '../alerts/alert'
// import Toast, { ToastTypes } from "../notifications/toast";

type ModalUpdateCallback = (modals: OverlayItem<any>[]) => void
type ToastUpdateCallback = (toasts: OverlayItem<any>[]) => void

class ModalService {
    private modals: OverlayItem<any>[] = []
    private toasts: OverlayItem<any>[] = []
    private modalUpdateCallback: ModalUpdateCallback | null = null
    private toastUpdateCallback: ToastUpdateCallback | null = null

    registerModalUpdateCallback = (callback: ModalUpdateCallback) => {
        this.modalUpdateCallback = callback
    }

    registerToastUpdateCallback = (callback: ToastUpdateCallback) => {
        this.toastUpdateCallback = callback
    }

    private updateModals = () => {
        if (this.modalUpdateCallback) {
            this.modalUpdateCallback([...this.modals])
        }
    }

    private updateToasts = () => {
        if (this.toastUpdateCallback) {
            this.toastUpdateCallback([...this.toasts])
        }
    }

    pushModal<P>(
        content: CreateElementFunction<P>,
        props: P,
        config: OverlayModalConfig = new OverlayModalConfig(),
        onClosed?: () => void
    ): () => void {
        console.log(`Mount new one`)
        const newModal = new OverlayItem(content, props, config, true, onClosed)
        this.modals.push(newModal)
        this.updateModals()
        return () => this.closeModal(newModal.id)
    }

    pushAlert(
        type: AlertTypes,
        text: string,
        onResponse?: (response: boolean) => void,
        onClosed?: () => void
    ): () => void {
        const newModal = new OverlayItem(
            Alert,
            {
                type: type,
                message: text,
                onResponse: onResponse,
                closeOverlay: undefined,
            },
            new OverlayModalConfig(),
            true,
            onClosed
        )
        this.modals.push(newModal)
        this.updateModals()
        return () => this.closeModal(newModal.id)
    }

    closeModal = (id: string) => {
        console.log(`Close modal id ${id} | modales ${this.modals.length}`)
        this.modals = this.modals.map((modal) =>
            modal.id === id ? modal.withVisibility(false) : modal
        )
        this.updateModals()
    }

    removeModal = (id: string) => {
        console.log(`Remove modal id ${id} | modales ${this.modals.length}`)
        this.modals = this.modals.filter((modal) => modal.id !== id)
        this.updateModals()
    }

    // pushToast = (type: ToastTypes, text: string): (() => void) => {
    //   const newToast = new OverlayItem(
    //     Toast,
    //     { type: type, message: text, closeOverlay: undefined },
    //     new OverlayModalConfig(),
    //     true
    //   );
    //   this.toasts.push(newToast);
    //   this.updateToasts();
    //   return () => this.closeToast(newToast.id);
    // };

    closeToast = (id: string) => {
        this.toasts = this.toasts.map((toast) =>
            toast.id === id ? toast.withVisibility(false) : toast
        )
        this.updateToasts()
    }

    removeToast = (id: string) => {
        this.toasts = this.toasts.filter((toast) => toast.id !== id)
        this.updateToasts()
    }
}

export const modalService = new ModalService()
