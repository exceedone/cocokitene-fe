import { IParticipantsView } from '@/components/participants-detail'
import { getFirstCharacterUpperCase } from '@/utils/get-first-character'
import { Avatar, Typography } from 'antd'
import Color from 'color'
import { useTranslations } from 'next-intl'

const { Text } = Typography

interface IParticipantItem extends IParticipantsView {}

const ParticipantItem = ({
    defaultAvatarHashColor,
    email,
    avatar,
    joined,
}: IParticipantItem) => {
    const t = useTranslations()

    const backgroundAvatarColor = Color(defaultAvatarHashColor)
        .lighten(0.6)
        .hex()

    return (
        <div className="flex items-center justify-between">
            <div className="flex w-[90%] items-center gap-2">
                {avatar ? (
                    <Avatar
                        src={avatar}
                        alt="avatar-alt"
                        size="small"
                        style={{
                            backgroundColor: backgroundAvatarColor,
                            verticalAlign: 'middle',
                            opacity: `${joined ? 1 : 0.55}`,
                        }}
                    />
                ) : (
                    <Avatar
                        style={{
                            backgroundColor: backgroundAvatarColor,
                            verticalAlign: 'middle',
                            color: defaultAvatarHashColor,
                            opacity: `${joined ? 1 : 0.55}`,
                        }}
                        size="small"
                    >
                        {getFirstCharacterUpperCase(email)}
                    </Avatar>
                )}
                <div className="w-[90%] cursor-pointer">
                    <Text
                        title={email}
                        className={`${
                            !joined && 'text-black-45'
                        } w-[80%] truncate`}
                    >
                        {/* {truncateString({ text: email, start: 10, end: 0 })}{' '} */}
                        {email}{' '}
                    </Text>
                    {joined && (
                        <Text className="text-polar-green">
                            ({t('JOINED')})
                        </Text>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ParticipantItem
