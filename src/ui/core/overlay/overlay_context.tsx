import { createContext, useContext } from 'react'

interface OverlayContextProps {
    closeOverlay: () => void
}

export const OverlayContext = createContext<OverlayContextProps | undefined>(
    undefined
)

export const useOverlay = () => {
    const context = useContext(OverlayContext)
    if (!context) {
        throw new Error('useOverlay must be used within an OverlayProvider')
    }
    return context
}
