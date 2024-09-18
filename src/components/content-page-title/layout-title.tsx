import { ReactNode } from 'react'

export interface IBaseTitle {
    pageName: string
}

export interface ILayoutTitle {
    children: ReactNode
}

const LayoutTitle = ({ children }: ILayoutTitle) => {
    return (
        <div className="content-title sticky top-12 z-20 flex items-center justify-between gap-3 bg-white px-6 py-4 max-[470px]:px-2">
            {children}
        </div>
    )
}

export default LayoutTitle
