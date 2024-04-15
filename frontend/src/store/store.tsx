
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dispatch, SetStateAction, createContext, useContext, useEffect, useState } from "react"
import { User, onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../services/firebase";
import UnauthRoutes from "../routes/UnauthRoutes";
import { useNavigate } from "react-router-dom";
import axios from "axios";
type userPrimitiveType = User & {
    customClaims: {
        admin?: boolean,
    }
}
type StoreType = {
    sideBarOpen: boolean,
    setSideBarOpen: Dispatch<SetStateAction<boolean>>,
    user: userPrimitiveType | null,
    authorize: (loggedIn: boolean) => void,
    logout: () => void
}
const initStore: StoreType = {
    sideBarOpen: true,
    setSideBarOpen: () => { },
    user: null,
    authorize: () => { },
    logout: () => { }
}
const GlobalContext = createContext<StoreType>(initStore)
const StoreProvider = ({ children }: { children: JSX.Element }) => {
    const nav = useNavigate()
    const [user, setUser] = useState<userPrimitiveType | null>(null)
    const [sideBarOpen, setSideBarOpen] = useState(true)
    const [content, setContent] = useState(<></>);
    const handleAuthorize = async (user: User | null) => {
        if (user && user.emailVerified) {
            setUser({ ...user, customClaims: {} })
            console.log(user.email, user.emailVerified);
            user.getIdTokenResult()
                .then((idTokenResult) => {
                    // Custom claims are accessible in idTokenResult.claims
                    const { admin }: { admin: boolean } = idTokenResult.claims as { admin: boolean};
                    setUser(v => (v ? { ...v, customClaims: { admin} } : null))
                })
                .catch((error) => {
                    console.error("Error getting custom claims:", error);
                });
            await authorize(true)
        } else {
            console.log("No user is signed in");
            authorize(false)
            if (user && user.emailVerified) {
                nav('/city-park-lot/please-verify-mail')
            }
        }
    }
    useEffect(() => {
        const user = auth.currentUser;
        handleAuthorize(user)
        onAuthStateChanged(auth, handleAuthorize);
    }, [])
    const authorize = async (loggedIn: boolean) => {
        if (loggedIn) {
            axios.defaults.headers.common['token'] = await auth.currentUser?.getIdToken();
            axios.defaults.baseURL = import.meta.env.VITE_API_BACKEND_URL;
            setContent(children);
        } else {
            setContent(
                <UnauthRoutes />
            );
        }
    };
    const logout = () => {
        signOut(auth).then(() => {
            console.log("User has successfully signed out.");
        }).catch((error) => {
            console.error("Error signing out: ", error);
        });
    }
    return (
        <GlobalContext.Provider value={{ authorize, logout, sideBarOpen, setSideBarOpen, user }}>
            {content}
        </GlobalContext.Provider>
    )
}
export default StoreProvider
const useSideBarOpen = () => ({
    sideBarOpen: useContext(GlobalContext).sideBarOpen,
    setSideBarOpen: useContext(GlobalContext).setSideBarOpen,
})
const useAuthorize = () => ({
    user: useContext(GlobalContext).user,
    authorize: useContext(GlobalContext).authorize,
    logout: useContext(GlobalContext).logout,
})
export { useSideBarOpen, useAuthorize, }