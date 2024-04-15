import { Button } from "@tremor/react"
import { Link } from "react-router-dom"

const VerifyEmail = () => {
    return (
        <div className="w-full max-w-[500px] mx-auto py-[200px]">
            <h1 className="text-2xl font-bold">Verification email sent</h1>
            <p>A verification email has been sent to your account. Please check your inbox and follow the instructions in the email to verify your account.</p>
            <Link to="/city-park-lot"><Button color="red">Go to Homepage</Button></Link>
        </div>
    )
}
export default VerifyEmail