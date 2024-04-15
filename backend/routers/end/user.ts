import express from "express";
import { admin } from "../../firebase";
import { UserRecord } from "firebase-admin/lib/auth/user-record";
const superUserRouter = express.Router();


const listAllUsers = async (users: UserRecord[], nextPageToken?: string) => {
    // List batch of users, 1000 at a time.
    try {
        const listUsersResult = await admin.auth().listUsers(1000, nextPageToken)
        // listUsersResult.users.forEach((userRecord) => {
        //     console.log('user', userRecord.toJSON());
        // });
        users = users.concat(listUsersResult.users)
        if (listUsersResult.pageToken) {
            // List next batch of users.
            users = users.concat(await listAllUsers(users, listUsersResult.pageToken))
        }
        return users
    } catch (error) {
        console.log('Error listing users:', error);
    }
    return []
};

superUserRouter
    .route("/")
    .get(async (req, res) => {
        try {
            const users = await listAllUsers([])
            res.status(200).json(users);
        } catch (error) {
            console.log("API error", error);
            if (!res.headersSent) {
                res.send(500).json({
                    success: false,
                    error: "Server error",
                });
            }
        }
    });


superUserRouter
    .route("/delete/:uid")
    .delete(async (req, res) => {
        const { uid } = req.params
        try {
            await admin.auth().deleteUser(uid)
            res.status(200).json({message:"Success"});
        } catch (error) {
            console.log("API error", error);
            if (!res.headersSent) {
                res.send(500).json({
                    success: false,
                    error: "Server error",
                });
            }
        }
    });
superUserRouter
    .route("/end-users")
    .get(async (req, res) => {
        try {
            const users = await listAllUsers([])
            res.status(200).json(users.filter(user => !user.customClaims?.admin));
        } catch (error) {
            console.log("API error", error);
            if (!res.headersSent) {
                res.send(500).json({
                    success: false,
                    error: "Server error",
                });
            }
        }
    });
superUserRouter
    .route("/set-admin")
    .post(async (req, res) => {
        const { uid, value } = req.body
        admin.auth().setCustomUserClaims(uid, { admin: value})
        res.status(200).send()
    })

export default superUserRouter;
