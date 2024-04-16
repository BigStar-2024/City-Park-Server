import { useEffect, useRef, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import 'primeicons/primeicons.css';
import axios from 'axios';
import { DataItem, ConsolidatedRecord } from '../types';
import HtmlTooltip from './HtmlToolTip'; 
// import { useAppDispatch } from "../redux/hooks" 

export default function MyLotsTable() { 
    // const dispatch = useAppDispatch();
    const [dataArr, setDataArr] = useState<ConsolidatedRecord[]>([]);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const parking_session_count: number[] = [];

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
        const { data } = await axios.get<DataItem[]>(`/data`);
        const consolidatedData = consolidateData(data);
        setDataArr(consolidatedData);
            timeoutRef.current = setTimeout(fetchData, 30000);
    };

    useEffect(() => {
        fetchData();
        return () => clearTimeout(timeoutRef.current || undefined);
    }, []);
// -----------------------------------------------Parking Session numbers of every month-------------------
    useEffect(() => {
        const countEntriesByMonth = () => {
          const countsByMonth: { [key: number]: number } = {};
          
          dataArr.forEach(entry => {
            if (entry.entryTime) {
              const time = new Date(entry.entryTime);
              const month = time.getMonth();
              if (countsByMonth[month] === undefined) {
                countsByMonth[month] = 1;
              } else {
                countsByMonth[month]++;
              }
            }
          });
      
          for (let i = 0; i < 12; i++) {
            parking_session_count.push(countsByMonth[i] || 0);
          }
        };
        countEntriesByMonth();
        // dispatch({
        //     type: 'passion_number',
        //     payload: [parking_session_count]
        // });

        // console.log(parking_session_count);
        
      }, [dataArr]);
// -----------------------------------------------------------------------------------------
    
    

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





    
  
    
  
 


