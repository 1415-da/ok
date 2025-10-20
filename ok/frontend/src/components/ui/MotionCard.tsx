import React, { ReactNode, useMemo, useState } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";

/**
 * Utility to join conditional classNames
 */
function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type CornerRadius = "rounded-lg" | "rounded-xl" | "rounded-2xl" | "rounded-3xl";

export interface MotionCardProps
  extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode;

  // Motion
  hoverScale?: number;
  pressScale?: number;
  hoverLift?: number;
  // layout is available from HTMLMotionProps

  // Visuals
  rounded?: CornerRadius;
  gradientFrom?: string; // e.g. "from-primary-500/30"
  gradientVia?: string; // e.g. "via-accent-500/20"
  gradientTo?: string; // e.g. "to-secondary-500/30"
  glow?: boolean; // adds glow on hover
  spotlight?: boolean; // radial highlight spotlight that follows mouse
  innerClassName?: string; // className for the inner content container
}

/**
 * MotionCard
 * - Reusable animated card with:
 *   - Gradient border
 *   - Subtle hover scale and lift
 *   - Optional glow
 *   - Optional mouse-follow spotlight
 *   - Composable subcomponents: Header, Title, Description, Body, Footer
 *
 * Tailwind color tokens expected in the project:
 * - primary, secondary, accent, success, warning, error, info, gray
 */
const MotionCard = React.forwardRef<HTMLDivElement, MotionCardProps>(
  (
    {
      children,
      className,
      innerClassName,
      // Motion defaults
      hoverScale = 1.02,
      pressScale = 0.995,
      hoverLift = 2,
      layout = true,
      // Visual defaults
      rounded = "rounded-2xl",
      gradientFrom = "from-primary-500/30",
      gradientVia = "via-accent-500/20",
      gradientTo = "to-secondary-500/30",
      glow = true,
      spotlight = true,
      // Allow overrides from MotionProps / HTMLAttributes
      initial,
      animate,
      exit,
      transition,
      ...rest
    },
    ref,
  ) => {
    const [mouse, setMouse] = useState({ xPct: 50, yPct: 50 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!spotlight) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const xPct = Math.max(0, Math.min(100, (x / rect.width) * 100));
      const yPct = Math.max(0, Math.min(100, (y / rect.height) * 100));
      setMouse({ xPct, yPct });
    };

    const gradientBorderClasses = useMemo(
      () => cn("bg-gradient-to-br", gradientFrom, gradientVia, gradientTo),
      [gradientFrom, gradientVia, gradientTo],
    );

    return (
      <motion.div
        ref={ref}
        className={cn("group relative", className)}
        onMouseMove={handleMouseMove}
        initial={initial ?? { opacity: 0, y: 8 }}
        animate={animate ?? { opacity: 1, y: 0 }}
        exit={exit}
        layout={layout}
        transition={
          transition ?? {
            type: "spring",
            stiffness: 300,
            damping: 24,
            mass: 0.8,
          }
        }
        whileHover={{ y: -hoverLift, scale: hoverScale }}
        whileTap={{ scale: pressScale }}
        {...rest}
      >
        {/* Gradient border wrapper */}
        <div className={cn("relative p-[1px]", rounded, gradientBorderClasses)}>
          {/* Inner surface */}
          <div
            className={cn(
              "relative bg-white",
              rounded,
              // Base shadow + hover enhancement
              "shadow-md transition-shadow duration-300",
              glow && "group-hover:shadow-glow",
              innerClassName,
            )}
          >
            {/* Subtle ring that increases on hover for crisp edges */}
            <div
              className={cn(
                "pointer-events-none absolute inset-0",
                rounded,
                "ring-1 ring-black/[0.06] group-hover:ring-black/[0.1]",
              )}
            />

            {/* Mouse-follow spotlight */}
            {spotlight && (
              <div
                className={cn(
                  "pointer-events-none absolute inset-0 opacity-0",
                  rounded,
                  "transition-opacity duration-300 group-hover:opacity-100",
                )}
                style={{
                  background: `radial-gradient(600px circle at ${mouse.xPct}% ${mouse.yPct}%, rgba(245,158,11,0.08), transparent 40%)`,
                }}
              />
            )}

            {/* Content */}
            <div className="relative">{children}</div>
          </div>
        </div>
      </motion.div>
    );
  },
);

MotionCard.displayName = "MotionCard";

/**
 * Subcomponents for structured composition
 */

interface SectionProps {
  children: ReactNode;
  className?: string;
}

const Header = ({ children, className }: SectionProps) => {
  return (
    <div className={cn("mb-4 flex items-center justify-between", className)}>
      {children}
    </div>
  );
};

interface TitleProps extends SectionProps {
  subtitle?: ReactNode;
}

const Title = ({ children, subtitle, className }: TitleProps) => {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <h3 className="text-lg font-semibold text-gray-900">{children}</h3>
      {subtitle ? <p className="text-sm text-gray-600">{subtitle}</p> : null}
    </div>
  );
};

const Description = ({ children, className }: SectionProps) => {
  return <p className={cn("text-sm text-gray-600", className)}>{children}</p>;
};

const Body = ({ children, className }: SectionProps) => {
  return <div className={cn("", className)}>{children}</div>;
};

const Footer = ({ children, className }: SectionProps) => {
  return (
    <div
      className={cn(
        "mt-4 flex items-center justify-end gap-2 border-t border-gray-100 pt-4",
        className,
      )}
    >
      {children}
    </div>
  );
};

(MotionCard as any).Header = Header;
(MotionCard as any).Title = Title;
(MotionCard as any).Description = Description;
(MotionCard as any).Body = Body;
(MotionCard as any).Footer = Footer;

export default MotionCard;
export {
  Header as MotionCardHeader,
  Title as MotionCardTitle,
  Description as MotionCardDescription,
  Body as MotionCardBody,
  Footer as MotionCardFooter,
};
