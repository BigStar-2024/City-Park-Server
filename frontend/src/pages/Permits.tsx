import { ChangeEvent, useState } from "react";
import PermitsTable from "../components/PermitsTable"
import { PermitType } from "../types";
import { useAuthorize } from "../store/store";

const Permits = () => {
    const { user } = useAuthorize()
    const [product, setProduct] = useState<PermitType>({
        id: "0",
        name: "",
        reason: "",
        plate: ""
    })
    const [products, setProducts] = useState<PermitType[]>([
        {
            id: '1',
            name: 'Jack',
            reason: 'For ***',
            plate: "CGNY64",
        },
        {
            id: '2',
            name: 'James',
            reason: 'For ***',
            plate: "YGNY64",
        },
    ]);
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setProduct(v => ({ ...v, [e.target.name]: e.target.value }))
    }
    const handleAdd = () => {
        if (product.name.trim() === "") return
        if (product.reason.trim() === "") return
        if (product.plate.trim() === "") return
        setProducts(v => [...v, product])
        setProduct(v => ({
            id: `${parseInt(v.id) + 1}`,
            name: "",
            reason: "",
            plate: ""
        }))
    }
    return (
        <>
            {
                user?.customClaims.admin &&
                <div className="flex max-md:flex-col max-md:rounded-md flex-row items-center justify-between w-full max-w-[600px] mx-auto rounded-full border border-[#ccc] overflow-hidden">
                    <div className="max-md:w-full grow h-full border-r border-[#ccc]"><input onChange={handleChange} name="name" value={product.name} placeholder="Name" className="w-full h-full px-4 py-2 outline-none" /></div>
                    <div className="max-md:w-full grow h-full border-r border-[#ccc]"><input onChange={handleChange} value={product.reason} name="reason" placeholder="Reason" className="w-full h-full px-4 py-2 outline-none" /></div>
                    <div className="max-md:w-full grow h-full"><input onChange={handleChange} value={product.plate} name="plate" placeholder="Plate number" className="w-full h-full px-4 py-2 outline-none" /></div>
                    <button onClick={handleAdd} className="max-md:w-full px-8 py-4 bg-blue-500 text-white text-sm hover:opacity-80 transition-all ease-in-out">Add</button>
                </div>
            }
            <PermitsTable products={products} />
        </>
    )
}
export default Permits