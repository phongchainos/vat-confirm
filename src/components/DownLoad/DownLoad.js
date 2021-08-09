import React, {useEffect, useState} from "react"
import {useHistory} from "react-router-dom"
import filePdf from '../../demo/b.pdf'
import fileDownload from 'js-file-download'
import FileSaver from 'file-saver'
import {Document, Page} from 'react-pdf/dist/esm/entry.webpack';
import {
    useParams
} from "react-router-dom"
import {Button} from "reactstrap";


const DownLoad = ({}) => {
    const [loadDone, setLoadDone] = useState(false);
    const [url, setUrl] = useState('');
    const [totalPage, setTotalPage] = useState(0);
    const [page, setPages] = useState([]);
    let {filename} = useParams()
    let history = useHistory()
    useEffect(() => {
        // FileSaver.saveAs(`https://taxasreturn-vat.s3.ap-northeast-2.amazonaws.com/result/vat/01073704163_%EC%8B%A0%ED%83%9C%EC%88%9C_%EB%A7%A4%EC%B6%9C%EC%B2%98%EB%B3%84+%EC%84%B8%EA%B8%88%EA%B3%84%EC%82%B0%EC%84%9C%ED%95%A9%EA%B3%84%ED%91%9C(%EA%B0%91).pdf`, filename)

        setUrl(`https://taxasreturn-vat.s3.ap-northeast-2.amazonaws.com/result/vat/${filename}.pdf`)

        return;
        fetch(`https://taxasreturn-vat.s3.ap-northeast-2.amazonaws.com/result/vat/${filename}`, {
          method: "GET", // *GET, POST, PUT, DELETE, etc.
          headers: {
            "Content-Type": "application/json",
            "responseType": "blob"
          }
        })
          .then(data => {
            console.log(data)
            if (data.status === 200)
              return data.blob()
            return Promise.reject()
          })
          .then((data) => {
              // fileDownload(data, filename);
              const blob = new Blob([data], {
              type: "application/pdf"
            })

              return ;
            const url = window.URL.createObjectURL(blob)
            // window.location.href = url
            const link = document.createElement("a")
            link.href = url
            link.target = '_blank'
            link.download = filename
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            return Promise.resolve()
          }).then(() => {
          // setTimeout(()=> {
          //   window.close()
          // },1000)
        }).catch(err => {
          // alert('File Not Found')
          // window.close()
        })
    }, [filename])
    const downLoad = () => {
        // history.push('/realResult/abc')
        window.open(`/realResult/${filename}`)
        // FileSaver.saveAs(`https://taxasreturn-vat.s3.ap-northeast-2.amazonaws.com/result/vat/01073704163_%EC%8B%A0%ED%83%9C%EC%88%9C_%EB%A7%A4%EC%B6%9C%EC%B2%98%EB%B3%84+%EC%84%B8%EA%B8%88%EA%B3%84%EC%82%B0%EC%84%9C%ED%95%A9%EA%B3%84%ED%91%9C(%EA%B0%91).pdf`, filename)
        // fetch(`https://taxasreturn-vat.s3.ap-northeast-2.amazonaws.com/result/vat/01073704163_%EC%8B%A0%ED%83%9C%EC%88%9C_%EB%A7%A4%EC%B6%9C%EC%B2%98%EB%B3%84+%EC%84%B8%EA%B8%88%EA%B3%84%EC%82%B0%EC%84%9C%ED%95%A9%EA%B3%84%ED%91%9C(%EA%B0%91).pdf`, {
        //     method: "GET",
        //     headers: {
        //         "responseType": "blob"
        //     }
        // }).then(data => data.blob()).then(data => {
        //     fileDownload(data, filename);
        //     // FileSaver.saveAs(data, 'abc.pdf')
        // })
    }



    const onLoadSuccess = ({numPages}) => {
        setTotalPage(numPages)
        setLoadDone(true)
        const arr1 = new Array(numPages)
        const arr = [...arr1];
        setPages(arr)
    }
    return <div className={'pdf-wrapper'}>
            <Document
                error={"File not found"}
                file={url}
                onLoadError={() => {
                    setLoadDone(false)
                }}
                onLoadSuccess={onLoadSuccess}>
                {
                    page.map((item, i) => (<Page key={i} pageNumber={i + 1}/>))
                }
            </Document>
        <div className={'my-button'} style={{textAlign: "center"}}>
            { loadDone && <Button className={"btn-success m-auto"}  onClick={downLoad}>DownLoad</Button>}
        </div>
        </div>

}
export default DownLoad