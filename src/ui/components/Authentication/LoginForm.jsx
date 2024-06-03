import { useForm } from "react-hook-form";
import { useRef, useState } from 'react'

import ShieldLogo from "../../core/logo/ShieldLogo"
import Input from "../../core/inputs/Input"
import Button from "../../core/buttons/Button";
import InputFloatLabel from "../../core/inputs/InputFloatLabel";

export default function LoginForm({ }) {

    const { register, handleSubmit, formState } = useForm({ mode: "onChange" });

    const { errors, isSubmitted } = formState;


    function onSubmit(data) {

    }

    return (




        <div className="h-screen w-full bg-gray-200 flex flex-col justify-center">

            <div className="relative py-3 sm:max-w-xl sm:mx-auto">


                <div
                    className="absolute inset-0 bg-gradient-to-r from-[#036BD9] to-[#0069D9]
                shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-xl z-0">
                </div>




                <section className="relative h-screen w-full  py-6 px-2 shadow-md rounded-xl 
            border border-slate-150 flex flex-col justify-between items-center sm:h-auto sm:max-w-[30rem]  bg-[whitesmoke] z-10">



                    <div className="py-6 px-2">

                        <div className="mb-8">
                            <ShieldLogo width="w-[60px]" height="h-[60px]" />
                        </div>

                        <h2 className="text-center mb-8 text-lg">
                            Coloca usuario o correo y contraseña para Ingresar
                        </h2>

                        <form noValidate className="flex flex-col justify-center bg-inherit"
                            onSubmit={handleSubmit((data) => { onSubmit(data) })}>

                            <div className="space-y-6">

                                <Input register={register}
                                    label={"Usuario o correo"} useDotLabel={true}
                                    inputName={"username"} placeHolder="jondoe"
                                    errMessage={errors.username?.message}
                                />

                                <Input label={"Contraseña"} inputName={"password"}
                                    useDotLabel={true} placeHolder="********"
                                    errMessage={errors.password?.message}
                                />
                            </div>

                            <a className="mt-5 text-sm cursor-pointer  text-[#0088ce] 
                        self-end hover:underline">¿Has olvidado tu contraseña?</a>


                            <div className="w-full flex flex-col space-y-3 mt-4">

                                <Button>Ingresar</Button>

                                <Button>Registrarse</Button>

                            </div>




                        </form>

                    </div>




                    <a className="text-sm mt-4">Terminos y condiciones</a>


                </section>






            </div>
     
        </div>

    )

}