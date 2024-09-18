import {
    SIDEBAR_CLOSE_WIDTH,
    SIDEBAR_ITEMS_SYSTEM,
    SIDEBAR_OPEN_WIDTH,
} from '@/constants/common'
import { capitalizeFirstLetter } from '@/utils/format-string'
import {
    MenuFoldOutlined,
    MenuOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons'
import { Button, Drawer, Grid, Layout, Menu, MenuProps } from 'antd'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createElement, useCallback } from 'react'
import { LogoAppIcon } from '../svgs'

type MenuItem = Required<MenuProps>['items'][number]
const { useBreakpoint } = Grid

interface ISidebar {
    isCollapsed: boolean
    // eslint-disable-next-line
    setIsCollapsed: (value: boolean) => void
    isOpenDraw: boolean
    // eslint-disable-next-line
    setIsOpenDraw: (value: boolean) => void
}

const Sidebar = ({
    isCollapsed,
    setIsCollapsed,
    isOpenDraw,
    setIsOpenDraw,
}: ISidebar) => {
    const pathname = usePathname()
    const screens = useBreakpoint()

    const router = useRouter()
    const t = useTranslations()

    const redirect = async ({ key }: { key: string }) => {
        await router.push(key)
        setTimeout(() => {
            setIsOpenDraw(false)
        }, 345)
        if (!screens.xl) {
            setIsCollapsed(true)
        }
    }

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed)
    }

    const toggleDraw = () => {
        setIsOpenDraw(!isOpenDraw)
    }

    const menuItems: MenuItem[] = SIDEBAR_ITEMS_SYSTEM.map((sidebarItem) => {
        const { label, key, icon } = sidebarItem
        return {
            key,
            icon: createElement(icon),
            label: capitalizeFirstLetter(t(label)),
        }
    })

    const getSelectedKey = useCallback(() => {
        let selectedKey: string = ''
        for (const sidebarItem of SIDEBAR_ITEMS_SYSTEM) {
            if (pathname.includes(sidebarItem.key)) {
                selectedKey = sidebarItem.key
                break
            }
        }
        return selectedKey
    }, [pathname])

    const sidebarWidth = isCollapsed ? SIDEBAR_CLOSE_WIDTH : SIDEBAR_OPEN_WIDTH

    return (
        <>
            <Layout.Sider
                width={sidebarWidth}
                collapsible
                trigger={null}
                collapsed={isCollapsed}
                className="fixed z-50 hidden h-full overflow-auto bg-white md:block"
            >
                <Menu
                    className="h-full"
                    onClick={redirect}
                    mode={'inline'}
                    selectedKeys={[getSelectedKey()]}
                    items={menuItems}
                />
                <div
                    className={`fixed bottom-0 left-0 z-20 flex h-10 items-center border-t border-neutral/4 px-6  w-[${sidebarWidth}px]`}
                    style={{ width: `${sidebarWidth}px` }}
                >
                    <Button
                        type="text"
                        icon={
                            isCollapsed ? (
                                <MenuUnfoldOutlined />
                            ) : (
                                <MenuFoldOutlined />
                            )
                        }
                        onClick={toggleSidebar}
                    />
                </div>
            </Layout.Sider>
            <Drawer
                title={
                    <div className="mx-auto flex h-12 items-center justify-center bg-primary px-0 py-0 max-[470px]:pr-1">
                        <div className="flex items-center justify-center gap-1">
                            <Button
                                type="text"
                                icon={
                                    <MenuOutlined
                                        style={{ color: '#ffffff' }}
                                    />
                                }
                                className="md:hidden"
                                onClick={toggleDraw}
                            />
                            <Link href="/dashboard">
                                <LogoAppIcon />
                            </Link>
                        </div>
                    </div>
                }
                headerStyle={{ padding: '0px' }}
                bodyStyle={{ padding: 0 }}
                placement="left"
                width="208"
                // className="md:hidden"
                // size={size}
                onClose={toggleDraw}
                open={isOpenDraw}
                closeIcon={false}
            >
                <Menu
                    className="h-full w-full p-0"
                    onClick={redirect}
                    mode={'inline'}
                    selectedKeys={[getSelectedKey()]}
                    items={menuItems}
                />
            </Drawer>
        </>
    )
}

export default Sidebar
