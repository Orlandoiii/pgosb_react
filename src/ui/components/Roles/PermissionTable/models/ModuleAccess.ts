import { DefaultPermissions } from './DefaultPermissions';
import { ButtonStates } from './ButtonStates'

export class ModuleAccess {
    Name: string;
    Permissions: DefaultPermissions;

    public constructor(name: string, permissions: DefaultPermissions) {
        this.Permissions = permissions;
        this.Name = name;
    }

    totalAccess() {
        return this.Permissions.ver == ButtonStates.true
            && this.Permissions.agregar == ButtonStates.true
            && this.Permissions.editar == ButtonStates.true
            && this.Permissions.borrar == ButtonStates.true
            && this.Permissions.imprimir == ButtonStates.true;
    }

    AnyAccess() {
        return this.Permissions.ver == ButtonStates.true
            || this.Permissions.agregar == ButtonStates.true
            || this.Permissions.editar == ButtonStates.true
            || this.Permissions.borrar == ButtonStates.true
            || this.Permissions.imprimir == ButtonStates.true;
    }

    copyWith(newPermissions: DefaultPermissions): ModuleAccess {
        return new ModuleAccess(this.Name, newPermissions);
    }
}

interface Permissions {
    [key: string]: boolean; // Use a more flexible interface for permissions
}

interface TranslatedModuleAccess {
    [module: string]: Permissions;
}

export function translateAndConvertPermissions(
    rawPermissions: any,
    moduleNameDictionary: { [key: string]: string },
    propDictionary: { [key: string]: string }
): ModuleAccess[] {
    const translated: TranslatedModuleAccess = {};

    // Translate module names and permissions
    for (const moduleKey in rawPermissions) {
        const translatedModule = moduleNameDictionary[moduleKey] || moduleKey; // Fallback to original if no translation found
        translated[translatedModule] = {};

        const permissions = rawPermissions[moduleKey];
        for (const permKey in permissions) {
            const translatedPerm = propDictionary[permKey] || permKey;
            translated[translatedModule][translatedPerm] = permissions[permKey]; // Use boolean directly
        }
    }

    const moduleAccessList: ModuleAccess[] = [];
    for (const moduleName in translated) {
        const defaultPermissions = new DefaultPermissions();
        for (const perm in translated[moduleName]) {
            defaultPermissions[perm as keyof DefaultPermissions] =
                translated[moduleName][perm] ? ButtonStates.true : ButtonStates.false;
        }

        // Infer "ver" property
        defaultPermissions.ver = ButtonStates.true; // Since the module exists

        moduleAccessList.push(new ModuleAccess(moduleName, defaultPermissions));
    }

    return moduleAccessList;
}


export function moduleAccessToBackendFormat(
    modules: ModuleAccess[],
    reversedModuleNameDictionary: { [key: string]: string },
    reversedPropDictionary: { [key: string]: string }
): any {
    const result: any = {};

    for (const module of modules) {
        const moduleKey = reversedModuleNameDictionary[module.Name] || module.Name;
        result[moduleKey] = {};
        for (const perm in module.Permissions) {
            if (perm !== "ver") {
                const permKey = reversedPropDictionary[perm] || perm;
                result[moduleKey][permKey] = module.Permissions[perm as keyof DefaultPermissions] === ButtonStates.true;
            }
        }
    }

    return result;
}