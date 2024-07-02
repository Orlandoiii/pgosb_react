import { useRef, useState } from "react"
import { motion, useDragControls, useMotionValue, useAnimate, easeInOut, delay } from 'framer-motion'
import useMeasure from "react-use-measure";

function ContentForTest({ }) {
    return (
        <>
            <div className="text-[whitesmoke]">
                <h2 className="text-4xl font-bold text-neutral-200">
                    Drag the handle at the top of this modal downwards 100px to close it
                </h2>
                <p>
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Minima
                    laboriosam quos deleniti veniam est culpa quis nihil enim suscipit
                    nulla aliquid iure optio quaerat deserunt, molestias quasi facere
                    aut quidem reprehenderit maiores.
                </p>
                <p>
                    Laudantium corrupti neque rerum labore tempore sapiente. Quos, nobis
                    dolores. Esse fuga, cupiditate rerum soluta magni numquam nemo
                    aliquid voluptate similique deserunt!
                </p>
                <p>
                    Rerum inventore provident laboriosam quo facilis nisi voluptatem
                    quam maxime pariatur. Velit reiciendis quasi sit magni numquam quos
                    itaque ratione, fugit adipisci atque est, tenetur officiis explicabo
                    id molestiae aperiam? Expedita quidem inventore magni? Doloremque
                    architecto mollitia, dicta, fugit minima velit explicabo sapiente
                    beatae fugiat accusamus voluptatum, error voluptatem ab asperiores
                    quo modi possimus.
                </p>
                <p>
                    Sit laborum molestias ex quisquam molestiae cum fugiat praesentium!
                    Consequatur excepturi quod nemo harum laudantium accusantium nisi
                    odio?
                </p>
                <p>
                    Deleniti, animi maiores officiis quos eaque neque voluptas omnis
                    quia error a dolores, pariatur ad obcaecati, vitae nisi perspiciatis
                    fugiat sapiente accusantium. Magnam, a nihil soluta eos vero illo ab
                    sequi, dolores culpa, quia hic?
                </p>
                <p>
                    Eos in saepe dignissimos tempore. Laudantium cumque eius, et
                    distinctio illum magnam molestiae doloribus. Fugiat voluptatum
                    necessitatibus vero eligendi quae, similique non debitis qui veniam
                    praesentium rerum labore libero architecto tempore nesciunt est
                    atque animi voluptatibus. Aliquam repellendus provident tempora
                    sequi officia sint voluptates eaque minima suscipit, cum maiores
                    quos possimus. Vero ex porro asperiores voluptas voluptatibus?
                </p>
                <p>
                    Debitis eos aut ullam odit fuga. Numquam deleniti libero quas sunt?
                    Exercitationem earum odio aliquam necessitatibus est accusamus
                    consequuntur nisi natus dolore libero voluptatibus odit doloribus
                    laudantium iure, dicta placeat molestias porro quasi amet? Sint,
                    reiciendis tenetur distinctio eaque delectus, maiores, nihil
                    voluptas dolorem necessitatibus consequatur aliquid?
                </p>
                <p>
                    Sunt ex, cum culpa vel odio dicta expedita omnis amet debitis
                    inventore necessitatibus quaerat est molestias delectus. Dolorem,
                    eius? Quae, itaque ipsa incidunt nobis repellendus, sunt dolorum
                    aliquam ad culpa repudiandae impedit omnis, expedita illum voluptas
                    delectus similique ducimus saepe pariatur. Molestias similique quam
                    dolore provident doloremque maiores autem ab blanditiis voluptatum
                    dignissimos culpa sed nesciunt laboriosam, in dicta consectetur.
                </p>
                <p>
                    Voluptates ea, aspernatur possimus, iusto temporibus non laudantium
                    neque molestias rem tempore eligendi earum nisi dolorum asperiores
                    at rerum!
                </p>
                <p>
                    Eaque totam error quia, ut eius perspiciatis unde velit temporibus
                    mollitia. Aperiam ad tempora aliquam est molestias commodi
                    cupiditate quos impedit nostrum accusantium quo fugit eveniet
                    temporibus quam cumque autem porro, id ut debitis itaque et nemo
                    exercitationem voluptatibus? Aspernatur corrupti quas iusto dolores
                    nemo pariatur debitis quae dolorem! Nemo, eius? Dolorem quam nemo
                    magnam ratione deserunt aperiam. Voluptatum ipsa, molestias
                    aspernatur quas distinctio numquam qui laboriosam id ab totam
                    commodi laborum tempora error natus vitae eligendi reiciendis
                    maiores ex illo? Tempore at animi earum vitae enim sunt,
                    dignissimos, mollitia corrupti officia obcaecati error iure vero
                    repudiandae nihil magni molestias quibusdam dolorem aperiam modi.
                    Harum, fugit.
                </p>
            </div>

        </>
    )
}

