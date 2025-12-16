    import { ReactNode } from "react"

    type Props = {
    children: ReactNode
    className?: string
    }

    export default function GlassCard({ children, className = "" }: Props) {
    return (
        <div
        className={`
            bg-white/45
            dark:bg-gray-900/70
            backdrop-blur-xs
            rounded-2xl
            shadow-lg
            h-full
            flex
            flex-col
            overflow-hidden
            ${className}
        `}
        >
        {children}
        </div>
    )
    }
