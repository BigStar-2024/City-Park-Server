
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import { Calendar } from 'primereact/calendar';
import '../style/calendar.css'
import '../style/pie.css'
import RangeSelector from "./RangeSelector";
import axios from "axios";
export default function MyCalendar({ siteCode }: { siteCode: string }) {
    const [ranges, setRanges] = useState<{
        start: Date;
        end: Date;
    }[]>([])
    const ref_save = useRef(false)
    const fetchDates = async () => {
        if (!siteCode) return
        const { data: { dates } } = await axios.get(`/unenforcable-dates/site-code/${siteCode}`)
        if (!dates) return
        setRanges(dates.map((d: any) => ({
            start: new Date(d.start),
            end: new Date(d.end),
        })))
    }
    useEffect(() => {
        fetchDates()
    }, [])
    const doSave = () => {
        axios.post('/unenforcable-dates', {
            siteCode,
            dates: ranges
        })
        ref_save.current = false
    }
    useEffect(() => {
        if (ref_save.current) doSave()
    }, [ranges])
    const ref_zoomTo = useRef<(date: Date) => void>()
    return (
        <div className="w-full">
            <RangeSelector ranges={ranges} setRanges={setRanges} ref_zoomTo={ref_zoomTo} ref_save={ref_save} />
            <div className="w-full flex gap-4 flex-wrap justify-center">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((month, i) =>
                    <Calendar style={{ width: 400 }} key={i} inline
                        viewDate={new Date(2024, month, 1)}
                        onSelect={(e) => {
                            if (ref_zoomTo.current)
                                ref_zoomTo.current(new Date(e.value?.toString() || ""))
                        }}
                        dateTemplate={(date) => {
                            const this_date = new Date(date.year, date.month, date.day)
                            let total = 0
                            ranges.forEach(r => {
                                const st = Math.max(r.start.getTime(), this_date.getTime())
                                const en = Math.min(r.end.getTime(), this_date.getTime() + 24 * 60 * 60 * 1000)
                                if (en > st) total += (en - st)
                            })
                            if (total > 0) {
                                return (
                                    <div className={`pie animate?`} style={{ "--p": total / (24 * 60 * 60 * 10), "--c": "blue", "--b": "3px", "--w": "30px" } as any}>{date.day} </div>
                                    // <div className="flex justify-center items-center rounded-full w-8 h-8" >{date.day}</div>
                                );
                            }
                            else {
                                return date.day;
                            }
                        }}
                    />
                )}
            </div>

        </div>
    )
}