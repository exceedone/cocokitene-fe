import { ReactNode } from 'react'

export interface IAuthLayout {
    children: ReactNode
}

//use for screen login, forgot-password, change-password

const AuthLayout = ({ children }: IAuthLayout) => {
    return (
        <div className="grid min-h-screen w-full place-content-center bg-login-bg bg-cover bg-center">
            <div className="mx-auto flex  flex-col justify-center rounded-md bg-white p-8 shadow-lg max-sm:w-[370px] sm:w-[500px]">
                {children}
            </div>
        </div>
    )
}

export default AuthLayout
