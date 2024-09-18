import { useListPlan } from '@/stores/service-plan/hooks'
import PlanItem from './plan-card'

import Sliders from 'react-slick'
import { EActionStatus } from '@/stores/type'
import Loader from '@/components/loader'
import EmptyServicePlan from './empty-plan'

const PlanList = ({ ad }: { ad?: boolean }) => {
    const { planState } = useListPlan()

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        className: 'center',
        customPaging: function () {
            return <div className="dot"></div>
        },
        dotsClass: 'slick-dots slick-thumb',
        responsive: [
            {
                breakpoint: 640,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                },
            },
        ],
    }

    if (!planState || planState?.status === EActionStatus.Pending) {
        return <Loader />
    }

    if (planState?.planList.length == 0) {
        return <EmptyServicePlan />
    }

    return (
        <div className="mx-auto w-[97%] max-w-[1200px]">
            <Sliders {...settings} className="">
                {planState?.planList.map((item) => (
                    <div key={item.id} className="mx-auto px-[12px] py-[32px]">
                        <PlanItem
                            key={item.id}
                            id={item.id}
                            planName={item.planName}
                            description={item.description}
                            maxMeeting={item.maxMeeting}
                            maxShareholderAccount={item.maxShareholderAccount}
                            maxStorage={item.maxStorage}
                            price={item.price}
                            isRecommended={false}
                            className="mx-auto max-w-[320px]"
                            ad={ad}
                        />
                    </div>
                ))}
            </Sliders>
        </div>
    )
}

export default PlanList
