import { getAll, getById, getGroup, insert, remove, update } from "../services/http"
import { ResultErr } from "../domain/abstractions/types/resulterr"

export class CRUD<T> {
    constructor(
        private readonly endpointCompound: string,
        private readonly toJson: (data: T) => ResultErr<any>,
        private readonly fromJson: (json: any) => ResultErr<T>
    ) {}

    async getAll(): Promise<ResultErr<T[]>> {
        return getAll<T>(this.endpointCompound, this.fromJson)
    }

    async getGroup(id: string): Promise<ResultErr<T[]>> {
        return getGroup<T>(this.endpointCompound, id, this.fromJson)
    }

    async getById(id: string): Promise<ResultErr<T>> {
        return getById<T>(this.endpointCompound, id, this.fromJson)
    }

    async insert(data: T): Promise<ResultErr<T>> {
        const mapped = this.toJson(data)

        if (mapped.success) {
           const result = await insert<T>(this.endpointCompound, mapped.result)
           if (!result.success || typeof result.result != 'object') return result
           return this.fromJson(result.result)
        }
        else return { success: false, error: 'El mapeo no fue satisfactorio' }
    }

    async update(data: T): Promise<ResultErr<T>> {
        const mapped = this.toJson(data)

        if (mapped.success) return update(this.endpointCompound, mapped.result)
        else return { success: false, error: 'El mapeo no fue satisfactorio' }
    }

    async remove(id: string): Promise<ResultErr<T>> {
        return remove(this.endpointCompound, id)
    }
}