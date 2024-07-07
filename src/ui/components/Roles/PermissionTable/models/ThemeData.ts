import { createContext } from "react";

export const ThemeData = createContext<ThemeModel | undefined>( undefined);

export class ThemeModel{
    TableTheme: TableTheme = new TableTheme();
    ToggleButtonTheme: ToggleButtonTheme = new ToggleButtonTheme();
    RingToggleButtonTheme: RingToggleButtonTheme = new RingToggleButtonTheme();
}

export class TableTheme{
    HeaderBackColor: string = "bg-white";
    HeaderTextColor: string = "bg-black";
    TableBackColor: string = "bg-white";
    TableTextColor: string = "bg-black";
    CellBorderColor: string = "border-gray-200";
}

export class ToggleButtonTheme{
    Rounded: string = "rounded-lg";
    TextSize: string = "text-sm";
    
    InactiveColor: string = "bg-gray-200";
    InactiveTextColor: string = "text-gray-900";
    InactiveHoverColor: string = "hover:bg-gray-300";

    ActiveColor: string = "bg-[#2286DD]";
    ActiveTextColor: string = "text-white";
    ActiveHoverColor: string = "hover:bg-blue-600";
}

export class RingToggleButtonTheme{
    BackColor: string = "bg-white";

    InactiveColor: string = "bg-gray-300";
    InactiveHoverColor: string = "hover:bg-gray-400";

    ActiveColor: string = "bg-[#2286DD]";
    ActiveHoverColor: string = "hover:bg-blue-600";
}