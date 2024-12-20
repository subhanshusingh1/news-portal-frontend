import { ArrowPathIcon, CloudArrowUpIcon, FingerPrintIcon, LockClosedIcon } from '@heroicons/react/24/outline'

const features = [
    {
        name: 'Push to deploy',
        description:
            'Morbi viverra dui mi arcu sed. Tellus semper adipiscing suspendisse semper morbi. Odio urna massa nunc massa.',
        icon: CloudArrowUpIcon,
    },
    {
        name: 'SSL certificates',
        description:
            'Sit quis amet rutrum tellus ullamcorper ultricies libero dolor eget. Sem sodales gravida quam turpis enim lacus amet.',
        icon: LockClosedIcon,
    },
    {
        name: 'Simple queues',
        description:
            'Quisque est vel vulputate cursus. Risus proin diam nunc commodo. Lobortis auctor congue commodo diam neque.',
        icon: ArrowPathIcon,
    },
    {
        name: 'Advanced security',
        description:
            'Arcu egestas dolor vel iaculis in ipsum mauris. Tincidunt mattis aliquet hac quis. Id hac maecenas ac donec pharetra eget.',
        icon: FingerPrintIcon,
    },
]

export default function Dashboard() {
    return (
        <>
            <div className="bg-white py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div class="flex flex-col lg:flex-row items-center justify-between p-4">

                        <div class="text-center lg:text-left lg:w-1/2">
                            <h2 className="text-base/7 font-semibold text-indigo-600">By Eliana Dockterman</h2>
                            <p className="mt-2 text-pretty text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                                How LTK Revolutionized Shopping
                            </p>

                        </div>


                        <div class="w-full lg:w-1/2 mt-4 lg:mt-0">
                            <img
                                alt="Product screenshot"
                                src="https://tailwindui.com/plus/img/ecommerce-images/category-page-04-image-card-01.jpg"
                                class="w-full rounded-xl shadow-xl"
                            />
                        </div>
                    </div>

                </div>
                <div className="bg-white py-24 sm:py-32">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl lg:text-center">
                           
                            <p className="mt-6 text-lg/8 text-gray-600 text-left">
                               Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe molestiae natus cumque tempora repellendus deleniti quis quod optio ab a eos, explicabo illo, sit esse error provident inventore magni reprehenderit facere eligendi praesentium voluptatibus quos nulla. Vel, ullam odit! Vero rem error asperiores odio ipsum aperiam nesciunt assumenda fugiat maiores dolor cumque incidunt hic voluptates sit consequatur qui veritatis adipisci, maxime labore necessitatibus tempora facere est pariatur odit? Dolorum unde blanditiis impedit natus dicta cumque, quis, dolore fuga sequi odit at corporis reiciendis autem atque ex et reprehenderit facere temporibus beatae mollitia laborum nisi in. Consequatur necessitatibus temporibus consectetur quasi?
                            </p>
                        </div>

                    </div>
                </div>
            </div>

        </>
    )
}
