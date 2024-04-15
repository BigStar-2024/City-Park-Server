import { Outlet } from "react-router-dom"
import SideBar from "../components/SideBar"
import Header from "../components/Header"
import Footer from "../components/Footer"
import { useAuthorize } from "../store/store"

const AuthLayout = () => {
    const { user } = useAuthorize()
    return (
        <>
            <Header />
            <div className="w-full h-fit flex bg-[#eee] pt-[90px]">
                <SideBar />
                <div className="w-full flex flex-col gap-4 min-h-screen px-8 py-4 transition-all ease-in-out overflow-hidden">
                    <div className="w-full p-6 bg-[#22cbad] text-white rounded-md">
                        <p className="text-[20px]">Hi {user?.displayName}</p>
                        <p className="text-[40px]">Good morning</p>
                    </div>
                    <Outlet />
                </div>
            </div>
            <Footer />
        </>
    )
}
export default AuthLayout