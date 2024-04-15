
import { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from '@tremor/react';
import HtmlTooltip from './HtmlToolTip';
import axios from 'axios';
import { DataItem } from '../types';
import { useAuthorize } from '../store/store';

/* eslint-disable @typescript-eslint/no-explicit-any */

export default function ParkingSessionTable({ siteCode }: { siteCode?: string }) {
    const { user } = useAuthorize()
    const [dataArr, setDataArr] = useState<DataItem[]>([]);
    const fetchData = async () => {
        const { data } = await axios.get(`/data${siteCode ? "/site-code/" + siteCode : ""}`)
        setDataArr(data)
    }
    useEffect(() => {
        fetchData()
    }, [])
    const plateNumberBody = (product: DataItem) => {
        return <>
            <HtmlTooltip
                title={
                    <>
                        <div className=''>
                            <span className="text-xl text-black">(Blue Toyota)</span>
                            {/* TODO: Remove */}
                            <img src={`${import.meta.env.VITE_API_BACKEND_URL}public/${product.vehicle}`} />
                        </div>
                    </>
                }
            >
                <img src={`${import.meta.env.VITE_API_BACKEND_URL}public/${product.plate}`} />
            </HtmlTooltip>
        </>;
    };
    const vehicleBody = (product: DataItem) => {
        return <>

            <HtmlTooltip
                title={
                    <>
                        <div className=''>
                            <span className="text-xl text-black">(Blue Toyota)</span>
                            {/* TODO: Remove */}
                            <img src={`${import.meta.env.VITE_API_BACKEND_URL}public/${product.vehicle}`} />
                        </div>
                    </>
                }
            >
                <span className={`underline text-blue-500 cursor-pointer`}> (Blue Toyota) </span>
            </HtmlTooltip>
        </>;
    };
    return (
        <div className="p-2 bg-white rounded-lg w-full">
            <h1 className='font-bold p-2 text-lg'>Sessions & Violations</h1>
            <div className='flex max-md:flex-col justify-between items-center'>
                <div className='flex p-2 gap-2'>
                    <Button color='green'>Sessions</Button>
                    <Button color='rose'>Violations</Button>
                    {user?.customClaims.admin && <Button color='blue'>Error</Button>}
                </div>
                <div className='flex gap-2 items-center'>
                    <div className='p-2 rounded-md bg-blue-700 flex justify-center items-center w-fit cursor-pointer hover:opacity-80'>
                        <svg className='w-4 h-4 fill-white'><use href="#svg-refresh" /></svg>
                    </div>
                    <div className='px-3 py-1 border border-[#ccc] rounded-md text-sm'>5115 Records</div>
                </div>
            </div>
            <DataTable
                paginator rows={5} pageLinkSize={2} rowsPerPageOptions={[5, 10, 25, 50]} 
                value={dataArr} tableStyle={{ minWidth: '50rem' }} pt={{
                    thead: { className: "text-[14px]" },
                    paginator: {
                        pageButton: ({ context }: { context: any }) => ({
                            className: context.active ? 'bg-blue-500 text-white text-[12px]' : undefined,
                        }),
                    },
                }} >
                <Column field="lot" header="Lot name" sortable style={{ width: '10%' }}></Column>
                <Column field="camera" header="Camera" sortable style={{ width: '10%' }}></Column>
                <Column field="plateNumber" header="Plate number" sortable style={{ width: '10%' }}></Column>
                <Column field="plate" header="" body={plateNumberBody} style={{ width: '10%' }}></Column>
                <Column field="vehicle" header="Vehicle" body={vehicleBody} sortable style={{ width: '20%' }}></Column>
                <Column field="direction" header="Direction" body={
                    (item: DataItem) => <span className={`pi ${item.direction.trim().toLowerCase() === "enter" ? "pi-arrow-up-right" : "pi-arrow-down-left"}`}></span>
                } sortable style={{ width: '10%' }}></Column>
                <Column header="Entry" body={(item: DataItem) =>
                    <>
                        {item.direction.trim().toLowerCase() === "enter" &&
                            <span>{new Date(item.time).toLocaleString("en-us")}</span>}
                    </>
                } sortable style={{ width: '15%' }}></Column>
                <Column header="Exit" body={(item: DataItem) =>
                    <>
                        {item.direction.trim().toLowerCase() !== "enter" &&
                            <span>{new Date(item.time).toLocaleString("en-us")}</span>}
                    </>
                } sortable style={{ width: '15%' }}></Column>
            </DataTable>
        </div >
    );
}

