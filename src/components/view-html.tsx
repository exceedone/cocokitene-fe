import dynamic from 'next/dynamic'
import { useMemo } from 'react'
import 'react-quill/dist/quill.bubble.css'

interface IViewHtml {
    value: string
}

const ViewHtml = ({ value }: IViewHtml) => {
    const ReactQuill = useMemo(
        () => dynamic(() => import('react-quill'), { ssr: false }),
        [],
    )

    return (
        <div>
            <ReactQuill
                value={value}
                readOnly={true}
                theme={'bubble'}
                className=""
            />
        </div>
    )
}

export default ViewHtml
