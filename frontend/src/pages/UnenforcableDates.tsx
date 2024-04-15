
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import MyCalendar from "../components/MyCalendar";
import axios from "axios";
import { Dropdown } from "primereact/dropdown";

const UnenforcableDates = () => {
    const [lots, setLots] = useState([])
    const fetchLot = async () => {
        const { data } = await axios.get(`/lot`);
        setLots(data)
    }
    useEffect(() => {
        fetchLot()
    }, [])
    const [selectedLot, setSelectedLot] = useState<any>();
    return (
        <>
            <Dropdown pt={{ root: { className: 'border border-black' }, }} value={selectedLot} onChange={(e) => setSelectedLot(e.value)} options={lots} optionLabel="siteCode"
                placeholder="Select a lot" className="w-full md:w-14rem" />
            {selectedLot && <MyCalendar key={selectedLot.siteCode} siteCode={selectedLot.siteCode} />}
        </>
    )
}
export default UnenforcableDates