import * as React from "react"
import { cn } from "cn"

function Container({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="container"
      className={cn("mx-auto w-full max-w-6xl px-5 md:px-8", className)}
      {...props}
    />
  )
}

export { Container }
