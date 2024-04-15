
// import { useEffect, useRef, useState } from 'react';
// import { DataTable } from 'primereact/datatable';
// import { Column } from 'primereact/column';
// import "primereact/resources/themes/lara-light-cyan/theme.css";
// import 'primeicons/primeicons.css';
// import { Checkbox, FormControlLabel } from '@mui/material';
// import axios from 'axios';
// import { DataItem } from '../types';
// import HtmlTooltip from './HtmlToolTip';

// export default function MyLotsTable() {

//     const [dataArr, setDataArr] = useState<DataItem[]>([]);
//     const timeoutRef = useRef<NodeJS.Timeout | null>(null)
//     const fetchData = async () => {
//         const { data } = await axios.get(`/data`)
//         setDataArr(data)
//         if (autoUpdate) {
//             timeoutRef.current = setTimeout(fetchData, 30000)
//         }
//     }
//     useEffect(() => {
//         fetchData()
//         return () => clearTimeout(timeoutRef.current || undefined)
//     }, [])
//     const plateNumberBody = (product: DataItem) => {
//         return <>
//             <HtmlTooltip
//                 title={
//                     <>
//                         <div className=''>
//                             <span className="text-xl text-black">(Blue Toyota)</span>
//                             {/* TODO: Remove */}
//                             <img src={`${import.meta.env.VITE_API_BACKEND_URL}public/${product.vehicle}`} />
//                         </div>
//                     </>
//                 }
//             >
//                 <img src={`${import.meta.env.VITE_API_BACKEND_URL}public/${product.plate}`} />
//             </HtmlTooltip>
//         </>;
//     };
//     const vehicleBody = (product: DataItem) => {
//         return <>

//             <HtmlTooltip
//                 title={
//                     <>
//                         <div className=''>
//                             <span className="text-xl text-black">(Blue Toyota)</span>
//                             {/* TODO: Remove */}
//                             <img src={`${import.meta.env.VITE_API_BACKEND_URL}public/${product.vehicle}`} />
//                         </div>
//                     </>
//                 }
//             >
//                 <span className={`underline text-blue-500 cursor-pointer`}> (Blue Toyota) </span>
//             </HtmlTooltip>
//         </>;
//     };
//     const [autoUpdate, setAutoUpdate] = useState(true);
//     return (
//         <div className="p-2 bg-white rounded-lg w-full">
//             <div className='flex justify-end items-center pr-10 py-2'>
//                 <div className='flex items-center rounded-md border border-[#ccc] text-xs overflow-visible'>
//                     <button className='p-2 border-r border-[#ccc] hover:bg-[#f8f8f8] rounded-tl-md rounded-bl-md'>&laquo;Newer</button>
//                     <button className='flex items-center p-2 border-r border-[#ccc] hover:bg-[#f8f8f8] relative group'>
//                         Options
//                         <svg className='w-3 h-3'><use href="#svg-arrow-down" /></svg>
//                         <div className='absolute top-8 -left-1 w-40 z-10 p-1 hidden group-hover:block'>
//                             <div className='bg-white rounded-md border border-[#ccc] shadow-lg pl-1'>
//                                 <FormControlLabel
//                                     control={
//                                         <Checkbox checked={autoUpdate} onChange={(e) => setAutoUpdate(e.target.checked)} sx={{ '& .MuiSvgIcon-root': { fontSize: 20 } }} />
//                                     }
//                                     label="Auto-Update"
//                                     sx={{
//                                         '& .MuiSvgIcon-root': { fontSize: 20 },
//                                         '& .MuiFormControlLabel-label': { fontSize: 14 },
//                                     }}
//                                 />
//                             </div>
//                         </div>
//                     </button>
//                     <button className='p-2 hover:bg-[#f8f8f8] rounded-tr-md rounded-br-md'>Older&raquo;</button>
//                 </div>
//                 <div className='p-2'><img className='w-4 h-4 loading-icon' src='/loading.png' /></div>
//             </div>
//             <DataTable
//                 // paginator rows={5} pageLinkSize={2} rowsPerPageOptions={[1, 10, 25, 50]}
//                 value={dataArr} tableStyle={{ minWidth: '50rem' }}>
//                 <Column field="lot" header="Lot name" sortable style={{ width: '10%' }}></Column>
//                 <Column field="camera" header="Camera" sortable style={{ width: '10%' }}></Column>
//                 <Column field="plateNumber" header="Plate number" sortable style={{ width: '10%' }}></Column>
//                 <Column field="plate" header="" body={plateNumberBody} style={{ width: '10%' }}></Column>
//                 <Column field="vehicle" header="Vehicle" body={vehicleBody} sortable style={{ width: '20%' }}></Column>
//                 <Column field="direction" header="Direction" body={
//                     (item: DataItem) => <span className={`pi ${item.direction.trim().toLowerCase() === "enter" ? "pi-arrow-up-right" : "pi-arrow-down-left"}`}></span>
//                 } sortable style={{ width: '10%' }}></Column>
//                 <Column header="Entry" body={(item: DataItem) =>
//                     <>
//                         {item.direction.trim().toLowerCase() === "enter" &&
//                             <span>{new Date(item.time).toLocaleString("en-us")}</span>}
//                     </>
//                 } sortable style={{ width: '15%' }}></Column>
//                 <Column header="Exit" body={(item: DataItem) =>
//                     <>
//                         {item.direction.trim().toLowerCase() !== "enter" &&
//                             <span>{new Date(item.time).toLocaleString("en-us")}</span>}
//                     </>
//                 } sortable style={{ width: '15%' }}></Column>
//             </DataTable>
//         </div>
//     );
// }




import { useEffect, useRef, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import 'primeicons/primeicons.css';
// import { Checkbox, FormControlLabel } from '@mui/material';
import axios from 'axios';
import { DataItem, ConsolidatedRecord } from '../types';
import HtmlTooltip from './HtmlToolTip';

export default function MyLotsTable() {
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
                    vehicle: item.vehicle, // Initial vehicle from the entry event
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
                    lastEntry.vehicle = item.vehicle; // Update vehicle to exit event's vehicle
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
        const { data } = await axios.get<DataItem[]>(`/data`);
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
        <HtmlTooltip title={<div><span className="text-xl text-black">(Blue Toyota)</span><img src={`${import.meta.env.VITE_API_BACKEND_URL}public/${product.vehicle}`} /></div>}>
            <img src={`${import.meta.env.VITE_API_BACKEND_URL}public/${product.plate}`} />
        </HtmlTooltip>
    );
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
        </div>
    );
}


