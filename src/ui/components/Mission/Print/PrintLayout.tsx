import EscudoBombero from '../../../../assets/images/EscudoBomberosNacionales.png'
import LogoMiranda from '../../../../assets/images/LogoGobernacionMiranda.png'
import React, { ReactNode } from 'react'
import Overlay from '../../../core/overlay/overlay'

interface PrintLayoutProps {
    title: string
    subtitle: string
    children: ReactNode,
    loading: boolean
}

export function PrintLayout({ title, subtitle, children, loading }: PrintLayoutProps) {
    return (
        <>
            <div className="flex flex-col">

                <div className="space-y-4 bg-white w-full">
                    <div className="flex justify-between items-center">
                        <div className="w-32 h-32">
                            <img
                                src={EscudoBombero}
                                alt="Escudo Bomberos Nacionales"
                            />
                        </div >
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
                            <div className="font-semibold text-slate-700 text-base text-center">
                                {title}
                            </div>
                            <div className="text-sm text-slate-600">
                                {subtitle}
                            </div>
                        </div>
                        <div className="w-32 h-32">
                            <img
                                src={LogoMiranda}
                                alt="Logo Gobernacion de Miranda"
                            />
                        </div>
                    </div >
                    <div className="bg-[#1C2434] rounded-full w-full h-1"></div>
                </div >

                <div className="relative min-h-96 bg-white p-4">
                    {loading ? (<Overlay background={""}  isVisible={true} type={'Loader'} />) : (children)}</div>

                <div className='absolute bottom-0 right-0 flex justify-end p-4 space-x-4 print:hidden'>
                    <button
                        onClick={() => PrintContent('reporte')}
                        className='bg-[#1C2434] py-2 px-6 text-white rounded-lg hover:bg-[#2c374e] duration-200 drop-shadow-[2px_2px_4px_rgba(0,0,0,0.5)]'>
                        Imprimir
                    </button>
                </div>
            </div >
        </>
    )
}

function PrintContent(title: string) {
    const divToPrint = document.getElementById("PrintThis");
    const printIFrame = document.getElementById("printIFrame") as HTMLIFrameElement | null;

    if (printIFrame && divToPrint) {
        const iframeDoc = printIFrame.contentDocument;
        if (iframeDoc) {
            iframeDoc.body.innerHTML = divToPrint.innerHTML;

            const head = document.head.cloneNode(true) as HTMLHeadElement;
            const titleElement = head.querySelector("title");
            if (titleElement) {
                titleElement.innerHTML = title;
            }

            const printHead = iframeDoc.head || iframeDoc.getElementsByTagName('head')[0];
            printHead.innerHTML = "";
            printHead.appendChild(head);

            // Copy all stylesheets
            const styles = document.getElementsByTagName('style');
            const links = document.getElementsByTagName('link');

            for (let i = 0; i < styles.length; i++) {
                printHead.appendChild(styles[i].cloneNode(true));
            }

            for (let i = 0; i < links.length; i++) {
                if (links[i].rel === 'stylesheet') {
                    printHead.appendChild(links[i].cloneNode(true));
                }
            }

            // Apply print-specific styles
            const printStyles = document.createElement('style');
            printStyles.textContent = `
                @media print {
                    body { 
                        -webkit-print-color-adjust: exact;
                        font-size: 14px; /* Adjust this value to make text smaller */
                    }
                    @page { size: auto; margin: 10mm; }
                    html {
                        font-size: 85%; /* Reduce the base font size to 75% of the original */
                    }
                }
            `;
            printHead.appendChild(printStyles);

            setTimeout(() => {
                printIFrame.contentWindow?.print();
            }, 500);

            setTimeout(() => {
                if (titleElement) {
                    titleElement.innerHTML = "GRES";
                }
            }, 1000);
        }
    }
}