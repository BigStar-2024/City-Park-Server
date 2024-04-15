import { useEffect, useRef, useState } from "react";
import ProgressLinearWithValueLabel from "./ProgressBar";

const UploadImage = ({ setFile }: { setFile: React.Dispatch<React.SetStateAction<File | undefined>> }) => {
    const [imageDataUrl, setImageDataUrl] = useState<string>();
    const ref = useRef<HTMLInputElement>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    useEffect(() => {
        if (uploadProgress === 100) setUploadProgress(0)
    }, [uploadProgress])
    const handleFileInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        //! readAsDataUrl
        if (file) {
            setFile(file)
            const reader = new FileReader();
            reader.onload = (progressEvent) => {
                const progress = Math.round(
                    (progressEvent.loaded / (progressEvent.total ? progressEvent.total : 10000000000)) * 100
                );
                setUploadProgress(progress);
            }
            reader.onloadend = () => {
                const resultUrl: string = reader.result as string;
                setImageDataUrl(resultUrl);
            };

            reader.readAsDataURL(file);
        }
        //! readAsDataUrl
    }
    return (
        <section className="col-span-4 flex justify-center">
            <div className="flex flex-col justify-center">
                {
                    imageDataUrl ?
                        <div className="border border-[#C8CAD0] rounded-md p-4 relative">
                            <img alt="img" src={`${imageDataUrl}`} width={120} height={120} />
                            <button onClick={() => {
                                setImageDataUrl('')
                                setFile(undefined)
                            }} className="absolute top-0 right-2 w-7 h-12 bg-white flex justify-center items-center px-1" style={{ borderRadius: "50%" }}><svg className='w-[10px] h-[10px] inline-block stroke-[#040c13] rotate-[45deg]'><use href="#svg-plus"></use></svg></button>
                        </div> :
                        uploadProgress === 0 ?
                            <div onClick={() => { ref.current?.click() }} className="flex flex-col gap-4 items-center self-center cursor-pointer">
                                <div className="w-12 h-12 rounded-full border border-black flex justify-center items-center">
                                    <svg className='w-[22px] h-[17px] align-baseline inline-block stroke-black '><use href="#svg-plus"></use></svg>
                                </div>
                                <div className="flex flex-col items-center">
                                    <p className="text-[16px] leading-6 text-center">Choose image file</p>
                                    <p className="text-[14px] left-5 font-bold">Size limit: 10MB</p>
                                </div>
                            </div> :
                            <div>
                                <h3>Uploading logo file...</h3>
                                <ProgressLinearWithValueLabel setVar={{ uploadProgress }} />
                            </div>
                }
            </div>
            <input type="file" ref={ref} hidden accept="image/*" onChange={handleFileInputChange} />
        </section>
    )
}
export default UploadImage;