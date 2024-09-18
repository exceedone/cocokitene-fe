'use client'
import { Select } from 'antd'
import { useLocale } from 'next-intl'
import { usePathname, useRouter } from 'next-intl/client'
import { useTransition } from 'react'

const LocaleSwitcher = () => {
    const [isPending, startTransition] = useTransition()
    const locale = useLocale()
    const router = useRouter()
    const pathname = usePathname()

    // function onSelectLocal(event: ChangeEvent<HTMLSelectElement>) {
    function onSelectLocal(event: string) {
        // const nextLocaleSelected: string = event.target.value
        const nextLocaleSelected = event
        console.log('nextLocaleSelected: ', nextLocaleSelected)
        startTransition(() => {
            document.cookie = `NEXT_LOCALE=${nextLocaleSelected}; path=/, max-age=31536000, SameSite=Lax`
            router.replace(pathname, { locale: nextLocaleSelected })
            router.refresh()
        })
    }

    return (
        <label
            className={`
                relative text-sm text-white ${
                    isPending && 'transition-opacity [&:disabled]:opacity-30'
                }
            `}
        >
            {/* <select
                className="inline-flex cursor-pointer bg-transparent pb-2  pl-2 pr-1 pt-2"
                defaultValue={locale}
                disabled={isPending}
                // onChange={onSelectLocal}
            >
                {['en', 'ja'].map((cur) => (
                    <option key={cur} value={cur} className="text-black">
                        {cur.toUpperCase()}
                    </option>
                ))}
            </select> */}

            <Select
                className="select-custom inline-flex cursor-pointer border-0 bg-transparent pb-2 pl-2  pr-1 pt-2 text-white"
                value={locale}
                disabled={isPending}
                onChange={onSelectLocal}
            >
                {['en', 'ja'].map((cur) => (
                    <option key={cur} value={cur} className="text-black">
                        {cur.toUpperCase()}
                    </option>
                ))}
            </Select>
        </label>
    )
}

export default LocaleSwitcher
