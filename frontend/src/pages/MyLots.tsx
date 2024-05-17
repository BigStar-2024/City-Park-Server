import { Dialog } from 'primereact/dialog';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { useEffect, useState } from 'react';
import Permits from './Permits';
// import 'primereact/resources/primereact.css'
// import 'primereact/resources/themes/lara-light-indigo/theme.css';// theme
import UploadImage from '../components/UploadImage';
import copy from "copy-to-clipboard";
import { Button as PrimeButton } from 'primereact/button';
import { Button } from '@tremor/react';
import axios from 'axios';
import ProgressLinearWithValueLabel from '../components/ProgressBar';
import { showToast } from '../utils';
import { LotType, UserType } from '../types';
import { confirmDialog } from 'primereact/confirmdialog';
import '../style/prime.css'
import ParkingSessionTable from '../components/ParkingSessionTable';
import { useAuthorize } from '../store/store';
import { MultiSelect } from 'primereact/multiselect';
import MyCalendar from '../components/MyCalendar';
import { Dropdown } from 'primereact/dropdown';


interface PayingApp {
    name: string;
    url: string;
}

const Lot = ({ lot, fetchLot }: { lot: LotType, fetchLot: () => Promise<void> }) => {
    const { user } = useAuthorize()
    const [visible, setVisible] = useState(false);
    const handleRemove = async () => {
        await axios.delete(`/lot/${lot._id}`)
        await fetchLot()
    }
    return (
        <>
            <div onClick={() => setVisible(true)} className="flex flex-col justify-center items-center cursor-pointer group border border-black overflow-hidden">
                <img className="group-hover:scale-[1.05] transition-all ease-in-out duration-1000" src={`${import.meta.env.VITE_API_BACKEND_URL}public/${lot.cover}`} />
                <span>{lot.siteCode}</span>
            </div>

            {visible &&
                <Dialog pt={{
                    root: { className: "w-full md:w-[80vw]", style: { width: "", maxHeight: "80vh" } },
                    header: { className: 'px-4 py-2' }
                }} header={
                    () =>
                        <div className='flex items-center gap-4'>
                            <img className='w-32 rounded-md' src={`${import.meta.env.VITE_API_BACKEND_URL}public/${lot.cover}`} />
                            <span>{lot.siteCode}</span>
                            <i className='text-xs'>Owners: {lot.owners.join(", ")}</i>
                        </div>
                } visible={visible} style={{ width: '50vw', maxHeight: "80vh" }} onHide={() => setVisible(false)}>
                    <div className='flex py-2 items-center w-full'>
                        <span className='w-[150px]'>Lot Code:</span>
                        <div className='relative w-full h-fit flex items-center border border-black rounded-md bg-black/5'>
                            <button onClick={() => {
                                copy(`url=${import.meta.env.VITE_API_SENDER_URL}&token=${lot.token}`)
                                showToast("Copied to clipboard!", true)
                            }} className='p-3 z-10 bg-[#f0f0f0] rounded-l-md border-r border-black hover:opacity-80 active:bg-orange-100 ease-in-out transition-all'><svg width={20} height={20}><use href="#svg-copy" /></svg></button>
                            <div className='absolute left-0 w-full overflow-x-auto p-2 pl-[60px] text-xs text-nowrap'>{`url=${import.meta.env.VITE_API_SENDER_URL}&token=${lot.token}`}</div>
                        </div>
                    </div>
                    <div>
                    <div className='flex justify-between max-lg:flex-col gap-2 items-center pb-4 '>

                        <div className='flex w-full items-center gap-1'>
                            <span className='max-lg:w-[150px]'>URL:</span>
                            <i className='w-full border border-black p-2 rounded-md min-w-[200px] overflow-x-auto block'>{lot.url}</i></div>

                    </div>
                    <div className='mb-2'>
                        {
                            user?.customClaims.admin &&
                            <PrimeButton className='w-full min-w-[200px] text-center justify-center' onClick={() => {
                                confirmDialog({
                                    message: 'Do you want to delete this record?',
                                    header: 'Delete Confirmation',
                                    icon: 'pi pi-info-circle',
                                    defaultFocus: 'reject',
                                    acceptClassName: 'p-button-danger',
                                    accept: handleRemove,
                                    // reject
                                });
                            }}>Remove this lot</PrimeButton>
                        }
                    </div>
                    </div>
                    <Accordion activeIndex={0}>
                        <AccordionTab header="Parking Sessions">
                            <ParkingSessionTable siteCode={lot.siteCode} />
                        </AccordionTab>
                        <AccordionTab header="Permits">
                            <Permits />
                        </AccordionTab>
                        <AccordionTab header="Unenforcable Dates">
                            <MyCalendar siteCode={lot.siteCode} />
                        </AccordionTab>
                    </Accordion>
                </Dialog>
            }
        </>
    )
}
const MyLots = () => {
    const { user } = useAuthorize()
    const [endUsers, setEndUsers] = useState<UserType[]>([])
    const [lots, setLots] = useState<LotType[]>([])
    const [file, setFile] = useState<File>();
    const [url, setUrl] = useState("")
    const [siteCode, setSiteCode] = useState("")
    const [uploadProgress, setUploadProgress] = useState(0);
    const [visible, setVisible] = useState({
        add: false
    });
    const fetchLot = async () => {
        const { data } = await axios.get(`/lot`);
        setLots(data)
    }
    const handleCreate = async () => {
        if (siteCode.trim() === "") {
            showToast("Please input site code!")
            return
        }
        if (!url.trim().startsWith("http")) {
            showToast("Please input url correctly!")
            return
        }
        if (!lotOwners || lotOwners?.length === 0) {
            showToast("Please select lot owner!")
            return
        }
        if (!file) {
            showToast("Select cover image!")
            return;
        }
        if (lots.filter(l => l.siteCode.trim() === siteCode.trim()).length > 0) {
            showToast("Already registered siteCode!")
            return;
        }
        const formData = new FormData();
        formData.append('siteCode', siteCode);
        formData.append('url', url);
        lotOwners?.forEach(w => {
            formData.append('owners[]', w.email)
        })
        formData.append('cover', file);
        setUploadProgress(0)
        try {
            await axios.post(`/lot`, formData, {
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round(
                        (progressEvent.loaded / (progressEvent.total ? progressEvent.total : 10000000000)) * 100
                    );
                    setUploadProgress(progress);
                },
            });
            fetchLot()
            setVisible(v => ({ ...v, add: false }))
        } catch (error) {
            // Handle error
        }
    }
    useEffect(() => {
        fetchLot()
        fetchEndUsers()
    }, [])


    const fetchEndUsers = async () => {
        const { data } = await axios.get(`/user/end-users`)
        setEndUsers(data)
    }
    const [lotOwners, setLotOwners] = useState<UserType[]>()

    const [selectedPayingApp, setSelectedApp] = useState<PayingApp | null>(null);
    const payingApps: PayingApp[] = [
        { name: 'Flowbird', url: 'https://weboffice.us.flowbird.io/cwo2/images/favicon.ico' },
        { name: 'Citypark PayingApp', url: 'https://i.ibb.co/HhCHXCY/fav-bg.jpg' }
    ];

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                {
                    user?.customClaims.admin &&
                    <div onClick={() => {
                        setSiteCode("")
                        setUrl("")
                        setFile(undefined)
                        setUploadProgress(0)
                        setLotOwners(undefined)
                        setVisible(v => ({ ...v, add: true }))
                    }
                    } className="flex flex-col gap-2 justify-center items-center cursor-pointer group border border-dotted rounded-md border-black">
                        <svg width={40} height={40}><use href="#svg-plus" /></svg>
                        <span>New Lot</span>
                    </div>
                }
                {lots.map((lot, i) => <Lot key={i} lot={lot} fetchLot={fetchLot} />)}
            </div>
            <Dialog pt={{ root: { className: "w-full md:w-[60vw]", style: { width: "", maxHeight: "60vh" } }, }} header="Create new lot" visible={visible.add} style={{ width: '50vw', maxHeight: "80vh" }} onHide={() => setVisible(v => ({ ...v, add: false }))}>
                <div className='flex flex-col gap-2 w-full max-md:p-1 p-4'>
                    <div className='flex items-center max-md:flex-col max-md:items-start'>
                        <span className='w-40'>Site Code</span>
                        <input onChange={(e) => setSiteCode(e.target.value.trim())} value={siteCode} className='col-span-3 w-full outline-none px-4 py-1 border border-black rounded-md placeholder:italic' placeholder='FL 101' />
                    </div>
                    <div className='flex items-center max-md:flex-col max-md:items-start'>
                        <span className='w-40 mb-2'>URL for UI</span>
                        <input onChange={(e) => setUrl(e.target.value)} value={url} className='col-span-3 w-full outline-none px-4 py-1 border border-black rounded-md placeholder:italic' placeholder='https://...' />
                    </div>
                    <div >
                        <span className='w-40'>Lot owner</span>
                        <MultiSelect value={lotOwners} options={endUsers} filter onChange={(e) => {
                            setLotOwners(e.value)
                        }} optionLabel="email" pt={{
                            root: { className: 'border border-black' },
                            checkbox: { className: "border border-black" },
                        }}
                            placeholder="Select Owners" itemTemplate={(option) => {
                                return (
                                    <div className="flex items-center gap-1">
                                        <img className="rounded-full w-10 h-10 min-w-10 min-h-10 float-right" src={option.photoURL || `${import.meta.env.VITE_API_BACKEND_URL}public/user.png`} />
                                        <div>{option.email}</div>
                                    </div>
                                );
                            }} className="w-full md:w-20rem text-xs" display="chip" />
                    </div>
                    <div >
                        <span className='w-40'>Paying App</span>
                        <Dropdown
                            value={selectedPayingApp} // Update selected value
                            options={payingApps} // Update options
                            filter
                            onChange={(e) => setSelectedApp(e.value)} // Update onChange function
                            optionLabel="name" // Update optionLabel to display the name of the paying app
                            placeholder="Select a Paying App"
                            pt={{
                                root: { className: 'border border-black' },
                                // checkbox: { className: "border border-black" },
                            }}
                            itemTemplate={(option) => (
                                <div className="flex items-center gap-1">
                                    <img className="rounded-full w-10 h-10 min-w-10 min-h-10 float-right" src={option.url} />
                                    <div>{option.name}</div>
                                </div>
                            )}
                            className="w-full md:w-20rem text-xs"
                        // display="chip"
                        // maxSelectedLabels={1}
                        />
                    </div>

                    <UploadImage setFile={setFile} />
                    <div className='col-start-2 col-span-2'>
                        {uploadProgress > 0 && <ProgressLinearWithValueLabel setVar={{ uploadProgress }} />}
                    </div>
                    <Button onClick={handleCreate} className='w-full'>Create</Button>
                </div>
            </Dialog>
        </>
    )
}
export default MyLots
