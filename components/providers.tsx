"use client"

import { Provider } from "react-redux"
import { store } from "@/lib/store"
import { TooltipProvider } from "@/components/ui/tooltip"

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <Provider store={store}>
      <TooltipProvider>
        {children}
      </TooltipProvider>
    </Provider>
  )
}
