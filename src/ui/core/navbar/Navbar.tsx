import React, { useState, useEffect, useRef } from 'react'
import logger from "../../../logic/Logger/logger";
import { useUser } from '../context/UserDataContext';

import FiremanImg from '../../../assets/fireman.png';
import LockIcon from '../icons/LockIcon';
import ModalContainer from '../modal/ModalContainer';
import Input from '../inputs/Input';
import Button from '../buttons/Button';
import EyeIcon from '../icons/EyeIcon';
import axios from 'axios';
import { useConfig } from '../context/ConfigContext';
import AlertController from '../alerts/AlertController';

const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*-_])(?=.{8,})/;

const alertController = new AlertController();

function ChangePasswordModal({
    showChangePasswordModal,
    setShowChangePasswordModal,
    showPassword,
    setShowPassword,
    showNewPassword,
    setShowNewPassword
}) {

    const [passwordErrMessage, setPasswordErrMessage] = useState("");
    const [newPasswordErrMessage, setNewPasswordErrMessage] = useState("");


    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const { config } = useConfig()


    useEffect(() => {

        if (password.length > 0 || newPassword.length > 0) {

            if (!passwordRegex.test(password)) {
                setPasswordErrMessage("Contraseña invalida, debe contener una mayuscula, un caracter especial y al menos 8 caracteres");
                return;
            } else {
                setPasswordErrMessage("");
            }


            if (password !== newPassword) {
                setNewPasswordErrMessage("Las contraseñas no coinciden");
                return;
            } else {
                setNewPasswordErrMessage("");
            }

        }



    }, [password, newPassword])

    return (
        <ModalContainer title='Cambiar contraseña' show={showChangePasswordModal}
            onClose={() => {
                setShowChangePasswordModal(false);
                setPassword("");
                setNewPassword("");
                setPasswordErrMessage("");
                setNewPasswordErrMessage("");
            }}>
            <form
                className='w-[540px] min-h-[260px] bg-transparent 
                flex items-center justify-center'
                onSubmit={async (e) => {
                    e.preventDefault();

                    if (!passwordRegex.test(newPassword)) {
                        setPasswordErrMessage("Contraseña invalida, debe contener una mayuscula, un caracter especial y al menos 8 caracteres");
                        return;
                    }

                    if (password !== newPassword) {
                        setNewPasswordErrMessage("Las contraseñas no coinciden");
                        return;
                    }


                    const data = {
                        password,
                        new_password: newPassword
                    }

                    const endpoint = `${config.back_url}/api/v1/auth/change-password`;


                    let success = false;

                    try {
                        const response = await axios.post(endpoint, data);
                        if (response.status === 200) {
                            success = true;
                            alertController.notifySuccess("Contraseña cambiada correctamente");
                        } else {
                            alertController.notifyError("Error al cambiar la contraseña");
                        }
                    } catch (error) {
                        console.log(error);
                        alertController.notifyError("Error al cambiar la contraseña");
                    }



                    if (success) {
                        setNewPassword("");
                        setPassword("");
                        setShowChangePasswordModal(false);

                    }


                    console.log("Password change submitted");
                }}
            >
                <div className='flex flex-col items-center space-y-8 w-full h-full'>

                    <Input useUppercase={false} type={showPassword ? "text" : "password"}
                        label='Nueva Contraseña:' inputName={'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        errMessage={passwordErrMessage}
                        useStrongErrColor={true}
                        icons={
                            <button type='button' onClick={() => setShowPassword(!showPassword)}>
                                <EyeIcon open={!showPassword} />
                            </button>
                        }
                    />

                    <Input useUppercase={false} type={showNewPassword ? "text" : "password"}
                        label='Repetir Contraseña:' inputName={'new_password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        errMessage={newPasswordErrMessage}
                        useStrongErrColor={true}
                        icons={
                            <button type='button' onClick={() => setShowNewPassword(!showNewPassword)}>
                                <EyeIcon open={!showNewPassword} />
                            </button>
                        }
                    />
                    <div className='w-full flex justify-end'>
                        <Button width='w-full'>Confirmar</Button>
                    </div>

                </div>
            </form>
        </ModalContainer>
    )
}

export default function Navbar({ }) {
    logger.log("Renderizo Navbar")

    const { userData, userRolData, userDataIsLoad } = useUser();


    const name = userDataIsLoad ? `${userData?.first_name} ${userData?.last_name}` : "";


    const roleName = userDataIsLoad ? userRolData?.role_name : ""


    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    return (
        <>
            <nav className='sticky  top-0 flex w-full h-[80px] 
        bg-[white] shadow-sm rounded-sm  z-10'>



                <div className=' w-full h-full max-w-[1920px] mx-auto 
                flex items-center justify-end  px-2  md:px-4 '>



                    <div className="pr-12">


                        <div className='flex items-center space-x-3'>


                            {/* <div className="p-2 w-[34px] h-[34px] rounded-full bg-slate-200 flex justify-center items-center">
                                <BellIcon />
                            </div>

                            <div className="p-2 w-[34px] h-[34px] rounded-full bg-slate-200 flex justify-center items-center">
                                <LetterIcon />
                            </div> */}


                            <button onClick={() => setShowChangePasswordModal(true)}
                                className="p-1.5 w-[34px] h-[34px] rounded-full bg-slate-200 
                                flex justify-center items-center">
                                <LockIcon />
                            </button>



                            <div className={`flex flex-col justify-center items-end transition-all ease-in-out duration-500 
                                ${userDataIsLoad ? " opacity-100 translate-x-0" : " opacity-0 -translate-x-10"}`}>
                                <h3 className='text-lg font-semibold self-start text-rose-700'>{name}</h3>
                                <p className='text-md text-slate-500'>{roleName}</p>
                            </div>

                            <div className={` rounded-full w-[60px] h-[60px] flex justify-center items-center
                                          bg-gradient-to-r from-gray-400 to-slate-300 shadow-lg 
                                          transition-all ease-in-out duration-500
                                          ${userDataIsLoad ? " opacity-100 scale-100" : " opacity-0 scale-75"}
                                          `}>
                                <img className='w-[35px] h-[35px] ' src={FiremanImg} alt="Bombero logo" />
                            </div>

                        </div>

                    </div>

                </div>


            </nav>

            <ChangePasswordModal
                showChangePasswordModal={showChangePasswordModal}
                setShowChangePasswordModal={setShowChangePasswordModal}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                showNewPassword={showNewPassword}
                setShowNewPassword={setShowNewPassword}
            />

        </>

    )
}

