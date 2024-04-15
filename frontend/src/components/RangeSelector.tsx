/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dispatch, MutableRefObject, SetStateAction, useEffect, useRef, useState } from "react";
import * as d3 from 'd3'
import { confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { useAuthorize } from "../store/store";
type RangeDateType = {
    start: Date;
    end: Date;
}
const GrabberItem = ({ side }: { side: "left" | "right" }) => {
    return (
        <div className="absolute w-[9px] h-2/5 px-[3px] py-1 bg-white rounded-full shadow-[0_0_2px_2px_#8888] top-[50%]" style={{ [side]: 0, transform: `translate(${side === "left" ? "-50%" : "50%"}, -50%)` }}>
            <div className="w-full h-full rounded-full bg-[#62cb66]" />
        </div>
    )
}
const Grabber = () => {
    return (
        <>
            <GrabberItem side="left" />
            <GrabberItem side="right" />
        </>
    )
}
const RangeItem = ({ range, zoomEnabled, editing }: { range: { start: number; end: number }, zoomEnabled: boolean, editing?: boolean }) => {
    return (
        <div className={`h-full border-x pointer-events-none select-none ${editing ? "border-[#cf6262] bg-[#aa505080]" : "border-[#62cb66] bg-[#62cb6680]"}  absolute group`} style={{
            left: `${range.start}px`,
            width: `${range.end - range.start}px`,
        }}>
            {!zoomEnabled && <Grabber />}
        </div>
    )
}
const RangeSelector = ({ ranges, setRanges, ref_zoomTo, ref_save }:
    {
        ranges: RangeDateType[],
        setRanges: Dispatch<SetStateAction<RangeDateType[]>>,
        ref_zoomTo: MutableRefObject<((date: Date) => void) | undefined>,
        ref_save: MutableRefObject<boolean>
    }) => {
    const { user } = useAuthorize()
    const toast = useRef<Toast>(null);
    const removeRange = useRef<{
        start: Date,
        end: Date
    }>()
    const accept = () => {
        ref_save.current = true
        setRanges(v => v.filter(r => r !== removeRange.current))
        toast.current?.show({ severity: 'info', summary: 'Confirmed', detail: 'Successfully removed', life: 3000 });
    }

    const reject = () => {
        removeRange.current = undefined
        toast.current?.show({ severity: 'warn', summary: 'Rejected', detail: 'Remove Canceled', life: 3000 });
    }
    const showConfirmDialog = () => {
        confirmDialog({
            message: 'Are you sure you want to delete?',
            header: 'Confirmation',
            icon: 'pi pi-info-circle',
            defaultFocus: 'accept',
            accept,
            reject
        });
    };


    const [indicatorX, setIndicatorX] = useState(-1)
    const [grab, setGrab] = useState<"LEFT" | "RIGHT">("LEFT")
    const ref_grab = useRef(grab)
    useEffect(() => {
        ref_grab.current = grab;
    }, [grab]);
    const ref_wrapper = useRef<HTMLDivElement>(null)
    const ref_axis_wrapper = useRef<HTMLDivElement>(null)
    const ref_ranges = useRef(ranges)
    useEffect(() => {
        ref_ranges.current = ranges;
    }, [ranges]);
    const [editingRange, setEditingRange] = useState<{ start: Date; end: Date; }>()
    const ref_editingRange = useRef(editingRange);
    useEffect(() => {
        ref_editingRange.current = editingRange;
    }, [editingRange]);
    const scale = useRef(d3.scaleLinear())
    const zoomedScale = useRef(d3.scaleLinear())
    const w_wrapper = useRef(1000)
    const ref_gX = useRef<d3.Selection<SVGGElement, unknown, null, undefined>>()
    const [scaledRanges, setScaledRanges] = useState<{ start: number; end: number }[]>([])
    const [zoomEnabled, setZoomEnabled] = useState(false)
    const ref_zoomEnabled = useRef<boolean>()
    useEffect(() => {
        ref_zoomEnabled.current = zoomEnabled;
    }, [zoomEnabled]);

    const ref_mouseDown = useRef(false)

    const convert2NumberRange = (v: { start: Date; end: Date; }) => ({ start: zoomedScale.current(v.start), end: zoomedScale.current(v.end) })

    const zoomHandler = (event: any) => {
        zoomedScale.current = event.transform.rescaleX(scale.current);
        setScaledRanges(ref_ranges.current.map(v => convert2NumberRange(v)))
        // console.log(d3.ticks(zoomedScale.current.invert(0), zoomedScale.current.invert(1000), 20).map(v => format(new Date(v), "dd MMM, HH:mm")).join("\n"))

        const time_scale = d3.scaleTime()
            .domain([new Date(zoomedScale.current.invert(0)), new Date(zoomedScale.current.invert(w_wrapper.current))]) // This would be your start and end dates
            .rangeRound([0, w_wrapper.current]);
        // const ticks = time_scale.ticks(10); // TODO: ticks
        // console.log(ticks.join("\n"))
        ref_gX.current?.call(d3.axisBottom(time_scale))
    }
    const zoom = d3.zoom()
        .scaleExtent([0.5, 3000])
        .on("zoom", zoomHandler)
    const enableZoom = () => {
        if (zoomEnabled) return
        d3.select(ref_wrapper.current as Element).call(zoom).on("touchmove.zoom", null);
        setZoomEnabled(true)
    }
    const disableZoom = () => {
        if (!zoomEnabled) return
        if (!user?.customClaims.admin) return
        d3.select(ref_wrapper.current as Element).on(".zoom", null);
        setZoomEnabled(false)
    }
    const zoomTo = (date: Date) => {
        const year = date.getFullYear()
        const month = date.getMonth()
        const day = date.getDate()
        const elapsedDays = (new Date(year, month, day).getTime() - new Date(new Date().getFullYear(), 0, 1).getTime()) / (24 * 60 * 60 * 1000)
        const isLeapYear = (year % 4 == 0 && year % 100 != 0) || year % 400 == 0
        d3.select(ref_wrapper.current as Element).transition()
            .duration(750)
            .call(zoom.transform, d3.zoomIdentity.translate(-w_wrapper.current * elapsedDays, 0).scale(isLeapYear ? 366 : 365));
    }
    useEffect(() => {
        setScaledRanges(ranges.map(v => convert2NumberRange(v)))
    }, [ranges])
    useEffect(() => {
        ref_zoomTo.current = zoomTo
        if (ref_wrapper.current && ref_axis_wrapper.current) {
            // ref_wrapper.current.addEventListener("mousewheel", MouseWheelHandler, false);
            // ref_wrapper.current.addEventListener("DOMMouseScroll", MouseWheelHandler, false);
            w_wrapper.current = ref_axis_wrapper.current.clientWidth
            const ini_scale = d3.scaleLinear()
                .domain([new Date(new Date().getFullYear(), 0, 1), new Date(new Date().getFullYear() + 1, 0, 1)])
                .range([0, w_wrapper.current])
            scale.current = zoomedScale.current = ini_scale
            setScaledRanges(ranges.map(v => convert2NumberRange(v)))
            const tick_svg = d3.select(ref_axis_wrapper.current)
                .append("svg")
                .attr("width", ref_axis_wrapper.current.clientWidth)
                .attr("height", ref_axis_wrapper.current.clientHeight);
            const time_scale = d3.scaleTime()
                .domain([new Date(2024, 0, 1), new Date(2024, 11, 31)]) // This would be your start and end dates
                .rangeRound([0, w_wrapper.current]);
            ref_gX.current = tick_svg.append("g")
                .attr("transform", "translate(0," + ref_axis_wrapper.current.clientHeight / 2 * 0 + ")");
            ref_gX.current.call(d3.axisBottom(time_scale));
            enableZoom()


            d3.select(ref_wrapper.current as Element)
                .on("dblclick", function (event) {
                    if (ref_zoomEnabled.current) return
                    const coordinates = d3.pointer(event);
                    const curTime = new Date(zoomedScale.current.invert(coordinates[0]))
                    const hoverRange = ref_ranges.current.find(r => r.start < curTime && curTime < r.end)
                    if (hoverRange) {
                        removeRange.current = hoverRange
                        showConfirmDialog()
                    }
                })
                .on("mousemove", function (event) {
                    const coordinates = d3.pointer(event);
                    // const timeFormat = d3.timeFormat("%Y-%m-%d %H:%M"); // ! current hover time now
                    // console.log(timeFormat(new Date(zoomedScale.current.invert(coordinates[0])))); // ! current hover time now
                    setIndicatorX(coordinates[0])
                    if (!ref_zoomEnabled.current && ref_mouseDown.current) {
                        const indicating_val = new Date(zoomedScale.current.invert(coordinates[0]))
                        const hoverRange = ref_ranges.current.find(r => r.start < indicating_val && indicating_val < r.end)
                        if (hoverRange) return
                        setEditingRange(v => {
                            if (!v) return v
                            if (ref_grab.current === "LEFT") {
                                if (ref_ranges.current.find(r => indicating_val < r.start && r.end < v.end)) return v
                                return {
                                    start: indicating_val,
                                    end: v.end.getTime() - indicating_val.getTime() < 30 * 60_000 ? new Date(indicating_val.getTime() + 30 * 60_000) : v.end
                                }
                            } else {
                                if (ref_ranges.current.find(r => v.start < r.start && r.end < indicating_val)) return v
                                return {
                                    start: v.end.getTime() > indicating_val.getTime() ?
                                        indicating_val.getTime() - v.start.getTime() < 30 * 60_000 ? new Date(indicating_val.getTime() - 30 * 60_000) : v.start :
                                        v.start,
                                    end: indicating_val,
                                }
                            }
                        })
                    }
                }).on("mouseout", function (event) {
                    setIndicatorX(-1)
                    if (ref_mouseDown.current && !ref_zoomEnabled.current)
                        ref_wrapper.current?.dispatchEvent(new MouseEvent('mouseup', event));
                }).on("mousedown", function (event) {
                    ref_mouseDown.current = true
                    if (ref_zoomEnabled.current) return
                    const coordinates = d3.pointer(event);
                    const curTime = new Date(zoomedScale.current.invert(coordinates[0]))
                    const hoverRange = ref_ranges.current.find(r => r.start < curTime && curTime < r.end)
                    if (hoverRange) {
                        // console.log("Down IN")
                        setRanges(v => v.filter(r => r !== hoverRange))
                        setGrab(curTime.getTime() - hoverRange.start.getTime() < hoverRange.end.getTime() - curTime.getTime() ? "LEFT" : "RIGHT")
                        setEditingRange(hoverRange)
                    } else {
                        setGrab("RIGHT")
                        setEditingRange({ start: curTime, end: curTime })
                        // console.log("Down OUT")
                    }
                }).on("mouseup", function () {
                    ref_mouseDown.current = false
                    if (ref_zoomEnabled.current) return
                    // const coordinates = d3.pointer(event);
                    // const curTime = new Date(zoomedScale.current.invert(coordinates[0]))
                    // const hoverRange = ranges.find(r => r.start < curTime && curTime < r.end)
                    // if (hoverRange) {
                    //     console.log("Up IN")
                    // } else {
                    //     console.log("Up OUT")
                    // }
                    if (ref_editingRange.current) {
                        const vv = ref_editingRange.current
                        ref_save.current = true
                        if (vv.end.getTime() - vv.start.getTime() <= 30 * 60_000) {
                            vv.end = new Date((vv.start.getTime() + 30 * 60_000))
                        }
                        setRanges(v => [...v, vv])
                        setEditingRange(undefined)
                    }
                })
        }
    }, [ref_wrapper, ref_axis_wrapper])
    // const MouseWheelHandler = (e: any) => {
    //     const delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
    //     e.preventDefault();
    //     e.stopPropagation();
    //     return false;
    // }

    return (
        <>

            <h1 className="w-full text-2xl font-bold text-center p-4">
                <span>{d3.timeFormat("%Y-%m-%d")(new Date(zoomedScale.current.invert(0)))}</span>
                <small> To </small>
                <span>{d3.timeFormat("%Y-%m-%d")(new Date(zoomedScale.current.invert(ref_wrapper.current?.clientWidth || 0)))}</span>
            </h1>
            <div className="w-full">
                <div className="w-fit flex items-center border border-black mb-3">
                    <button className={`p-1 ${zoomEnabled ? "bg-[#3b2dff] text-white" : ""} hover:scale-[1.2]`} onClick={enableZoom}>
                        <svg className="w-4 h-4 fill-current"><use href="#svg-move" /></svg>
                    </button>
                    <button disabled={!user?.customClaims.admin} className={`p-1 ${zoomEnabled ? "" : "bg-[#3b2dff] text-white"} hover:scale-[1.2] disabled:cursor-not-allowed disabled:opacity-30`} onClick={disableZoom}>
                        <svg className="w-4 h-4 fill-current"><use href="#svg-edit" /></svg>
                    </button>
                </div>
                <div className="relative">
                    <div ref={ref_wrapper} className={`w-full relative h-[50px] border border-black/10 ${zoomEnabled ? "cursor-move" : "cursor-pointer"} overflow-hidden`}>
                        {
                            scaledRanges.map((range, i) =>
                                <RangeItem key={i} range={range} zoomEnabled={zoomEnabled} />
                            )
                        }
                        {
                            editingRange && <RangeItem range={convert2NumberRange(editingRange)} zoomEnabled={false} editing />
                        }
                    </div>
                    <div className={`w-[1px] h-full bg-black absolute top-0 select-none pointer-events-none ${indicatorX < 0 ? "hidden" : ""}`} style={{ left: indicatorX }} />
                    <div className={`w-fit whitespace-nowrap select-none pointer-events-none absolute top-0 -translate-x-[50%] -translate-y-[100%] text-[10px] ${indicatorX < 0 ? "hidden" : ""}`} style={{ left: indicatorX }}>
                        {d3.timeFormat("%Y-%m-%d %H:%M")(new Date(zoomedScale.current.invert(indicatorX)))}
                    </div>
                </div>
                <div ref={ref_axis_wrapper} className="w-full h-[50px] relative pointer-events-none-all" />
            </div>
            <Toast ref={toast} />
        </>
    )
}
export default RangeSelector