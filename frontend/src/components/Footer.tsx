import { Link } from "react-router-dom"

const Footer = () => {
    return (
        <div className="w-full bg-[#22cbad] py-20 pb-0 text-white text-xl font-bold">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-[1300px] mx-auto">
                <img className="max-w-[280px]" src="https://cityparkmanagement.com/wp-content/uploads/2024/01/Red-Vintage-Car-Showroom-Logo-1.png" />
                <div className="flex flex-col gap-4 w-full px-4">
                    <h1 className="text-2xl">Navigation</h1> <div></div>
                    <Link to="/city-park-lot"><span>Home</span></Link>
                    <Link to="/city-park-lot"><span>About us</span></Link>
                    <Link to="/city-park-lot"><span>What we do</span></Link>
                    <Link to="/city-park-lot"><span>Contact us</span></Link>
                </div>
                <div className="flex flex-col gap-8 w-full px-4">
                    <h1 className="text-2xl">Contact Information</h1> <div></div>
                    <div className="flex items-center gap-4">
                        <svg className="w-6 h-6 fill-white"><use href="#svg-email" /></svg>
                        <span>info@cityparkmanagement.com</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <svg className="w-6 h-6 fill-white"><use href="#svg-facebook" /></svg>
                        <svg className="w-6 h-6 fill-white"><use href="#svg-twitter" /></svg>
                        <svg className="w-6 h-6 fill-white"><use href="#svg-instagram" /></svg>
                    </div>
                </div>
            </div>
            <div className="w-full text-center p-10">©2024 – City Park Management</div>
        </div>
    )
}
export default Footer