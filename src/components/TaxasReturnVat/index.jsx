/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable no-useless-concat */
/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Label,
  FormGroup,
  Input,
  Button,
} from "reactstrap";
import { css } from "@emotion/react";
import FadeLoader from "react-spinners/FadeLoader";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faCircle } from "@fortawesome/free-solid-svg-icons";
// import Swal from "sweetalert2";
import swal from "@sweetalert/with-react";
import BusinessNumberBox from "../BusinessNumberBox/index";
import BizNo from "../Bizno/index";
import {
  applyVatForm,
  verifyCodeAsync,
  checkValidHomeTax,
  listBanks,
  checkServiceAvailable,
} from "./service";
import TermsOfUse from "../1_TermsOfUse/index";
import PrivacyPolicy from "../2_PrivacyPolicy/index";
import PersonInfoCollection from "../3_PersonInfoCollection/index";
import PersonInfoProvision from "../4_PersonInfoProvision/index";
import TaxAgency from "../5_TaxAgency/index";
import TaxCorporation from "../6_TaxCorporation/index";
import "./index.css";
import ServiceNotAvailable from "../ServiceNotAvailable";

const override = css`
  top: 0;
  left: 0;
  width: 0;
  height: 0;
`;

export default function FormVat(props) {
  const [loading, setLoading] = useState(false);
  const [loadingSendOtp, setLoadingSendOtp] = useState(false);
  const [loadingVerifyCode, setLoadingVerifyCode] = useState(false);

  const [listBankData, setListBankData] = useState([]);
  useEffect(() => {
    listBanks()
      .then((res) => {
        setListBankData(res?.data?.bank);
      })
      .catch((err) => {
        console.log("err", err);
      });
  }, []);

  useEffect(() => {
    checkServiceAvailable()
      .then((res) => {
        setLoadingVerifyCode(false);
        if (res && res.status === "failure") {
          swal({
            content: <ServiceNotAvailable content={res.message} />,
            icon: "warning",
            buttons: false,
            closeOnClickOutside: false
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);


  const [state, setState] = useState({
    biz_no: "",
    hometax_id: "",
    hometax_pw: "",
    acceptLaw: false,
    acceptInfo: false,
    more: false,
    ruleInfo: false,
    contract: false,
    taxOffice: false,
  });

  const [checkedAll, setCheckedAll] = useState(false);

  const [bizNoData, setBizNoData] = useState({
    number1: "",
    number2: "",
    number3: "",
  });

  useEffect(() => {
    setState({
      ...state,
      biz_no:
        `${bizNoData.number1}` +
        `${bizNoData.number2}` +
        `${bizNoData.number3}`,
    });
  }, [bizNoData]);

  const [stateValue, setStateValue] = useState({
    value1: "",
    value2: "",
    value3: "",
  });

  const [stateSMS, setStateSMS] = useState({
    biz_no: "",
    mobile_no: "",
    mobile_vendor: "",
  });

  const [stateVerifyOtp, setStateVerifyOtp] = useState({
    app_path: "",
    cert_no: "",
    p_invoice_quantity: 0,
    bank_real_id: null,
    bank_no: null,
  });

  useEffect(() => {
    setStateSMS({
      ...stateSMS,
      mobile_no:
        `${stateValue.value1}` +
        `${stateValue.value2}` +
        `${stateValue.value3}`,
    });
  }, [stateValue]);

  // validate input authentication number
  const onNumberOnlyChange = (event) => {
    const keyCode = event.keyCode || event.which;
    const keyValue = String.fromCharCode(keyCode);
    const isValid = new RegExp("[0-9]").test(keyValue);
    if (!isValid) {
      event.preventDefault();
      return;
    }
  };
  //

  const getValueInput = (e) => {
    if (
      e.target.name === "acceptLaw" ||
      e.target.name === "acceptInfo" ||
      e.target.name === "more" ||
      e.target.name === "ruleInfo" ||
      e.target.name === "contract" ||
      e.target.name === "taxOffice"
    ) {
      // setState({
      //   ...state,
      //   [e.target.name]: e.target.checked,
      // });
      let isChecked = e.target.checked;
      if (isChecked) {
        let isContent = "";
        switch (e.target.name) {
          case "acceptLaw":
            isContent = <TermsOfUse />;
            break;
          case "acceptInfo":
            isContent = <PrivacyPolicy />;
            break;
          case "more":
            isContent = <PersonInfoCollection />;
            break;
          case "ruleInfo":
            isContent = <PersonInfoProvision />;
            break;
          case "contract":
            isContent = <TaxAgency />;
            break;
          case "taxOffice":
            isContent = <TaxCorporation />;
            break;

          default:
            break;
        }
        swal({
          title: e.target.dataset.title,
          buttons: {
            confirm: "??????",
            cancel: "??????",
          },
          content: isContent,
        }).then((result) => {
          if (result) {
            setState({
              ...state,
              [e.target.name]: isChecked,
            });
          }

          switch (e.target.name) {
            case "acceptLaw":
              if (
                state.acceptInfo &&
                state.more &&
                state.ruleInfo &&
                state.contract &&
                state.taxOffice
              ) {
                setCheckedAll(true);
              }
              break;
            case "acceptInfo":
              if (
                state.acceptLaw &&
                state.more &&
                state.ruleInfo &&
                state.contract &&
                state.taxOffice
              ) {
                setCheckedAll(true);
              }
              break;
            case "more":
              if (
                state.acceptLaw &&
                state.acceptInfo &&
                state.ruleInfo &&
                state.contract &&
                state.taxOffice
              ) {
                setCheckedAll(true);
              }
              break;
            case "ruleInfo":
              if (
                state.acceptLaw &&
                state.acceptInfo &&
                state.more &&
                state.contract &&
                state.taxOffice
              ) {
                setCheckedAll(true);
              }
              break;
            case "contract":
              if (
                state.acceptLaw &&
                state.acceptInfo &&
                state.more &&
                state.ruleInfo &&
                state.taxOffice
              ) {
                setCheckedAll(true);
              }
              break;
            case "taxOffice":
              if (
                state.acceptLaw &&
                state.acceptInfo &&
                state.more &&
                state.contract &&
                state.ruleInfo
              ) {
                setCheckedAll(true);
              }
              break;
            default:
              setCheckedAll(false);
              break;
          }
        });
      } else {
        setState({
          ...state,
          [e.target.name]: false,
        });
        setCheckedAll(false);
      }
    } else {
      setState({
        ...state,
        [e.target.name]: e.target.value,
      });
    }
  };

  const setAllChange = (e) => {
    setCheckedAll(e.target.checked);
    setState({
      ...state,
      acceptLaw: e.target.checked,
      acceptInfo: e.target.checked,
      more: e.target.checked,
      ruleInfo: e.target.checked,
      contract: e.target.checked,
      taxOffice: e.target.checked,
    });
  };

  const getInputSMS = (e) => {
    setStateSMS({
      ...stateSMS,
      [e.target.name]: e.target.value,
    });
  };

  const getInputVerifySMS = (e) => {
    if (e.target.name === "p_invoice_quantity" && e.target.value > 400) {
      swal({
        title: "?????? ?????????????????? 400??? ?????? ????????? ???????????????.",
        icon: "error",
        buttons: {
          confirm: "??????",
        },
      });
      setStateVerifyOtp({
        ...stateVerifyOtp,
        [e.target.name]: "",
      });
      return;
    }
    setStateVerifyOtp({
      ...stateVerifyOtp,
      [e.target.name]: e.target.value,
    });
  };

  const [dataInput5, setDataInput5] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    setLoading(true);
    if (
      state.biz_no === "" ||
      state.hometax_id === "" ||
      state.hometax_pw === ""
    ) {
      swal({
        title: "?????? ?????? ????????? ??????????????????.",
        icon: "error",
        buttons: {
          confirm: "??????",
        },
      });
      return;
    }

    applyVatForm({
      biz_no: state.biz_no,
      hometax_id: state.hometax_id,
      hometax_pw: state.hometax_pw,
    })
      .then((res) => {
        setLoading(false);
        const str =
          res?.data?.user?.name +
          " / " +
          res?.data?.business?.biz_no +
          " / " +
          res?.data?.business?.biz_name;
        if (str) {
          setDataInput5(str);
        }
        if (res && res.status === "success") {
          swal({
            title: res.message,
            icon: "success",
            buttons: {
              confirm: "??????",
            },
          });
          setStateSMS({
            ...stateSMS,
            biz_no: res?.data?.business?.biz_no,
          });
        } else {
          swal({
            title: res.message,
            icon: "error",
            buttons: {
              confirm: "??????",
            },
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const verifyCode = (event) => {
    setLoadingSendOtp(true);
    event.preventDefault();
    if (
      stateSMS.biz_no === "" ||
      stateSMS.mobile_no === "" ||
      stateSMS.mobile_vendor === ""
    ) {
      swal("?????? ?????? ????????? ??????????????????.", "", "error", {
        closeOnClickOutside: false,
        closeOnEsc: false,
        buttons: { confirm: { text: "??????", value: true, className: "btn" } },
      });
      return;
    }
    verifyCodeAsync({
      biz_no: stateSMS.biz_no,
      mobile_vendor: stateSMS.mobile_vendor,
      mobile_no: stateSMS.mobile_no,
    })
      .then((res) => {
        setLoadingSendOtp(false);
        if (res && res.status === "success") {
          swal({
            title: res.message,
            icon: "success",
            buttons: {
              confirm: "??????",
            },
          });
        } else if (res && res.action === "refresh-page") {
          swal({
            title: res.message,
            button: {
              confirm: "??????",
            },
            icon: "warning",
          })
            .then((result) => {
              if (result) {
                window.location.reload();
              }
            })
            .catch((err) => {
              console.log("err", err);
            });
        } else {
          swal({
            title: res.message,
            icon: "error",
            buttons: {
              confirm: "??????",
            },
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const completeApp = (event) => {
    setLoadingVerifyCode(true);
    event.preventDefault();
    if (
      stateSMS.biz_no === "" ||
      stateVerifyOtp.cert_no === "" ||
      stateVerifyOtp.app_path === "" ||
      stateVerifyOtp.p_invoice_quantity === "" ||
      stateVerifyOtp.bank_real_id === "" ||
      stateVerifyOtp.bank_no === ""
    ) {
      swal({
        title: "?????? ?????? ????????? ??????????????????.",
        icon: "error",
        buttons: {
          confirm: "??????",
        },
      });
      return;
    }

    checkValidHomeTax({
      biz_no: stateSMS.biz_no,
      cert_no: stateVerifyOtp.cert_no,
      app_path: stateVerifyOtp.app_path,
      p_invoice_quantity: stateVerifyOtp.p_invoice_quantity,
      bank_real_id: stateVerifyOtp.bank_real_id,
      bank_no: stateVerifyOtp.bank_no,
    })
      .then((res) => {
        setLoadingVerifyCode(false);
        if (res && res.status === "success") {
          swal({
            title: res.message,
            icon: "success",
            buttons: {
              confirm: "??????",
            },
          });
        } else if (res && res.action === "refresh-page") {
          swal({
            title: res.message,
            button: {
              confirm: "??????",
            },
            icon: "warning",
          })
            .then((result) => {
              if (result) {
                window.location.reload();
              }
            })
            .catch((err) => {
              console.log("err", err);
            });
        } else {
          swal({
            title: res.message,
            icon: "error",
            buttons: {
              confirm: "??????",
            },
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <Container>
        <Row>
          <Col>
            <div className="boxElm">
              <img
                className="imgHeader"
                src="https://cdn.imweb.me/thumbnail/20210630/13cd848e3be87.png"
                alt="img"
              />

              <div className="elmContent">
                <h3>??????????????? ????????? ?????? ?????????</h3>
                <p>
                  <br />
                  ??????????????? ???????????? ?????? ????????? ?????? ?????? ??????????????????.
                  <br />
                  ?????? ??? ????????? ???????????? ???????????? <b>????????? ????????? ?????? ???????????? ??????</b>?????????.
                  <br />
                  ???????????? ???????????? ???????????????/??????????????????????????? ??? ????????? ???????????? <b>???????????? ?????? ????????? ?????????</b>????????? ????????? ????????? ?????????.
                  <br />
                  ????????? ????????? ??????????????? ????????????{" "}
                  <a href="https://hometax.go.kr" target="_blank">
                    ???????????????
                  </a>{" "}
                  ??? ????????? ?????????.
                  <br />
                  <br />
                </p>
              </div>
            </div>

            <div className="main">
              <div
                className="mainForm"
              // style={{ height: "100%", position: "relative" }}
              >
                <div
                  style={{
                    margin: 0,
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    msTransform: 'translate("-50%", "-50%")',
                    transform: 'translate("-50%", "-50%")',
                  }}
                >
                  <FadeLoader
                    loading={loading || loadingSendOtp || loadingVerifyCode}
                    css={override}
                    size={150}
                  />
                </div>

                {/* Checkbox */}
                <FormGroup
                  className="mt-3"
                  check
                  style={{ paddingTop: "10px" }}
                >
                  <Label check>
                    <Input
                      type="checkbox"
                      onChange={setAllChange}
                      checked={checkedAll}
                    />
                    <h5>?????? ????????????</h5>
                  </Label>
                </FormGroup>

                <FormGroup check>
                  <Label check>
                    <Input
                      type="checkbox"
                      name="acceptLaw"
                      onChange={getValueInput}
                      checked={state.acceptLaw}
                      data-title="????????????"
                    />
                    ????????????
                  </Label>
                </FormGroup>

                <FormGroup check>
                  <Label check>
                    <Input
                      type="checkbox"
                      name="acceptInfo"
                      onChange={getValueInput}
                      checked={state.acceptInfo}
                      data-title="????????????????????????"
                    />
                    ???????????? ????????????
                  </Label>
                </FormGroup>

                <FormGroup check>
                  <Label>
                    <Input
                      type="checkbox"
                      name="more"
                      onChange={getValueInput}
                      checked={state.more}
                      data-title="?????????????????? ??? ???????????????"
                    />
                    ?????????????????? ??? ???????????????
                  </Label>
                </FormGroup>

                <FormGroup check>
                  <Label>
                    <Input
                      type="checkbox"
                      name="ruleInfo"
                      onChange={getValueInput}
                      checked={state.ruleInfo}
                      data-title="???????????? ???3??? ???????????????"
                    />
                    ???????????? ???3??? ???????????????
                  </Label>
                </FormGroup>

                <FormGroup check>
                  <Label>
                    <Input
                      type="checkbox"
                      name="contract"
                      onChange={getValueInput}
                      checked={state.contract}
                      data-title="?????????????????????"
                    />
                    ???????????? ?????????
                  </Label>
                </FormGroup>

                <FormGroup check>
                  <Label>
                    <Input
                      type="checkbox"
                      name="taxOffice"
                      onChange={getValueInput}
                      checked={state.taxOffice}
                      data-title="???????????? ????????????????????????"
                    />
                    ???????????? ????????????????????????
                  </Label>
                </FormGroup>

                {/* End checkbox */}

                <Form>
                  <FormGroup className="fieldForm">
                    <BizNo
                      name="biz_no"
                      setBizNoData={setBizNoData}
                      bizNoData={bizNoData}
                      defaultValue={state.biz_no}
                      onChange={getValueInput}
                    />
                  </FormGroup>
                  <FormGroup className="fieldForm mt-3">
                    <Label className="labelBox" htmlFor="hometax_id">
                      <h5>????????? ?????????</h5>
                    </Label>
                    <br />
                    <Input
                      type="text"
                      name="hometax_id"
                      placeholder="?????? ???????????? ???????????? ????????? ?????????."
                      id="idHomeTax"
                      onChange={getValueInput}
                      defaultValue={state.hometax_id}
                      required={true}
                    />
                  </FormGroup>
                  <FormGroup className="fieldForm mt-3">
                    <Label className="labelBox" htmlFor="hometax_pw">
                      <h5>????????? ????????????</h5>
                      <i className="icon-required" aria-hidden="true"></i>
                    </Label>
                    <br />
                    <Input
                      type="password"
                      name="hometax_pw"
                      onChange={getValueInput}
                      defaultValue={state.hometax_pw}
                      id="password"
                      required={true}
                    />
                  </FormGroup>

                  <FormGroup
                    className="fieldForm"
                    style={{ textAlign: "center", padding: "20px 0" }}
                  >
                    <Button
                      type="submit"
                      value="Submit"
                      onClick={handleSubmit}
                      className="buttonForm"
                      disabled={
                        state.acceptInfo === false ||
                        state.acceptLaw === false ||
                        state.more === false ||
                        state.biz_no === "" ||
                        state.hometax_id === "" ||
                        state.hometax_pw === "" ||
                        bizNoData.number1 === "" ||
                        bizNoData.number2 === "" ||
                        bizNoData.number3 === ""
                      }
                      style={{ width: "100%" }}
                    >
                      <span style={{ fontSize: "17px" }}>
                        ???????????? ?????? ????????????
                      </span>
                    </Button>
                  </FormGroup>
                </Form>

                <Form>
                  <FormGroup className="fieldForm mt-3">
                    <Label className="labelBox" htmlFor="businessComparison">
                      <h5>????????? ?????? ??????</h5>
                    </Label>
                    <br />

                    <FormGroup>
                      <Input
                        type="text"
                        name="biz_no"
                        id="biz_no"
                        defaultValue={
                          dataInput5 !== "undefined / undefined / undefined"
                            ? dataInput5
                            : ""
                        }
                        // onChange={getInputSMS}
                        readOnly
                      />
                    </FormGroup>
                  </FormGroup>

                  <FormGroup className="fieldForm mt-3">
                    <Label className="labelBox">
                      <h5>?????? ??????</h5>
                    </Label>
                    <br />
                    <FormGroup check>
                      <Label check>
                        <Input
                          type="radio"
                          name="app_path"
                          value="1"
                          onChange={getInputVerifySMS}
                        />
                        ?????? ???????????? ?????? ??? ?????? ?????? ??? ?????? (?????? ??????
                        ?????????)
                      </Label>
                    </FormGroup>
                    <FormGroup check>
                      <Label check>
                        <Input
                          type="radio"
                          name="app_path"
                          value="2"
                          onChange={getInputVerifySMS}
                        />
                        ???????????? ?????? ?????? ?????? ??? ??????
                      </Label>
                    </FormGroup>

                    <FormGroup check>
                      <Label check>
                        <Input
                          type="radio"
                          name="app_path"
                          value="3"
                          onChange={getInputVerifySMS}
                        />
                        ??????
                      </Label>
                    </FormGroup>
                  </FormGroup>

                  <FormGroup className="fieldForm mt-3">
                    <Label className="labelBox" htmlFor="p_invoice_quantity">
                      <h5>?????? ??????????????? ??????</h5>
                      ????????? ????????? ????????? ?????????. ????????? 0?????? ????????? ?????????.
                    </Label>
                    <br />
                    <Input
                      type="number"
                      value={stateVerifyOtp?.p_invoice_quantity}
                      id="p_invoice_quantity"
                      name="p_invoice_quantity"
                      onChange={getInputVerifySMS}
                      onKeyPress={onNumberOnlyChange}
                      inputMode={"numeric"}
                      max={400}
                    />
                  </FormGroup>

                  <FormGroup className="fieldForm mt-3">
                    <Label className="labelBox">
                      <h5>?????? ??????</h5>
                      ????????? ????????? ?????? ?????? ?????? ?????? ???????????????.
                    </Label>
                    <Row>
                      <Col xs="4" sm="4">
                        <FormGroup>
                          <Input
                            type="select"
                            name="bank_real_id"
                            onChange={getInputVerifySMS}
                            id="exampleSelect"
                          >
                            <option value="">?????????</option>
                            {listBankData?.map((item) => (
                              <option key={item?.id} value={item?.real_id}>
                                {item?.bank_name}
                              </option>
                            ))}
                          </Input>
                        </FormGroup>
                      </Col>
                      <Col xs="8" sm="8">
                        <FormGroup>
                          <Input
                            type="text"
                            name="bank_no"
                            onChange={getInputVerifySMS}
                            placeholder="????????? ?????? ?????? ??????(?????????)"
                            value={stateVerifyOtp?.bank_no || ""}
                            onKeyPress={onNumberOnlyChange}
                            inputMode={"numeric"}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </FormGroup>

                  <FormGroup className="fieldForm mt-3">
                    <Label className="labelBox">
                      <h5>????????? ??????</h5>
                    </Label>
                    <br />
                    <FormGroup check>
                      <Label check>
                        <Input
                          type="radio"
                          name="mobile_vendor"
                          value="SKT"
                          onChange={getInputSMS}
                        />
                        SKT
                      </Label>
                    </FormGroup>
                    <FormGroup check>
                      <Label check>
                        <Input
                          type="radio"
                          name="mobile_vendor"
                          value="KTF"
                          onChange={getInputSMS}
                        />
                        KT
                      </Label>
                    </FormGroup>
                    <FormGroup check>
                      <Label check>
                        <Input
                          type="radio"
                          name="mobile_vendor"
                          value="LGT"
                          onChange={getInputSMS}
                        />
                        LG U+
                      </Label>
                    </FormGroup>
                    <FormGroup check>
                      <Label check>
                        <Input
                          type="radio"
                          name="mobile_vendor"
                          value="SKM"
                          onChange={getInputSMS}
                        />
                        ????????? (SKT)
                      </Label>
                    </FormGroup>
                    <FormGroup check>
                      <Label check>
                        <Input
                          type="radio"
                          name="mobile_vendor"
                          value="KTM"
                          onChange={getInputSMS}
                        />
                        ????????? (KT)
                      </Label>
                    </FormGroup>
                    <FormGroup check>
                      <Label check>
                        <Input
                          type="radio"
                          name="mobile_vendor"
                          value="LGM"
                          onChange={getInputSMS}
                        />
                        ????????? (LG U+)
                      </Label>
                    </FormGroup>
                  </FormGroup>

                  <FormGroup className="fieldForm">
                    <BusinessNumberBox
                      name="mobile_no"
                      setStateValue={setStateValue}
                      stateValue={stateValue}
                      defaultValue={stateSMS.mobile_no}
                      onChange={getInputSMS}
                    />
                  </FormGroup>

                  <FormGroup
                    className="fieldForm"
                    style={{ textAlign: "center", padding: "20px 0" }}
                  >
                    <Button
                      type="default"
                      className="buttonForm"
                      onClick={verifyCode}
                      style={{ width: "100%" }}
                      disabled={
                        stateSMS.biz_no === "" ||
                        stateSMS.mobile_no === "" ||
                        stateSMS.mobile_vendor === "" ||
                        stateVerifyOtp.app_path === "" ||
                        stateVerifyOtp.bank_real_id === "" ||
                        stateVerifyOtp.bank_no === "" ||
                        stateVerifyOtp.p_invoice_quantity === "" ||
                        stateValue.value1 === "" ||
                        stateValue.value2 === "" ||
                        stateValue.value3 === ""
                      }
                    >
                      <span style={{ fontSize: "17px" }}>???????????? ??????</span>
                    </Button>
                  </FormGroup>
                </Form>
                {/* 
                <FadeLoader
                  loading={loadingSendOtp}
                  css={override}
                  size={150}
                /> */}

                <Form>
                  <FormGroup className="fieldForm mt-3">
                    <Label className="labelBox" htmlFor="p_invoice_quantity">
                      <h5>???????????? ??????</h5>
                    </Label>
                    <br />
                    <Input
                      type="text"
                      placeholder="3??? ?????? ???????????? ??????"
                      onKeyPress={onNumberOnlyChange}
                      maxLength={6}
                      name="cert_no"
                      onChange={getInputVerifySMS}
                      defaultValue={stateVerifyOtp.cert_no}
                      inputMode={"numeric"}
                    />
                  </FormGroup>

                  <FormGroup
                    className="fieldForm"
                    style={{ textAlign: "center", padding: "20px 0" }}
                  >
                    <Button
                      type="default"
                      className="buttonForm"
                      onClick={completeApp}
                      style={{ width: "100%" }}
                      disabled={stateVerifyOtp.cert_no === ""}
                    >
                      <span style={{ fontSize: "17px" }}>?????? ????????????</span>
                    </Button>
                  </FormGroup>

                  {/* <FadeLoader
                    loading={loadingVerifyCode}
                    css={override}
                    size={150}
                  /> */}

                  <FormGroup>
                    <div style={{ padding: "20px 0" }}>
                      <div>
                        * ?????? ?????????????????? ?????? ????????? ?????? ?????? ????????? ?????????. 7???21???(???) ???????????? ?????? ?????? ???????????????.
                      </div>
                      <div>
                        (???)06103 ?????? ????????? ???????????? 317, 3010??? (???)??????????????????
                      </div>
                    </div>

                    <div style={{ paddingBottom: "50px" }}>
                      <div>
                        * ????????? ?????? ????????? ?????? ??? ????????? ??????????????? ?????????
                        ????????? ???????????? ??????????????? ???????????? ????????? ???????????????.
                      </div>
                    </div>
                  </FormGroup>

                  <FormGroup
                    className="fieldForm"
                    style={{ textAlign: "center", padding: "20px 0" }}
                  >
                    <div>
                      <b>(???)??????????????????</b><br />
                      ????????????????????? 481-87-02192 ???????????? ?????????<br />
                      ?????????: contact@taxassoft.com<br />
                      ????????????: <a href="http://pf.kakao.com/_MxaxieK/chat">??????????????????</a><br />
                      Copyright ?? TAXASSOFT Corp. All rights reserved.
                    </div>
                  </FormGroup>

                </Form>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}