function DragBox({ children, open, onClose }) {

    const [scope, animate] = useAnimate();

    const [drawerRef, { height }] = useMeasure();

    const transition = {
        ease: "easeInOut",
        duration: 1,
    }

    const controls = useDragControls();

    const y = useMotionValue(0);

    const dragDuration = useRef({ init: {}, finish: {} })

    async function handleClose() {

        const yStart = typeof y.get() === "number" ? y.get() : 0;


        animate("#drawer", {

            y: [yStart, height],


        })

        await animate(scope.current, {

            opacity: [1, 0],

        })



        if (onClose)
            onClose();
    }



    return (
        <>
            {open && <motion.div
                initial={{
                    opacity: 0
                }}
                animate={{
                    opacity: 1
                }}
                className={`fixed inset-0 z-50  w-full h-full bg-white/60   transition-all duration-500 overflow-hidden overscroll-none	`}
                onTouchMove={(e) => { e.preventDefault() }}
                ref={scope}
                transition={
                    {
                        ease: "easeInOut",
                        duration: 0.3
                    }
                }
                onClick={

                    (e) => {

                        handleClose()
                    }}>


                <motion.div
                    id="drawer"
                    initial={{
                        y: "100%"
                    }}
                    animate={{
                        y: "0%"
                    }}
                    transition={
                        {
                            ease: "easeInOut",
                            duration: 0.3
                        }
                    }
                    onDragStart={(_, info) => {
                        dragDuration.current.init = new Date();
                        console.log("INIT Del Drag", info);
                    }}
                    onDragEnd={(_, info) => {
                        dragDuration.current.finish = new Date();

                        console.log("END Del Drag", info);
                        console.log("Y:", y.get())
                        console.log("Duration:", dragDuration.current);
                        if (y.get() >= height / 2.5 || (y.get() < 200 && dragDuration.current.finish - dragDuration.current.init < 300)) {
                            handleClose();
                        }

                    }}
                    ref={drawerRef}

                    drag="y"
                    dragControls={controls}
                    dragListener={false}
                    dragConstraints={
                        {
                            top: 0,
                            bottom: 0,
                        }
                    }
                    dragElastic={
                        {
                            top: 0,
                            bottom: 1
                        }
                    }
                    style={{ y }}
                    onClick={(e) => e.stopPropagation()}
                    className="absolute bottom-0 w-full h-[75vh] bg-[#1C2434]  rounded-t-3xl  overflow-hidden">

                    <button className="group/drag h-[45px] w-full flex justify-center p-4 shadow-sm 
                    cursor-grab touch-none active:cursor-grabbing"
                        onPointerDown={(e) => {
                            controls.start(e);
                        }}
                    >
                        <div className="h-[5px] w-[60px] bg-slate-700 rounded-full group-active/drag:bg-slate-400 group-hover/drag:bg-slate-400 duration-200"></div>
                    </button>

                    <div className="relative h-full overflow-y-auto p-4">
                        {children}
                    </div>




                </motion.div>


            </motion.div>}
        </>

    )

}

export default function DragBoxComponent({ }) {
    const [open, setOpen] = useState(false)

    return (
        <>
            <div className="fixed inset-0 w-full h-full bg-black/80 flex justify-center items-center">
                <button className="p-4 bg-sky-600 text-[whitesmoke] rounded-md shadow-md" onClick={() => { setOpen(true) }}>Open Box</button>
            </div>
            <DragBox open={open} onClose={() => setOpen(false)}>
                <ContentForTest />
            </DragBox>
        </>


    )
}