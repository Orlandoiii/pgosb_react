import React from 'react';

import { useContext } from "react";
import { ThemeData } from "../models/ThemeData";

interface ToggleButtonProps {
  initState: boolean;
  text: string;
  readonly: boolean | undefined,
  onChange: (newValue: boolean) => void;
}

const ToggleButton = ({ initState, text, onChange, readonly = false }: ToggleButtonProps) => {
  const buttonTheme = useContext(ThemeData)!.ToggleButtonTheme!;
  function _changeState() {
    if (readonly)
      return;
    onChange(!initState);
  }

  return (
    <button
      tabIndex={-1}
      className={`${buttonTheme.Rounded} ${buttonTheme.TextSize} font-medium ${initState
        ? `${buttonTheme.ActiveTextColor} ${buttonTheme.ActiveColor} ${buttonTheme.ActiveHoverColor}`
        : `${buttonTheme.InactiveTextColor} ${buttonTheme.InactiveColor} ${buttonTheme.InactiveHoverColor}`
        } h-7 w-20 duration-200 select-none items-center`}
      onClick={_changeState}
      disabled={readonly}
    >
      {text}
    </button>
  );
};

export default ToggleButton;
