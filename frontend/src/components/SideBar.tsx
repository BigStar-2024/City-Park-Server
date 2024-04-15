import { Link, useLocation } from "react-router-dom"
import { useAuthorize, useSideBarOpen } from "../store/store"
import { useState } from "react";

const SideBarItem = ({ href, svg, title }: { href?: string, svg: string, title: string }) => {
    const location = useLocation();
    const active = location.pathname === href
    return (
        <Link to={href ?? "/"}>
            <div className={`w-full p-4 rounded-md flex items-center gap-4 cursor-pointer opacity-80 hover:opacity-100 transition-all ease-in-out ${active ? "bg-[#22cbad] shadow-[0_3px_10px_2px_#44444488] text-white" : "hover:bg-[#f8f8f8]"}`}>
                <svg className={`w-6 h-6 ${active ? "fill-white" : "fill-[#444]"}`}><use href={svg} /></svg>
                <span>{title}</span>
            </div>
        </Link>
    )
}
const SideBar = () => {
    const { user } = useAuthorize()
    const { sideBarOpen } = useSideBarOpen()
    const [collapse, setCollapse] = useState(true)

    return (
        <div className="max-md:hidden w-[300px] min-w-[300px] p-4 shadow-[0_0_2px_2px_#8888] bg-white transition-all ease-in-out" style={{ marginLeft: sideBarOpen ? 0 : -300 }}>
            <div onClick={() => setCollapse(v => !v)} className="flex flex-col gap-2 w-full border-b border-[#eee] transition-all ease-in-out duration-500 overflow-hidden" style={{ height: collapse ? 80 : 140 }}>
                <div className="flex justify-between items-center w-fullcursor-pointer p-2 cursor-pointer">
                    <div className="flex items-center gap-2">
                        <img className="w-10 rounded-full" src="https://acorn-react-classic-dashboard.coloredstrategies.com/img/profile/profile-9.webp" />
                        <div className="">
                            <p className="text-[#888]">{user?.displayName || user?.email}</p>
                            <p className="text-xs font-bold">{user?.displayName ? user?.email : "signed in"}</p>
                        </div>
                    </div>
                    <svg className="w-4 h-4 fill-black/60"><use href="#svg-arrow-down" /></svg>
                </div>
                <div className="w-full pl-10 text-xs">
                    <SideBarItem href="/city-park-lot/logout" svg="#svg-logout" title="Logout" />
                </div>
            </div>
            <div className="flex flex-col gap-4 w-full py-6 text-[#444]">
                <SideBarItem href="/city-park-lot/dashboard" svg="#svg-graph" title="Dashboard" />
                {user?.customClaims.admin && <SideBarItem href="/city-park-lot/manage-user" svg="#svg-graph" title="User Management" />}
                <SideBarItem href="/city-park-lot/my-lots" svg="#svg-park" title="My Lots" />
                {user?.customClaims.admin && <SideBarItem href="/city-park-lot/parking-sessions" svg="#svg-car" title="Parking Sessions" />}
                {user?.customClaims.admin && <SideBarItem href="/city-park-lot/permits" svg="#svg-todo" title="Permits" />}
                {user?.customClaims.admin && <SideBarItem href="/city-park-lot/unenforcable-dates" svg="#svg-calendar" title="Unenforcable Dates" />}
            </div>
        </div>
    )
}
export default SideBar