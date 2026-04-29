import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export const CustomCursor = () => {
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 300, damping: 28, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 300, damping: 28, mass: 0.4 });

  useEffect(() => {
    if (window.matchMedia("(max-width: 768px)").matches) return;
    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
    };
    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      setHovering(!!t.closest("a, button, [role='button'], [data-cursor='hover']"));
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
    };
  }, [x, y]);

  if (typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches) return null;

  return (
    <>
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[100] h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold mix-blend-difference"
        style={{ x, y, opacity: visible ? 1 : 0 }}
      />
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[100] rounded-full border border-gold/60 -translate-x-1/2 -translate-y-1/2"
        style={{ x: springX, y: springY, opacity: visible ? 1 : 0 }}
        animate={{ width: hovering ? 60 : 40, height: hovering ? 60 : 40 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      />
    </>
  );
};