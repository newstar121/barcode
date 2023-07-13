import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { API_URL } from '../utils/constants';

const FileUpload = () => {

    const [file, setFile] = useState();
    const [fileName, setFileName] = useState("");

    const [data, setData] = useState([])
    const [parseData, setParseData] = useState(<></>)
    const [isLoading, setIsLoading] = useState(false)

    const saveFile = (e) => {
        setFile(e.target.files[0]);
        setFileName(e.target.files[0].name);
        setParseData(<></>)
    };

    const uploadFile = async (e) => {
        setIsLoading(true)
        const formData = new FormData();
        formData.append("file", file);
        formData.append("fileName", fileName);
        try {
            axios.post(
                API_URL + "upload",
                formData
            ).then((response) => {
                if (response.data.code == 200) {
                    setData(response.data.data);
                } else {
                    console.log('parse error', response.message)
                }
                setIsLoading(false)
            });
        } catch (ex) {
            console.log(ex);
            setIsLoading(false)
        }
    };

    useEffect(() => {
        let result = []
        for (let i = 0; i < data.length; i++) {
            if (data[i].format !== 'PDF417') continue;
            let keys = Object.keys(data[i].data.license);
            let children = []
            keys.forEach((key) => {
                children.push(
                    <div className='d-flex align-items'>
                        <span className='fs-24 mr-20'>{key}:</span>
                        <span className='fs-24'>{data[i].data.license[key]}</span>
                    </div>
                )
            })
            result.push(
                <div className='d-flex flex-column'>
                    {children}
                </div>
            )
        }

        setParseData(result)
    }, [data])

    return (
        <div className='d-flex flex-column'>
            <div className="d-flex">
                <input type="file" onChange={saveFile} />
                <button onClick={uploadFile}>Upload</button>
            </div>
            {isLoading && (<span>Loading</span>)}
            <div className='w-100 d-flex flex-column mt-30'>
                {parseData}
            </div>
        </div>

    );

}

export default FileUpload;