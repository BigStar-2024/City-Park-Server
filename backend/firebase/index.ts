import admin, { ServiceAccount } from 'firebase-admin'
// Initialize the Firebase Admin SDK
import serviceAccount from './serviceAccountKey.json'
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
// const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as ServiceAccount),
});

export const testFirebaseAdminSDK = () => {
    // admin.auth().listUsers().then(e=>console.log(e))
}
export const verifyIdToken = (idToken: string, onSuccess: (decodedToken: DecodedIdToken) => void, onFail: (reason: any) => void) => {
    admin.auth().verifyIdToken(idToken)
        .then(onSuccess)
        .catch(onFail);
}

export { admin }