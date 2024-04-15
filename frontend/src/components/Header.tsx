import { Link } from "react-router-dom"
import { useSideBarOpen } from "../store/store"

const Header = () => {
    const { setSideBarOpen } = useSideBarOpen()
    return (
        <div className="w-full h-[90px] py-2 flex justify-between items-center bg-[#22cbad] shadow-[0_0_2px_2px_#8888] absolute top-0">
            <div className="flex justify-between items-center">
                <div className="flex flex-row-reverse justify-end md:flex-row md:justify-between gap-4 items-center md:w-[300px] px-6">
                    <Link to="/city-park-lot">
                        <div><img className="min-w-20 w-28" src="https://cityparkmanagement.com/wp-content/uploads/2024/01/Red-Vintage-Car-Showroom-Logo-1.png" /></div>
                    </Link>
                    <button onClick={() => setSideBarOpen(v => !v)} className="hover:opacity-80 transition-all ease-in-out"><svg className="w-6 h-6 text-white"><use href="#svg-three-mobile" /></svg></button>
                </div>
                <div className="max-sm:hidden grow flex items-center pl-4">
                    <div className="relative">
                        <input className="lg:w-[400px] h-12 rounded-md bg-black/20 text-white placeholder:text-white pl-16 outline-none" placeholder="Search..." />
                        <svg className="w-6 h-6 absolute top-3 left-4 fill-white"><use href="#svg-search" /></svg>
                    </div>
                </div>
            </div>
            <div className="flex gap-6 items-center px-4 cursor-pointer">
                <svg className="w-6 h-6 fill-white max-sm:hidden"><use href="#svg-email" /></svg>
                <svg className="w-6 h-6 fill-white max-sm:hidden"><use href="#svg-ring" /></svg>
                <img className="w-10 min-w-10 h-10 rounded-full" src="https://acorn-react-classic-dashboard.coloredstrategies.com/img/profile/profile-9.webp" />
            </div>
        </div>
    )
}
export default Header