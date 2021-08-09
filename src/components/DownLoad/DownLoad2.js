import React, {useEffect} from 'react'
import {useParams} from "react-router-dom";
import FileSaver from 'file-saver'
const DownLoad2 = () => {
    let {filename} = useParams()
    useEffect(()=> {
        FileSaver.saveAs(`https://taxasreturn-vat.s3.ap-northeast-2.amazonaws.com/result/vat/${filename}.pdf`, `${filename}.pdf`)
    },[filename])
    return <div></div>
}
export default DownLoad2