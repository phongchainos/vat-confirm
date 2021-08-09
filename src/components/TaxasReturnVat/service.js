export const applyVatForm = async (item) => {
    const rawResponse = await fetch(
        "https://vat.taxasone.com/api/v1/user/checkvalidhometax/",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                biz_no: item.biz_no,
                hometax_id: item.hometax_id,
                hometax_pw: item.hometax_pw,
            }),
        }
    );
    return await rawResponse.json();
    // return Promise.resolve({
    //     "status": "success",
    //     "message": "홈택스 로그인이 성공하였습니다. 아래 내용 입력을 진행해주세요.",
    //     "data": {
    //         "user": {
    //             "name": "박일용",
    //             "birthday": "600617"
    //         },
    //         "business": {
    //             "biz_no": "1130875856",
    //             "biz_name": "동성개별화물"
    //         }
    //     }
    // })
};

export const verifyCodeAsync = async (item) => {
    const rawResponse = await fetch(
        "https://vat.taxasone.com/api/v1/user/sendhometaxsms/",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                biz_no: item.biz_no,
                mobile_vendor: item.mobile_vendor,
                mobile_no: item.mobile_no,
            }),
        }
    );
    return await rawResponse.json();
};

export const checkValidHomeTax = async (item) => {
    const rawResponse = await fetch(
        "https://vat.taxasone.com/api/v1/user/checkvalidhometaxsmsandadduser/",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                biz_no: item.biz_no,
                cert_no: item.cert_no,
                app_path: item.app_path,
                p_invoice_quantity: item.p_invoice_quantity,
                bank_real_id: item.bank_real_id,
                bank_no: item.bank_no,
            }),
        }
    );
    return await rawResponse.json();
};

export const listBanks = async () => {
    const rawResponse = await fetch(
        "https://vat.taxasone.com/api/v1/bank/list/",
        {
            method: "GET",
        }
    );
    return await rawResponse.json();
};

export const checkServiceAvailable = async () => {
    const rawResponse = await fetch(
        "https://vat.taxasone.com/api/v1/user/checkserviceavailable/",
        {
            method: "GET",
        }
    );
    return await rawResponse.json();
};
