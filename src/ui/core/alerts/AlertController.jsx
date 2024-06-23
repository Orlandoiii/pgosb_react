import { toast } from "react-toastify";
import SmallToast from "./SmallToast";

export default class AlertController {
    notifyInfo(message = "") {
        toast.info(<SmallToast type="info" message={message} />, {
            position: "top-center",
            autoClose: 25000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    }

    notifySuccess(message = "") {
        toast.success(<SmallToast type="success" message={message} />, {
            position: "top-center",
            autoClose: 25000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    }

    
    notifyWarning(message = "") {
        toast.warning(<SmallToast type="warning" message={message} />, {
            position: "top-center",
            autoClose: 25000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    }

    notifyError(message = "") {
        toast.error(<SmallToast type="error" message={message} />, {
            position: "top-center",
            autoClose: 25000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    }
}