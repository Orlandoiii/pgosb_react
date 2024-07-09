import React from "react";

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
  viewPermissionName: string;
  onModuleChanged: (newValue: ModuleAccess) => void;
}

const PermissionRow = ({
  moduleAccess,
  viewPermissionName = "",
  onModuleChanged,
  readonly = false,
}: PermissionRowProps) => {
  const tableTheme = useContext(ThemeData)?.TableTheme!;

  function onAllPermissionsClick() {
    var newButtonState = moduleAccess.totalAccess() ? ButtonStates.false : ButtonStates.true;
    changeAllPermissions(newButtonState);
  }

  function changeAllPermissions(newButtonState: ButtonStates) {
    const modifiedPermissions = Object.fromEntries(
      Object.entries(moduleAccess.Permissions).map(([key, value]) =>
        value != ButtonStates.disable ? [key, newButtonState] : [key, value]
      )
    ) as DefaultPermissions;

    updateState(modifiedPermissions);
  }

  function changePermissionByName(permissionName: string) {
    var modifiedPermissions: DefaultPermissions;

    if (permissionName == viewPermissionName && canView()) {
      changeAllPermissions(ButtonStates.false);
      return;
    } else {
      var anyTrue = false;
      modifiedPermissions = Object.fromEntries(
        Object.entries(moduleAccess.Permissions).map(([key, value]) => {
          if (!anyTrue && (value == ButtonStates.true || (key == viewPermissionName && value == ButtonStates.false)))
            anyTrue = true;

          return key == permissionName && value != ButtonStates.disable
            ? [key, value == ButtonStates.false ? ButtonStates.true : ButtonStates.false]
            : [key, value];
        })
      ) as DefaultPermissions;
      modifiedPermissions = changeViewToTrue(modifiedPermissions);
    }

    updateState(modifiedPermissions);
  }

  function canView(): boolean {
    var can = false;
    Object.entries(moduleAccess.Permissions).map(([key, value]) => {
      if (key == viewPermissionName && value == ButtonStates.true) {
        can = true;
      }
    });
    return can;
  }

  function changeViewToTrue(modifiedPermissions: DefaultPermissions) {
    return Object.fromEntries(
      Object.entries(modifiedPermissions).map(([key, value]) => {
        return key == viewPermissionName && value != ButtonStates.disable ? [key, ButtonStates.true] : [key, value];
      })
    ) as DefaultPermissions;
  }

  function updateState(modifiedPermissions: DefaultPermissions) {
    const newModuleAccess = moduleAccess.copyWith(modifiedPermissions);
    onModuleChanged(newModuleAccess);
  }

  return (
    <tr>
      <td className={`h-12 border border-spacing-0 ${tableTheme.CellBorderColor} space-x-6 px-4`}>
        <div className="flex justify-between space-x-6">
          <span className="text-lg  select-none">{moduleAccess.Name}</span>
          <ToggleButton
            readonly={readonly}
            text="Todo"
            initState={moduleAccess.totalAccess()}
            onChange={() => onAllPermissionsClick()}
          />
        </div>
      </td>

      {Object.entries(moduleAccess.Permissions).map((permission, idx) => (
        <td key={idx} className={`h-full w-24 border-spacing-0 border ${tableTheme.CellBorderColor}`}>
          <div className="flex h-9 items-center justify-center ">
            <RingToggleButton
              readonly={readonly}
              initState={permission[1]}
              onChange={() => changePermissionByName(permission[0])}
            />
          </div>
        </td>
      ))}
    </tr>
  );
};

export default PermissionRow;
