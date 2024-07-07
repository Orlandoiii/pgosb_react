import React from 'react';

import { useContext } from "react";
import { ButtonStates } from "../models/ButtonStates";
import { ThemeData } from "../models/ThemeData";

interface ToggleDonutButtonProps {
  initState: ButtonStates;
  readonly: boolean | undefined;
  onChange: (newValue: ButtonStates) => void;
}

const RingToggleButton = ({ initState, onChange, readonly = false }: ToggleDonutButtonProps) => {
  const ringTheme = useContext(ThemeData)?.RingToggleButtonTheme!;

  function _changeState() {
    if (readonly)
      return;
    var newState = initState == ButtonStates.true ? ButtonStates.false : ButtonStates.true;
    onChange(newState);
  }

  function isSelected(): boolean {
    return initState == ButtonStates.true;
  }

  if (initState == ButtonStates.disable) {
    return (
      <>
        <div className={`relative aspect-square h-full pointer-events-none`}>
          <div className={`flex h-full w-full items-center justify-center rounded-full ${ringTheme.InactiveColor}`}>
            <div
              className={`flex aspect-square h-full scale-[0.60] items-center justify-center rounded-full ${ringTheme.BackColor}`}
            ></div>
          </div>

          <div className="absolute top-0 left-0 h-full w-full">
            <div className="relative h-full w-full flex items-center justify-center -rotate-45">
              <div className={`h-2/5 w-full ${ringTheme.BackColor}`}></div>
              <div className="absolute w-full h-1/5 bg-gray-300 px-[60%] rounded-full"></div>
            </div>
          </div>
        </div>
      </>
    );
  } else {
    return (
      <>
        <button
          disabled={readonly}
          className={`relative aspect-square h-full`} onClick={_changeState}>
          <div
            className={`group/donut flex h-full w-full items-center justify-center rounded-full ${isSelected()
              ? `${ringTheme.ActiveColor} ${ringTheme.ActiveHoverColor}`
              : `${ringTheme.InactiveColor} ${ringTheme.InactiveHoverColor}`
              } duration-200`}
          >
            <div
              className={`flex aspect-square h-full ${isSelected() ? "scale-[0.40]" : "scale-[0.60]"
                } items-center justify-center rounded-full ${ringTheme.BackColor
                } group-hover/donut:scale-[0.4] duration-200`}
            ></div>
          </div>
        </button>
      </>
    );
  }
};

export default RingToggleButton;
