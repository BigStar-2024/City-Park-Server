
import { useEffect, useRef, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from '@tremor/react';
import HtmlTooltip from './HtmlToolTip';
import axios from 'axios';
import { useAuthorize } from '../store/store';
import { DataItem, ConsolidatedRecord } from '../types';


/* eslint-disable @typescript-eslint/no-explicit-any */

export default function ParkingSessionTable({ siteCode }: { siteCode?: string }) {
    const { user } = useAuthorize()
    // const [dataArr, setDataArr] = useState<DataItem[]>([]);
    // const fetchData = async () => {
    //     const { data } = await axios.get(`/data${siteCode ? "/site-code/" + siteCode : ""}`)
    //     setDataArr(data)
    // }
    // useEffect(() => {
    //     fetchData()
    // }, [])
    const [dataArr, setDataArr] = useState<ConsolidatedRecord[]>([]);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    // const [autoUpdate, setAutoUpdate] = useState(true);

    // const consolidateData = (rawData: DataItem[]): ConsolidatedRecord[] => {
    //     const recordMap = new Map<string, ConsolidatedRecord[]>();
    
    //     // Sort to ensure chronological order for correct processing
    //     rawData.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
    
    //     rawData.forEach(item => {
    //         if (!item.time) return; // Skip processing if time is undefined
    
    //         let records = recordMap.get(item.plateNumber) || [];
    //         if (item.direction === "ENTER") {
    //             records.push({
    //                 _id: item._id, // Initial _id from the entry event
    //                 lot: item.lot,
    //                 camera: item.camera, // Initial camera from the entry event
    //                 plateNumber: item.plateNumber,
    //                 plate: item.plate, // Initial plate from the entry event
    //                 vehicle: item.vehicle, // Initial vehicle from the entry event
    //                 direction: item.direction,
    //                 entryTime: item.time,
    //                 exitTime: undefined,
    //             });
    //         } else { // Direction is "EXIT"
    //             // Find the last entry without an exit and before this exit time
    //             const lastEntry = records.reverse().find(rec => rec.entryTime && !rec.exitTime && new Date(rec.entryTime) < new Date(item.time));
    //             if (lastEntry) {
    //                 lastEntry.exitTime = item.time;
    //                 lastEntry._id = item._id; // Update _id to exit event's _id
    //                 lastEntry.camera = item.camera; // Update camera to exit event's camera
    //                 lastEntry.plate = item.plate; // Update plate to exit event's plate
    //                 lastEntry.vehicle = item.vehicle; // Update vehicle to exit event's vehicle
    //             }
    //         }
    //         recordMap.set(item.plateNumber, records);
    //     });
    
    //     // Flatten the records and filter to only include completed pairs with exit times
    //     let allRecords = Array.from(recordMap.values()).flat().filter(rec => rec.exitTime);
    
    //     // Sort by exit time, asserting exitTime is defined
    //     allRecords.sort((a, b) => new Date(a.exitTime!).getTime() - new Date(b.exitTime!).getTime());
    
    //     return allRecords;
    // };

    const consolidateData = (rawData: DataItem[]): ConsolidatedRecord[] => {
        const recordMap = new Map<string, ConsolidatedRecord[]>();
    
        // Ensure all data items have defined times before processing
        const filteredData = rawData.filter(item => item.time !== undefined);
    
        // Sort to ensure chronological order for correct processing
        filteredData.sort((a, b) => new Date(a.time!).getTime() - new Date(b.time!).getTime());
    
        filteredData.forEach(item => {
            let records = recordMap.get(item.plateNumber) || [];
            if (item.direction === "ENTER") {
                records.push({
                    _id: item._id, // Initial _id from the entry event
                    lot: item.lot,
                    camera: item.camera, // Initial camera from the entry event
                    plateNumber: item.plateNumber,
                    plate: item.plate, // Initial plate from the entry event
                    vehicle1: item.vehicle, // Initial vehicle from the entry event
                    vehicle2: undefined, // Initial vehicle from the entry event
                    direction: item.direction,
                    entryTime: item.time!, // Asserting item.time is defined
                    exitTime: undefined,
                });
            } else { // Direction is "EXIT"
                // Find the last entry without an exit and before this exit time
                const lastEntry = records.reverse().find(rec => rec.entryTime && !rec.exitTime && new Date(rec.entryTime) < new Date(item.time!));
                if (lastEntry) {
                    lastEntry.exitTime = item.time!;
                    lastEntry._id = item._id; // Update _id to exit event's _id
                    lastEntry.camera = item.camera; // Update camera to exit event's camera
                    lastEntry.plate = item.plate; // Update plate to exit event's plate
                    lastEntry.vehicle2 = item.vehicle; // Update vehicle to exit event's vehicle
                }
            }
            recordMap.set(item.plateNumber, records);
        });
    
        // Flatten the records and sort by entry time, ensuring entryTime is defined
        let allRecords = Array.from(recordMap.values()).flat();
        allRecords.sort((a, b) => new Date(b.entryTime!).getTime() - new Date(a.entryTime!).getTime());
    
        return allRecords;
    };
    
    
    
    
    const fetchData = async () => {
        const { data } = await axios.get(`/data${siteCode ? "/site-code/" + siteCode : ""}`)
        const consolidatedData = consolidateData(data);
        setDataArr(consolidatedData);
        // if (autoUpdate) {
            timeoutRef.current = setTimeout(fetchData, 30000);
        // }
    };

    useEffect(() => {
        fetchData();
        return () => clearTimeout(timeoutRef.current || undefined);
    }, []);

    const plateNumberBody = (product: ConsolidatedRecord) => (
        <HtmlTooltip title={<div><span className="text-xl text-black">(Plate)</span><img src={`${import.meta.env.VITE_API_BACKEND_URL}public/${product.plate}`} /></div>}>
            <img src={`${import.meta.env.VITE_API_BACKEND_URL}public/${product.plate}`} />
        </HtmlTooltip>
    );
    const vehicleBody = (product: ConsolidatedRecord) => {
        return <>

            <HtmlTooltip
                title={
                    <>
                        <div className=''>
                            <span className="text-xl text-black">(Entrance)</span>
                            {/* TODO: Remove */}
                            <img src={`${import.meta.env.VITE_API_BACKEND_URL}public/${product.vehicle1}`} />
                        </div>
                        <div className=''>
                            <span className="text-xl text-black">(Exit)</span>
                            {/* TODO: Remove */}
                            <img src={`${import.meta.env.VITE_API_BACKEND_URL}public/${product.vehicle2}`} />
                        </div>
                    </>
                }
            >
                <span className={`underline text-blue-500 cursor-pointer`}> (Entrance Exit) </span>
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
            
            <DataTable paginator rows={25} pageLinkSize={2} rowsPerPageOptions={[5, 10, 25, 50]} 
                value={dataArr} tableStyle={{ minWidth: '50rem' }} pt={{
                    thead: { className: "text-[14px]" },
                    paginator: {
                        pageButton: ({ context }: { context: any }) => ({
                            className: context.active ? 'bg-blue-500 text-white text-[12px]' : undefined,
                        }),
                    },
                }}>
                <Column field="lot" header="Lot name" sortable style={{ width: '10%' }}></Column>
                <Column field="camera" header="Camera" sortable style={{ width: '10%' }}></Column>
                <Column field="plateNumber" header="Plate number" sortable style={{ width: '10%' }}></Column>
                <Column field="plate" header="" body={plateNumberBody} style={{ width: '10%' }}></Column>
                <Column field="vehicle" header="Vehicle" body={vehicleBody} sortable style={{ width: '20%' }}></Column>
                <Column header="Entry Time" body={(item: ConsolidatedRecord) =>
                    <>
                        {<span>{item.entryTime ? new Date(item.entryTime).toLocaleString("en-us") : ""}</span>}
                    </>
                } sortable style={{ width: '15%' }}></Column>
                <Column header="Exit Time" body={(item: ConsolidatedRecord) =>
                    <>
                        {<span>{item.exitTime ? new Date(item.exitTime).toLocaleString("en-us") : ""}</span>}
                    </>
                } sortable style={{ width: '15%' }}></Column>
            </DataTable>
        </div >
    );
}

