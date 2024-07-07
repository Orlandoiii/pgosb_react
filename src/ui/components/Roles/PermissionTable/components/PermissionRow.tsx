import React from 'react';

import { DefaultPermissions } from "../models/DefaultPermissions";
import { ModuleAccess } from "../models/ModuleAccess";
import RingToggleButton from "./RingToggleButton";
import ToggleButton from "./ToggleButton";
import { ButtonStates } from "../models/ButtonStates";
import { useContext } from "react";
import { ThemeData } from "../models/ThemeData";

interface PermissionRowProps {
  readonly: boolean | undefined;
  moduleAccess: ModuleAccess;
  onModuleChanged: (newValue: ModuleAccess) => void;
}

const PermissionRow = ({ moduleAccess, onModuleChanged, readonly = false }: PermissionRowProps) => {
  const tableTheme = useContext(ThemeData)?.TableTheme!;

  function changeAllPermissions() {
    var newButtonState = moduleAccess.totalAccess() ? ButtonStates.false : ButtonStates.true;

    const modifiedPermissions = Object.fromEntries(
      Object.entries(moduleAccess.Permissions).map(([key, value]) =>
        value != ButtonStates.disable ? [key, newButtonState] : [key, value]
      )
    ) as DefaultPermissions;

    updateState(modifiedPermissions);
  }

  function changePermissionByName(permissionName: string) {
    const modifiedPermissions = Object.fromEntries(
      Object.entries(moduleAccess.Permissions).map(([key, value]) =>
        key == permissionName && value != ButtonStates.disable
          ? [key, value == ButtonStates.false ? ButtonStates.true : ButtonStates.false]
          : [key, value]
      )
    ) as DefaultPermissions;

    updateState(modifiedPermissions);
  }

  function updateState(modifiedPermissions: DefaultPermissions) {
    const newModuleAccess = moduleAccess.copyWith(modifiedPermissions);
    onModuleChanged(newModuleAccess);
  }

  return (
    <tr>
      <td className={`h-12 border border-spacing-0 ${tableTheme.CellBorderColor} space-x-6 px-4`}>
        <span className="text-lg w-64  select-none">{moduleAccess.Name}</span>
        <ToggleButton readonly={readonly} text="Todo" initState={moduleAccess.totalAccess()} onChange={() => changeAllPermissions()} />
      </td>

      {Object.entries(moduleAccess.Permissions).map((permission, idx) => (
        <td key={idx} className={`h-full w-24 border-spacing-0 border ${tableTheme.CellBorderColor}`}>
          <div className="flex h-9 items-center justify-center ">
            <RingToggleButton readonly={readonly} initState={permission[1]} onChange={() => changePermissionByName(permission[0])} />
          </div>
        </td>
      ))}
    </tr>
  );
};

export default PermissionRow;
