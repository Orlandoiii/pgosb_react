import {
    CreateElementFunction,
    OverlayModalConfig,
} from '../ui/core/overlay/models/overlay_item'
import { modalService } from '../ui/core/overlay/overlay_service'
import { CRUD } from './crud'

export class ActionModal<T, P> {
    constructor(
        private readonly modal: CreateElementFunction<P>,
        private readonly crud: CRUD<T>,
        private readonly baseProps: P,
        private readonly groupId: string,
        private readonly collectionChanged?: (data: T[]) => void
    ) {
        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
        this.delete = this.delete.bind(this);
        this.openModal = this.openModal.bind(this);
        this.updateCollection = this.updateCollection.bind(this);
    }

    
    add() {
        this.openModal()
    }

    async edit(id: string) {
        const result = await this.crud.getById(id)
        if (result.success) {
            if (result.result) this.openModal(false, result.result)
            else modalService.toastError(`El registro retorno sin datos`)
        } else modalService.toastError(`No se pudo encontrar el registro`)
    }

    async delete(id: string) {
        const result = await this.crud.remove(id)
        if (result.success) {
            modalService.toastSuccess(`Registro eliminado!`)
            this.updateCollection()
        } else modalService.toastSuccess(`No se pudo eliminar el registro`)
    }

    private openModal(add: boolean = true, props?: Partial<P>) {
        console.log("calleddd")
        modalService.pushModal(
            this.modal,
            {
                ...this.baseProps,
                initValue: props,
                add,
                closeOverlay: undefined,
            },
            new OverlayModalConfig(),
            this.updateCollection
        )
    }

    async updateCollection() {
        const result = await this.crud.getGroup(this.groupId)
        if (result.success) {
            if (this.collectionChanged)
                this.collectionChanged(result.result || [])
        }
    }
}
