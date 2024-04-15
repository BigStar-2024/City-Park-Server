import { toast } from "react-toastify";

export const showToast = (msg: string, success: boolean = false) => {
    const fn = success ? toast.info : toast.error
    fn(msg, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
    });
}