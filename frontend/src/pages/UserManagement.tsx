import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@tremor/react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { UserType } from "../types";
import { Dialog } from "primereact/dialog";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import { Button as PrimeButton } from 'primereact/button';
import { confirmDialog } from "primereact/confirmdialog";
import { showToast } from "../utils";
/* eslint-disable @typescript-eslint/no-explicit-any */
const UserManagement = () => {
    const [visible, setVisible] = useState(false)
    const [user, setUser] = useState<UserType>()
    const [filteredUser, setFilteredUser] = useState<UserType[]>()
    const [filter, setFilter] = useState<"super" | "end" | "all">("all")
    const [users, setUsers] = useState<UserType[]>([]);
    const fetchData = async () => {
        const { data } = await axios.get(`/user`)
        setUsers(data)
    }
    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {
        setFilteredUser(users.filter(u => {
            if (filter === "all") return true
            if (filter === "super") return u.customClaims?.admin === true
            if (filter === "end") return !u.customClaims?.admin
        }))
    }, [users, filter])
    const handleRemove = (uid: string | undefined) => {
        if (!uid) return
        axios.delete(`/user/delete/${uid}`).then(() => {
            fetchData()
            setVisible(false)
        }).catch(() => { 
            showToast("Session is possibly expired.\nPlease refresh page or sign in again!")
        })
    }

    return (
        <div className="p-2 bg-white rounded-lg w-full">
            <h1 className='font-bold p-2 text-lg'>User Management Panel</h1>
            <div className='flex max-md:flex-col justify-between items-center'>
                <div className='flex p-2 gap-2'>
                    <Button onClick={() => setFilter("super")} color='green'>Super admin</Button>
                    <Button onClick={() => setFilter("end")} color='rose'>End Users</Button>
                    <Button onClick={() => setFilter("all")} color='blue'>All</Button>
                </div>
                <div className='flex gap-2 items-center'>
                    <div className='p-2 rounded-md bg-blue-700 flex justify-center items-center w-fit cursor-pointer hover:opacity-80'>
                        <svg className='w-4 h-4 fill-white'><use href="#svg-refresh" /></svg>
                    </div>
                    <div className='px-3 py-1 border border-[#ccc] rounded-md text-sm'>{users.length} users</div>
                </div>
            </div>
            {users.length > 0 ?
                <DataTable onRowPointerDown={(e) => {
                    setUser(users.filter(v => v.uid === e.data.uid)[0])
                    setVisible(true)
                }} stripedRows rowHover className="text-[12px] cursor-pointer" value={filteredUser} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '50rem' }} pt={{
                    thead: { className: "text-[14px]" },
                    paginator: {
                        pageButton: ({ context }: { context: any }) => ({
                            className: context.active ? 'bg-blue-500 text-white text-[12px]' : undefined,
                        }),
                    },
                }}>
                    <Column body={(user: UserType) => <img className="rounded-full w-10 h-10 min-w-10 min-h-10 float-right" src={user.photoURL || `${import.meta.env.VITE_API_BACKEND_URL}public/user.png`} />} style={{ width: "1%", padding: 0 }}></Column>
                    <Column header="Email" sortable sortField="email" body={
                        (user: UserType) =>
                            <div className="flex items-center gap-1">
                                <span className="w-60">{user.email}</span>
                                {user.customClaims?.admin &&
                                    <span className="p-1 bg-purple-600 text-white rounded-md text-xs">admin</span>}
                                {user.emailVerified &&
                                    <span className="p-1 bg-yellow-600 text-white rounded-md text-xs">verified</span>}
                            </div>
                    } ></Column>
                    <Column field="displayName" header="User name" sortable ></Column>
                    <Column header="Creation Time" sortable body={(user: UserType) => <span>{new Date(user.metadata.creationTime).toLocaleString('en-us')}</span>} ></Column>
                    <Column header="Last Signin Time" sortable body={(user: UserType) => <span>{new Date(user.metadata.lastSignInTime).toLocaleString('en-us')}</span>} ></Column>
                    <Column header="Last Refresh Time" sortable body={(user: UserType) => <span>{new Date(user.metadata.lastRefreshTime).toLocaleString('en-us')}</span>} ></Column>
                </DataTable> :
                <span>Loading...</span>
            }
            {visible && <Dialog pt={{
                root: { className: "w-full md:w-[80vw]", style: { width: "", maxHeight: "80vh" } }
            }} header={
                <div className="w-full flex items-center gap-4">
                    <span>User</span>
                    <PrimeButton severity="danger" className="text-xs p-danger" onClick={() => {
                        confirmDialog({
                            message: 'Do you want to remove this user?',
                            header: 'Delete Confirmation',
                            icon: 'pi pi-info-circle',
                            defaultFocus: 'reject',
                            acceptClassName: 'p-button-danger',
                            accept: () => handleRemove(user?.uid),
                            // reject
                        });
                    }}>Remove this user</PrimeButton>
                </div>} visible={visible} style={{ width: '50vw', maxHeight: "80vh" }} onHide={() => setVisible(false)}>

                <div className="w-full max-w-[600px] mx-auto">
                    <Table sx={{
                        "& .MuiTableCell-root": {
                            border: "1px solid rgba(224, 224, 224, 1)"
                        }
                    }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell width="30%" align="center">Email</TableCell>
                                <TableCell align="center">{user?.email}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell align="center">Avatar</TableCell>
                                <TableCell align="center"><img className="rounded-full w-10 h-10 min-w-10 min-h-10 mx-auto" src={user?.photoURL || `${import.meta.env.VITE_API_BACKEND_URL}public/user.png`} /></TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell width="30%" align="center">Admin</TableCell>
                                <TableCell align="center">
                                    <div className="flex items-center">
                                        <div className="w-full">
                                            {
                                                user?.customClaims?.admin ?
                                                    <span className="p-1 bg-purple-600 text-white rounded-md text-xs">admin</span> :
                                                    <span className="p-1 bg-yellow-600 text-white rounded-md text-xs">No</span>
                                            }
                                        </div>
                                        <button onClick={async () => {
                                            await axios.post('/user/set-admin', { uid: user?.uid, value: user?.customClaims?.admin ? false : true })
                                            fetchData()
                                            setVisible(false)
                                        }} className="float-right text-[12px] w-40 p-2 bg-blue-600 text-white rounded-md hover:opacity-80">
                                            {user?.customClaims?.admin ? "To unprivileged" : "Promote to admin"}
                                        </button>
                                    </div>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell width="30%" align="center">Email Verified</TableCell>
                                <TableCell align="center">
                                    {user?.emailVerified ?
                                        <span className="p-1 bg-yellow-600 text-white rounded-md text-xs">Verified</span> :
                                        <span className="p-1 bg-red-600 text-white rounded-md text-xs">Not Verified</span>}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell width="30%" align="center">Disabled</TableCell>
                                <TableCell align="center">
                                    {user?.disabled ?
                                        <span className="p-1 bg-red-600 text-white rounded-md text-xs">Disabled</span> :
                                        <span className="p-1 bg-cyan-600 text-white rounded-md text-xs">No</span>}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell width="30%" align="center">Display Name</TableCell>
                                <TableCell align="center">{user?.displayName}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell width="30%" align="center">Creation Time</TableCell>
                                <TableCell align="center">{new Date(user?.metadata.creationTime || "").toLocaleString('en-us')}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell width="30%" align="center">Last Sign In Time</TableCell>
                                <TableCell align="center">{new Date(user?.metadata.lastSignInTime || "").toLocaleString('en-us')}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell width="30%" align="center">Last Refresh Time</TableCell>
                                <TableCell align="center">{new Date(user?.metadata.lastRefreshTime || "").toLocaleString('en-us')}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell width="30%" align="center">Password Salt</TableCell>
                                <TableCell align="center">{user?.passwordSalt}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell width="30%" align="center">Password Hash</TableCell>
                                <TableCell align="center">{user?.passwordHash}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </Dialog>}
        </div >
    );
}
export default UserManagement