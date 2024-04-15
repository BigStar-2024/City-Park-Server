import { useEffect } from "react"
import { useAuthorize } from "../store/store"

const Logout = () => {
    const { logout } = useAuthorize()
    useEffect(() => { logout() }, [])
    return (<></>)
}
export default Logout