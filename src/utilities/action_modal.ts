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
    ) {}

    add() {
        this.openModal()
    }

    async edit(id: string) {
        const result = await this.crud.getById(id)
        if (result.success) {
            if (result.result) this.openModal(false, result.result)
            else modalService.alertError(`El registro retorno sin datos`)
        } else modalService.alertError(`No se pudo encontrar el registro`)
    }

    async delete(id: string) {
        const result = await this.crud.remove(id)
        if (result.success) {
            modalService.alertSuccess(`Registro eliminado!`)
            this.updateCollection()
        } else modalService.alertError(`No se pudo eliminar el registro`)
    }

    private openModal(add: boolean = true, props?: Partial<P>) {
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
