import { motion, useAnimate, useDragControls, useMotionValue } from "framer-motion";
import useMeasure from "react-use-measure";
import { ReactNode } from "react";

interface DrawerProps {
  children?: ReactNode;
  closeOverlay?: () => void | undefined;
}

function Drawer({ children, closeOverlay }: DrawerProps) {
  const [scope, animate] = useAnimate();
  const controls = useDragControls();
  const y = useMotionValue(0);

  const [drawerRef, { height }] = useMeasure();

  async function handleClose() {
    animate(scope.current, {
      opacity: [1, 0],
    });

    const yStart = typeof y.get() === "number" ? y.get() : 0;

    await animate("#drawer", {
      y: [yStart, height],
    });

    if (closeOverlay) closeOverlay();
  }

  return (
    <motion.div
      ref={scope}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={handleClose}
      className="fixed inset-0 z-50 bg-neutral-950/70"
    >
      <motion.div
        id={"drawer"}
        ref={drawerRef}
        drag={"y"}
        dragConstraints={{
          top: 0,
          bottom: 0,
        }}
        dragElastic={{ top: 0, bottom: 0.5 }}
        dragListener={false}
        dragControls={controls}
        style={{ y }}
        onDragEnd={() => {
          if (y.get() > 100) handleClose();
        }}
        initial={{ y: "100%" }}
        animate={{ y: "0%" }}
        transition={{ ease: "easeInOut" }}
        className="absolute bottom-0 w-full rounded-t-lg bg-white"
      >
        <div className="flex items-center justify-center p-2">
          <button
            onPointerDown={(e) => controls.start(e)}
            className=" cursor-grab active:cursor-grabbing touch-none rounded-full bg-primary"
          ></button>
        </div>
        <div className="h-full w-full overflow-y-autop p-4">{children}</div>
      </motion.div>
    </motion.div>
  );
}

export default Drawer;
