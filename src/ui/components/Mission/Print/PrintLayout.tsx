import EscudoBombero from '../../../../assets/images/EscudoBomberosNacionales.png'
import LogoMiranda from '../../../../assets/images/LogoGobernacionMiranda.png'
import React, { ReactNode } from 'react'

interface PrintLayoutProps {
    title: string
    subtitle: string
    children: ReactNode
}

export function PrintLayout({ title, subtitle, children }: PrintLayoutProps) {
    return (
        <>
            <div className="flex flex-col">

                <div className="space-y-4 bg-white px-4 w-full">
                    <div className="flex justify-between items-center">
                        <div className="w-32 h-32">
                            <img
                                src={EscudoBombero}
                                alt="Escudo Bomberos Nacionales"
                            />
                        </div>
                        <div className="flex flex-col items-center text-slate-600">
                            <div className="flex flex-col items-center text-xs">
                                <span>REPÚBLICA BOLIVARIANA DE VENEZUELA</span>
                                <span>
                                    GOBERNACIÓN DEL ESTADO BOLIVARIANO DE MIRANDA
                                </span>
                                <span>
                                    INSTITUTO AUTÓNOMO CUERPO DE BOMBEROS Y BOMBERAS
                                </span>
                                <span>
                                    Y ADMINISTRACIÓN DE EMERGENCIAS DE CARÁCTER CIVIL
                                </span>
                            </div>
                            <div className="font-semibold text-slate-700 text-lg">
                                {title}
                            </div>
                            <div className="text-base text-slate-600">
                                {subtitle}
                            </div>
                        </div>
                        <div className="w-32 h-32">
                            <img
                                src={LogoMiranda}
                                alt="Logo Gobernacion de Miranda"
                            />
                        </div>
                    </div>
                    <div className="bg-[#1C2434] rounded-full w-full h-1"></div>
                </div>

                <div className="bg-white p-4">{children}</div>
            </div>


        </>
    )
}
