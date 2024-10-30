import React from "react";

import NotificationIcon from "../icons/notification_icon";

export type AlertTypes = "Validate" | "Info" | "Success" | "Error";

interface NotificationProps {
  type?: AlertTypes;
  message?: string;
  onResponse?: (response: boolean) => void;
  closeOverlay?: () => void | undefined;
}

function Alert({ type = "Info", message, onResponse, closeOverlay }: NotificationProps) {
  function setResponse(response: boolean) {
    if (onResponse) onResponse(response);
    if (closeOverlay) closeOverlay();
  }

  return (
    <div className="flex flex-col justify-between" onClick={closeOverlay}>
      <NotificationIcon type={type} size="size-14" />

      <div className="flex w-full justify-center">
        <span className="text-2xl text-gray-600  font-semibold">
          {type === "Validate" && "Confirmar"}
          {type === "Info" && "Info"}
          {type === "Success" && "Completado"}
          {type === "Error" && "Ooh ..."}
        </span>
      </div>

      <div className="flex w-full justify-center mt-8">
        <span className="text-lg text-gray-600 text-center">{message}</span>
      </div>

      {type === "Validate" && (
        <div className="flex w-full justify-center mt-8 space-x-8">
          <button onClick={() => setResponse(true)}>Aceptar</button>
          <button onClick={() => setResponse(false)}>Rechazar</button>
        </div>
      )}
    </div>
  );
}

export default Alert;
