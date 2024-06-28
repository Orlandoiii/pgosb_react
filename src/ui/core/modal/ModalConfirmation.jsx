import { createContext, useContext, useRef, useState } from "react";
import Button from "../buttons/Button";
import { CloseXSimbol } from "./ModalContainer";


const ConfirmationModalContext = createContext({
    showConfirmationModal: () => Promise.resolve(false),
});


function ModalConfirmation({ open, onClose, title, message, onReject, onAccept }) {
    return <div

        className={`fixed  w-full h-full z-10 inset-0 flex justify-center items-center transition-colors
            ${open ? "visible bg-black/20" : "invisible"}
          `}
    >

        <div
            onClick={(e) => e.stopPropagation()}
            className={`
              bg-white rounded-xl shadow  transition-all  min-h-[320px] min-w-[320px] md:min-h-[380px]  md:min-w-[460px]
              ${open ? "scale-100 opacity-100" : "scale-125 opacity-0"}
            `}
        >

            {title && title.length > 0 && <h2 className='relative w-full bg-[#0A2F4E] rounded-t-xl flex justify-center items-center
            text-[whitesmoke] text-lg h-11 p-2 shadow-lg'>{title}</h2>}

            <CloseXSimbol onClose={onClose} />


            <div className="px-6  py-8 w-full flex flex-col justify-center items-center mx-auto max-w-[300px] md:max-w-[440px] ">


                <div className="w-20 h-20 mb-6">
                    <svg className="fill-[#1D74C1]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd">
                        <path d="M12 0c6.623 0 12 5.377 12 12s-5.377 12-12 12-12-5.377-12-12 5.377-12 12-12zm0 1c6.071 0 11 4.929 11 11s-4.929 11-11 11-11-4.929-11-11 4.929-11 11-11zm.5 17h-1v-9h1v9zm-.5-12c.466 0 .845.378.845.845 0 .466-.379.844-.845.844-.466 0-.845-.378-.845-.844 0-.467.379-.845.845-.845z" />
                    </svg>
                </div>


                <p className="text-center text-lg md:text-xl">{message}</p>


                <div className="flex justify-center space-x-6 w-full  px-6 absolute bottom-4 right-1/2 translate-x-1/2">

                    <Button colorType="bg-rose-700" hoverColor="hover:bg-rose-900" onClick={() => {
                        if (onReject) onReject()
                    }}>Cancelar</Button>

                    <Button onClick={() => {
                        if (onAccept) onAccept()
                    }}>Aceptar</Button>
                </div>


            </div>
        </div>

    </div>

}


export function useConfirmationModal() {
    return useContext(ConfirmationModalContext);
}

export default function ConfirmationModalProvider({ children }) {

    const [showModalState, setShowModalState] = useState(false);
    const [message, setMessage] = useState('');
    const [title, setTitle] = useState('');

    const resolvePromise = useRef({});

    const showConfirmationModal = (t, m) => {
        setMessage(m);
        setTitle(t);
        setShowModalState(true);

        return new Promise((resolve) => {
            resolvePromise.current = resolve;
        });
    };

    const handleConfirm = () => {
        setShowModalState(false);
        resolvePromise.current(true);
    };

    const handleCancel = () => {
        setShowModalState(false);
        resolvePromise.current(false);
    };

    return (
        <ConfirmationModalContext.Provider value={{ showConfirmationModal }}>
            {children}
            <ModalConfirmation
                title={title}
                message={message} open={showModalState} onClose={() => handleCancel()}
                onAccept={() => handleConfirm()} onReject={() => handleCancel()} />
        </ConfirmationModalContext.Provider>
    )



}