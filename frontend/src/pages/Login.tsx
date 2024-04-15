
import firebase from 'firebase/compat/app';
import * as firebaseui from 'firebaseui';
import 'firebaseui/dist/firebaseui.css';
import { auth } from "../services/firebase";
import 'firebase/compat/auth';
import { getAuth, sendEmailVerification } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Login = () => {
    const nav = useNavigate()
    useEffect(() => {
        const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth);
        const uiConfig: firebaseui.auth.Config = {
            callbacks: {
                signInSuccessWithAuthResult: function (authResult, /*redirectUrl */) {
                    if (authResult.additionalUserInfo.isNewUser) {
                        const auth = getAuth();
                        if (auth.currentUser) {
                            sendEmailVerification(auth.currentUser)
                                .then(() => {
                                    nav('/city-park-lot/sent-verify-mail')
                                });
                        }
                        return false
                    } else if (!authResult.user.emailVerified) {
                        nav('/city-park-lot/please-verify-mail')
                        return false;
                    }
                    return true;
                },
                uiShown: function () {
                    const loader = document.getElementById('loader');
                    if (loader) loader.style.display = 'none';
                }
            },
            signInFlow: 'popup',
            signInSuccessUrl: `/city-park-lot/dashboard`,
            signInOptions: [
                {
                    provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
                    requireDisplayName: false,
                    // disableSignUp: {
                    //     adminEmail: 'admin@example.com',
                    //     helpLink: 'https://www.example.com/trouble_signing_in'
                    // }
                },
                firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            ],
            tosUrl: '/',
            privacyPolicyUrl: '/'
        };
        ui.start('#firebaseui-auth-container', uiConfig);
    }, [])
    return (
        <div className="max-w-[1200px] w-full mx-auto flex flex-col gap-4 p-8 pt-[120px]">
            <div id="firebaseui-auth-container"></div>
            <div id="loader">Loading...</div>
        </div>
    )
}
export default Login