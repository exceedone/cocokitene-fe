import { LogoAppIcon } from '@/components/svgs'
import { Button, Layout } from 'antd'
import Link from 'next/link'
import AccountInfoSystem from '../account-info-system'
import { useEffect, useState } from 'react'
import { useAuthAdminLogin } from '@/stores/auth-admin/hooks'
import LocaleSwitcher from '../local-switcher'
import { MenuOutlined } from '@ant-design/icons'

interface IHeader {
    // eslint-disable-next-line
    setIsOpenDraw: (value: boolean) => void
}

const Header = ({ setIsOpenDraw }: IHeader) => {
    const { authAdminState } = useAuthAdminLogin()
    const [mounted, setMounted] = useState(false)
    useEffect(() => {
        setMounted(true)
    }, [])
    return (
        <Layout.Header className="fixed z-10 h-12 w-full bg-primary px-4 py-0 text-white max-[470px]:px-2">
            <div className="flex h-full items-center justify-between">
                <div className="flex items-center justify-between gap-1">
                    <Button
                        type="text"
                        icon={<MenuOutlined style={{ color: '#ffffff' }} />}
                        className="md:hidden"
                        onClick={() => {
                            setIsOpenDraw(true)
                        }}
                    />
                    <Link href="/dashboard-system">
                        <LogoAppIcon />
                    </Link>
                </div>

                <div className="flex gap-3 sm:gap-5">
                    <LocaleSwitcher />
                    {mounted && authAdminState.isAuthenticated && (
                        <AccountInfoSystem
                            name="Stan Lee"
                            avatar="/images/default-avatar.png"
                        />
                    )}
                </div>
            </div>
        </Layout.Header>
    )
}

export default Header
