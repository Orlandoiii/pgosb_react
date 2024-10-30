import { ResultErr } from "../../../domain/abstractions/types/resulterr";
import { modalService } from "../../core/overlay/overlay_service";

export async function executeAndValidate<T>(workingElement: string, workingElementType: 'MALE' | 'FEMALE', action: string, functionToInvoke: () => Promise<ResultErr<T>>, setLoading: (isLoading: boolean) => void, expectedField?: keyof T,): Promise<ResultErr<T>> {
    let resultErr: ResultErr<T>;

    try {
        setLoading(true);

        const result = await functionToInvoke();

        if (result.success && result.result) {
            if (expectedField && !result.result[expectedField]) resultErr = { success: false, error: `El valor de ${expectedField.toString()} no fue retornado` }
            else resultErr = result
        }
        else {
            console.error(`Fail to insert the element ${workingElement} for:`, result.error);
            resultErr = { success: false, error: `No se pudo ${action} ${workingElementType == 'MALE' ? "el" : "la"} ${workingElement}` }
        }
    }
    catch (error) {
        console.error(`Unexpected exception when try to insert the element ${workingElement} for:`, error);
        resultErr = { success: false, error: `Ocurrió un error inesperado al intentar ${action} ${workingElementType == 'MALE' ? "el" : "la"} ${workingElement}` }
    }
    finally {
        setLoading(false);
    }

    if (!resultErr.success) modalService.pushAlert('Error', resultErr.error ?? "")
    return resultErr;
}