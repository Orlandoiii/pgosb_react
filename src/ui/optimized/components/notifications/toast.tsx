import React from "react";

export type ToastTypes = "Info" | "Success" | "Error";

interface NotificationProps {
  type?: ToastTypes;
  message?: string;
  closeOverlay?: () => void | undefined;
}

function Toast({ type = "Info", message, closeOverlay }: NotificationProps) {
  return (
    <div onClick={closeOverlay} className="flex w-[90%] space-x-4 rounded-xl bg-black px-6 py-4">
      <div className="flex flex-none items-center justify-center">
        <div className="w-full">
          <div className="size-10 bg-slate-300"></div>
        </div>
      </div>
      <div className="flex flex-col items-start justify-center space-y-1 overflow-hidden pr-10 text-xs text-white">
        <h3 className="text-[0.8rem] font-bold">
          {type === "Info" && "Info"}
          {type === "Success" && "Completado"}
          {type === "Error" && "Ooh ..."}
        </h3>
        <h5 className="text-[0.7rem] font-semibold">{message}</h5>
      </div>
    </div>
  );
}

export default Toast;
