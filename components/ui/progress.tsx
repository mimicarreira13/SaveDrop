"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { motion } from "framer-motion";
import { cn } from "./utils";

interface ProgressProps extends React.ComponentProps<typeof ProgressPrimitive.Root> {
  value?: number;
  color?: "white" | "blue" | "green";
  animate?: boolean;
  duration?: number;
}

export function Progress({
                           className,
                           value = 0,
                           color = "blue",
                           animate = true,
                           duration = 1,
                           ...props
                         }: ProgressProps) {
  // escolher a cor da barra
  const colorClasses = {
    white: "bg-white",
    blue: "bg-blue-500",
    green: "bg-green-500",
  }[color];

  return (
      <ProgressPrimitive.Root
          data-slot="progress"
          className={cn(
              "bg-primary/20 relative h-2 w-full overflow-hidden rounded-full",
              className
          )}
          {...props}
      >
        <ProgressPrimitive.Indicator asChild>
          {animate ? (
              <motion.div
                  className={cn("h-full rounded-full", colorClasses)}
                  initial={{ width: 0 }}
                  animate={{ width: `${value}%` }}
                  transition={{ duration, ease: "easeOut" }}
              />
          ) : (
              <div
                  className={cn("h-full rounded-full", colorClasses)}
                  style={{ width: `${value}%` }}
              />
          )}
        </ProgressPrimitive.Indicator>
      </ProgressPrimitive.Root>
  );
}
