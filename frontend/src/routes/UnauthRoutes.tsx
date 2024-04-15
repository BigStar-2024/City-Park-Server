import { Navigate, Route, Routes } from "react-router-dom"
import UnauthLayout from "../layout/UnauthLayout"
import Login from "../pages/Login"
import LoginSuccess from "../pages/LoginSuccess"
import VerifyEmail from "../pages/VerifyEmail"

const UnauthRoutes = () => {
    return (
        <Routes>
            <Route path="city-park-lot" element={<UnauthLayout />} >
                <Route index element={<Navigate to="/city-park-lot/login" replace={true} />} />
                <Route path="success" element={<LoginSuccess />} />
                <Route path="please-verify-mail" element={<VerifyEmail />} />
                <Route path="login" element={<Login />} />
                <Route path="*" element={<Navigate to="/city-park-lot/login" replace={true} />} />
            </Route>
        </Routes>
    )
}
export default UnauthRoutes