"use client"

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position="top-center"
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      toastOptions={{
        unstyled: false,
        classNames: {
          toast: 'group-[.toaster]:border',
          success: 'group-[.toaster]:!bg-success group-[.toaster]:!text-success-foreground group-[.toaster]:!border-success-foreground/20',
          error: 'group-[.toaster]:!bg-error group-[.toaster]:!text-error-foreground group-[.toaster]:!border-error-foreground/20',
          warning: 'group-[.toaster]:!bg-warning group-[.toaster]:!text-warning-foreground group-[.toaster]:!border-warning-foreground/20',
          info: 'group-[.toaster]:!bg-info group-[.toaster]:!text-info-foreground group-[.toaster]:!border-info-foreground/20',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
