
/* eslint-disable @typescript-eslint/no-explicit-any */
import { AreaChart, Card } from '@tremor/react';
import LineChart from './LineChart';


const data = [
    {
        date: 'Jan 23',
        Commissions: 232,
        Revenue: 40,
    },
    {
        date: 'Feb 23',
        Commissions: 241,
        Revenue: 30,
    },
    {
        date: 'Mar 23',
        Commissions: 291,
        Revenue: 90,
    },
    {
        date: 'Apr 23',
        Commissions: 101,
        Revenue: 60,
    },
    {
        date: 'May 23',
        Commissions: 318,
        Revenue: 50,
    },
    {
        date: 'Jun 23',
        Commissions: 205,
        Revenue: 40,
    },
    {
        date: 'Jul 23',
        Commissions: 372,
        Revenue: 20,
    },
    {
        date: 'Aug 23',
        Commissions: 341,
        Revenue: 30,
    },
    {
        date: 'Sep 23',
        Commissions: 387,
        Revenue: 120,
    },
    {
        date: 'Oct 23',
        Commissions: 220,
        Revenue: 120,
    },
    {
        date: 'Nov 23',
        Commissions: 372,
        Revenue: 120,
    },
    {
        date: 'Dec 23',
        Commissions: 321,
        Revenue: 120,
    },
];

const valueFormatter = (number: number) =>
    `${Intl.NumberFormat('us').format(number).toString()}`;

export default function ChartTest() {
    return (
        <div className='flex max-lg:flex-col gap-8'>
            <div className='flex flex-col gap-4'>
                <Card className=" sm:max-w-sm p-4 pt-0 border-l-4 border-yellow-500">

                    <div className='flex items-center justify-between'>
                        <div>
                            <span className='text-xl text-green-400'>+11,368.45</span>
                            <h3 className="font-medium text-tremor-content-strong/50 dark:text-dark-tremor-content-strong">
                                Total Commission
                            </h3>
                        </div>
                        <AreaChart
                            showXAxis={false}
                            data={data}
                            index="date"
                            categories={['Commissions']}
                            colors={['orange', 'yellow']}
                            valueFormatter={valueFormatter}
                            showLegend={false}
                            showYAxis={false}
                            showGradient={false}
                            startEndOnly={true}
                            className="mt-6 h-32 w-52"
                        />
                    </div>
                </Card>
                <Card className=" sm:max-w-sm p-4 pt-0 border-l-4 border-yellow-500">

                    <div className='flex items-center justify-between'>
                        <div>
                            <span className='text-xl text-green-400'>+$32,506.72</span>
                            <h3 className="font-medium text-tremor-content-strong/50 dark:text-dark-tremor-content-strong">
                                Paid Revenue
                            </h3>
                        </div>
                        <AreaChart
                            showXAxis={false}
                            data={data}
                            index="date"
                            categories={['Revenue']}
                            colors={['yellow']}
                            valueFormatter={valueFormatter}
                            showLegend={false}
                            showYAxis={false}
                            showGradient={false}
                            startEndOnly={true}
                            className="mt-6 h-32 w-52"
                        />
                    </div>
                </Card>
            </div>
            <div className='w-full'>
                <Card className="border-l-4 border-yellow-500">
                    <LineChart />
                </Card>
            </div>
        </div>
    );
}