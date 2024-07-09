import React from "react";
import { ModuleAccess } from "../models/ModuleAccess";
import PermissionRow from "./PermissionRow";
import { ThemeData, ThemeModel } from "../models/ThemeData";

interface PermissionTableProps {
  readonly: boolean | undefined;
  ModulesAccess: ModuleAccess[];
  viewPermissionName: string;
  onModulesAccessChanged: (newModules: ModuleAccess[]) => void;
}

const PermissionTable = ({
  ModulesAccess,
  viewPermissionName = "",
  onModulesAccessChanged,
  readonly,
}: PermissionTableProps) => {
  function updateModulesAccess(previousModuleAccess: ModuleAccess, newModuleAccess: ModuleAccess) {
    var index = ModulesAccess.findIndex((item) => item === previousModuleAccess);
    var newModulesAccess = [...ModulesAccess];
    newModulesAccess[index] = newModuleAccess;
    onModulesAccessChanged(newModulesAccess);
  }

  var theme = new ThemeModel();
  return (
    <>
      <ThemeData.Provider value={theme}>
        <table>
          <thead className={`${theme.TableTheme.HeaderBackColor}`}>
            <tr className={`border ${theme.TableTheme.CellBorderColor}`}>
              <th></th>
              {Object.entries(ModulesAccess[0].Permissions).map((permission, idx) => (
                <th key={idx} className="text-black px-4 py-2">
                  {permission[0]}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className={`${theme.TableTheme.TableBackColor}`}>
            {ModulesAccess.map((moduleAccess) => (
              <PermissionRow
                viewPermissionName={viewPermissionName}
                readonly={readonly}
                key={moduleAccess.Name}
                moduleAccess={moduleAccess}
                onModuleChanged={(newModuleAccess) => updateModulesAccess(moduleAccess, newModuleAccess)}
              />
            ))}
          </tbody>
        </table>
      </ThemeData.Provider>
    </>
  );
};

export default PermissionTable;
