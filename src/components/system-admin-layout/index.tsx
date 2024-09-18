'use client'

import Content from '@/components/system-admin-layout/content'
import { Layout } from 'antd'
import { ReactNode, useEffect, useState } from 'react'
import Header from './header'
import Sidebar from './sidebar'
import { useAuthAdminLogin } from '@/stores/auth-admin/hooks'

export interface ISystemAdminLayout {
    children: ReactNode
}

const SystemAdminLayout = (props: ISystemAdminLayout) => {
    const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
        if (typeof window !== 'undefined') {
            // Client-side-only code
            return !(window.innerWidth > 1280)
        }
        return true
    })
    const [isOpenDraw, setIsOpenDraw] = useState<boolean>(false)
    const { authAdminState } = useAuthAdminLogin()
    const [mounted, setMounted] = useState(false)
    useEffect(() => {
        setMounted(true)
    }, [])
    return (
        <Layout className="min-h-screen">
            <Header setIsOpenDraw={setIsOpenDraw} />
            <Layout className="mt-12">
                {mounted && authAdminState.isAuthenticated && (
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

export default SystemAdminLayout
