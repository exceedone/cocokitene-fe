'use client'

import Content from '@/components/workspace-layout/content'
import { useAuthLogin } from '@/stores/auth/hooks'
import { Layout } from 'antd'
import { ReactNode, useEffect, useState } from 'react'
import Header from './header'
import Sidebar from './sidebar'

export interface IWorkspaceLayout {
    children: ReactNode
}

const WorkspaceLayout = (props: IWorkspaceLayout) => {
    const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
        // if (typeof window !== 'undefined') {
        //     // Client-side-only code
        //     return !(window.innerWidth > 1280)
        // }
        return true
    })

    const [isOpenDraw, setIsOpenDraw] = useState<boolean>(false)
    const { authState } = useAuthLogin()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])
    return (
        <Layout className="min-h-screen">
            <Header setIsOpenDraw={setIsOpenDraw} />
            <Layout className="mt-12">
                {mounted && authState.isAuthenticated && (
                    <Sidebar
                        isCollapsed={isCollapsed}
                        isOpenDraw={isOpenDraw}
                        setIsCollapsed={setIsCollapsed}
                        setIsOpenDraw={setIsOpenDraw}
                    />
                )}

                <Content isCollapsed={isCollapsed} {...props} />
            </Layout>
        </Layout>
    )
}

export default WorkspaceLayout
