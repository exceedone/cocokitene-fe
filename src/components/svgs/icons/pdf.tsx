import { IBaseSvg } from '@/components/svgs/icons/types'

export interface IIcon extends IBaseSvg {
    fill: string
}

export const Icon = ({ width = 14, height = 14, fill }: IIcon) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M6.30107 7.975L6.30576 7.95312C6.39639 7.57969 6.51045 7.11406 6.42139 6.69219C6.36201 6.35938 6.1167 6.22969 5.90732 6.22031C5.66045 6.20937 5.44014 6.35 5.38545 6.55469C5.28232 6.92969 5.37451 7.44219 5.54326 8.09531C5.33076 8.60156 4.9917 9.3375 4.74326 9.775C4.28076 10.0141 3.66045 10.3828 3.56826 10.8484C3.54951 10.9344 3.57139 11.0437 3.62295 11.1422C3.68076 11.2516 3.77295 11.3359 3.88076 11.3766C3.92764 11.3937 3.98389 11.4078 4.04951 11.4078C4.32451 11.4078 4.76982 11.1859 5.36357 10.1672C5.4542 10.1375 5.54795 10.1062 5.63857 10.075C6.06357 9.93125 6.5042 9.78125 6.90264 9.71406C7.34326 9.95 7.84483 10.1016 8.18545 10.1016C8.52295 10.1016 8.65576 9.90156 8.70576 9.78125C8.79326 9.57031 8.75107 9.30469 8.60889 9.1625C8.40264 8.95938 7.90108 8.90625 7.11983 9.00313C6.73545 8.76875 6.48389 8.45 6.30107 7.975ZM4.58701 10.3484C4.36982 10.6641 4.20576 10.8219 4.1167 10.8906C4.22139 10.6984 4.42607 10.4953 4.58701 10.3484ZM5.95576 6.66875C6.03701 6.80781 6.02607 7.22813 5.96357 7.44063C5.88701 7.12969 5.87607 6.68906 5.92139 6.6375C5.93389 6.63906 5.94483 6.64844 5.95576 6.66875ZM5.93076 8.55156C6.09795 8.84062 6.30889 9.08906 6.5417 9.27344C6.2042 9.35 5.89639 9.47656 5.62139 9.58906C5.55576 9.61563 5.4917 9.64219 5.4292 9.66719C5.63701 9.29063 5.81045 8.86406 5.93076 8.55156ZM8.36201 9.575C8.36358 9.57812 8.36514 9.58281 8.35576 9.58906H8.35264L8.34951 9.59375C8.33701 9.60156 8.20889 9.67656 7.65732 9.45938C8.2917 9.42969 8.36045 9.57344 8.36201 9.575ZM11.3526 3.50938L7.99014 0.146875C7.89639 0.053125 7.76982 0 7.63701 0H0.999512C0.722949 0 0.499512 0.223437 0.499512 0.5V13.5C0.499512 13.7766 0.722949 14 0.999512 14H10.9995C11.2761 14 11.4995 13.7766 11.4995 13.5V3.86406C11.4995 3.73125 11.4464 3.60313 11.3526 3.50938ZM10.3464 4.09375H7.40576V1.15313L10.3464 4.09375ZM10.3745 12.875H1.62451V1.125H6.34326V4.5C6.34326 4.67405 6.4124 4.84097 6.53547 4.96404C6.65854 5.08711 6.82546 5.15625 6.99951 5.15625H10.3745V12.875Z"
                fill={fill}
            />
        </svg>
    )
}

export default Icon