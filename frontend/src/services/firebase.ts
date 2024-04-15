// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyD1KbSVEZ0ecOjwlQHlifl0kqCugcFiaDc",
    authDomain: "city-park-lot-418523.firebaseapp.com",
    projectId: "city-park-lot-418523",
    storageBucket: "city-park-lot-418523.appspot.com",
    messagingSenderId: "822840955784",
    appId: "1:822840955784:web:3ddfb647572214909ca03d",
    measurementId: "G-QQLCXZJJE3"
  };
if (!getApps().length) {
    initializeApp(firebaseConfig);
}
export const app = getApp()
export { onAuthStateChanged }
export const auth = getAuth(app);


