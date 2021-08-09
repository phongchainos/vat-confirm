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
            confirm: "확인",
            cancel: "취소",
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
        title: "종이 세금계산서는 400장 까지 처리가 가능합니다.",
        icon: "error",
        buttons: {
          confirm: "확인",
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
        title: "아래 내용 입력을 진행해주세요.",
        icon: "error",
        buttons: {
          confirm: "확인",
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
              confirm: "확인",
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
              confirm: "확인",
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
      swal("아래 내용 입력을 진행해주세요.", "", "error", {
        closeOnClickOutside: false,
        closeOnEsc: false,
        buttons: { confirm: { text: "확인", value: true, className: "btn" } },
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
              confirm: "확인",
            },
          });
        } else if (res && res.action === "refresh-page") {
          swal({
            title: res.message,
            button: {
              confirm: "확인",
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
              confirm: "확인",
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
        title: "아래 내용 입력을 진행해주세요.",
        icon: "error",
        buttons: {
          confirm: "확인",
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
              confirm: "확인",
            },
          });
        } else if (res && res.action === "refresh-page") {
          swal({
            title: res.message,
            button: {
              confirm: "확인",
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
              confirm: "확인",
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
                <h3>택사스노트 부가세 신고 서비스</h3>
                <p>
                  <br />
                  화물운수업 사업자를 위한 부가세 신고 대리 서비스입니다.
                  <br />
                  입력 및 신청이 완료되면 등록하신 <b>휴대폰 번호로 안내 메시지가 발송</b>됩니다.
                  <br />
                  홈택스에 등록하신 사업용카드/화물운전자복지카드 외 추가로 보유하신 <b>개인카드 내역 처리는 불가능</b>하오니 신청시 참고해 주세요.
                  <br />
                  홈택스 아이디 비밀번호가 없으시면{" "}
                  <a href="https://hometax.go.kr" target="_blank">
                    홈택스가입
                  </a>{" "}
                  후 진행해 주세요.
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
                    <h5>전체 동의하기</h5>
                  </Label>
                </FormGroup>

                <FormGroup check>
                  <Label check>
                    <Input
                      type="checkbox"
                      name="acceptLaw"
                      onChange={getValueInput}
                      checked={state.acceptLaw}
                      data-title="이용약관"
                    />
                    이용약관
                  </Label>
                </FormGroup>

                <FormGroup check>
                  <Label check>
                    <Input
                      type="checkbox"
                      name="acceptInfo"
                      onChange={getValueInput}
                      checked={state.acceptInfo}
                      data-title="개인정보처리방침"
                    />
                    개인정보 처리방침
                  </Label>
                </FormGroup>

                <FormGroup check>
                  <Label>
                    <Input
                      type="checkbox"
                      name="more"
                      onChange={getValueInput}
                      checked={state.more}
                      data-title="개인정보수집 및 이용동의서"
                    />
                    개인정보수집 및 이용동의서
                  </Label>
                </FormGroup>

                <FormGroup check>
                  <Label>
                    <Input
                      type="checkbox"
                      name="ruleInfo"
                      onChange={getValueInput}
                      checked={state.ruleInfo}
                      data-title="개인정보 제3자 제공동의서"
                    />
                    개인정보 제3차 제공동의서
                  </Label>
                </FormGroup>

                <FormGroup check>
                  <Label>
                    <Input
                      type="checkbox"
                      name="contract"
                      onChange={getValueInput}
                      checked={state.contract}
                      data-title="세무대리계약서"
                    />
                    세무대리 계약서
                  </Label>
                </FormGroup>

                <FormGroup check>
                  <Label>
                    <Input
                      type="checkbox"
                      name="taxOffice"
                      onChange={getValueInput}
                      checked={state.taxOffice}
                      data-title="세무법인 개인정보처리방침"
                    />
                    세무법인 개인정보처리방침
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
                      <h5>홈택스 아이디</h5>
                    </Label>
                    <br />
                    <Input
                      type="text"
                      name="hometax_id"
                      placeholder="영문 대소문자 구분하여 입력해 주세요."
                      id="idHomeTax"
                      onChange={getValueInput}
                      defaultValue={state.hometax_id}
                      required={true}
                    />
                  </FormGroup>
                  <FormGroup className="fieldForm mt-3">
                    <Label className="labelBox" htmlFor="hometax_pw">
                      <h5>홈택스 비밀번호</h5>
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
                        신고가능 여부 확인하기
                      </span>
                    </Button>
                  </FormGroup>
                </Form>

                <Form>
                  <FormGroup className="fieldForm mt-3">
                    <Label className="labelBox" htmlFor="businessComparison">
                      <h5>사업자 정보 확인</h5>
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
                      <h5>신청 경로</h5>
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
                        인성 프로그램 공지 및 문자 확인 후 신청 (인성 소속
                        기사님)
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
                        화물마루 카페 공지 확인 후 신청
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
                        기타
                      </Label>
                    </FormGroup>
                  </FormGroup>

                  <FormGroup className="fieldForm mt-3">
                    <Label className="labelBox" htmlFor="p_invoice_quantity">
                      <h5>종이 세금계산서 수량</h5>
                      정확한 숫자를 입력해 주세요. 없으면 0으로 입력해 주세요.
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
                      <h5>환급 계좌</h5>
                      부가세 환급이 있는 경우 입금 받을 계좌입니다.
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
                            <option value="">은행명</option>
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
                            placeholder="신청자 명의 계좌 번호(숫자만)"
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
                      <h5>통신사 선택</h5>
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
                        알뜰폰 (SKT)
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
                        알뜰폰 (KT)
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
                        알뜰폰 (LG U+)
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
                      <span style={{ fontSize: "17px" }}>인증번호 받기</span>
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
                      <h5>인증번호 확인</h5>
                    </Label>
                    <br />
                    <Input
                      type="text"
                      placeholder="3분 이내 인증번호 입력"
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
                      <span style={{ fontSize: "17px" }}>신청 완료하기</span>
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
                        * 종이 세금계산서는 아래 주소로 등기 우편 발송해 주세요. 7월21일(수) 도착분에 한해 신고 가능합니다.
                      </div>
                      <div>
                        (우)06103 서울 강남구 봉은사로 317, 3010호 (주)택사스소프트
                      </div>
                    </div>

                    <div style={{ paddingBottom: "50px" }}>
                      <div>
                        * 부가세 신청 페이지 입력 중 오류가 발생했거나 궁금한
                        사항이 있으시면 이메일이나 카카오톡 채널로 문의주세요.
                      </div>
                    </div>
                  </FormGroup>

                  <FormGroup
                    className="fieldForm"
                    style={{ textAlign: "center", padding: "20px 0" }}
                  >
                    <div>
                      <b>(주)택사스소프트</b><br />
                      사업자등록번호 481-87-02192 대표이사 박일용<br />
                      이메일: contact@taxassoft.com<br />
                      카카오톡: <a href="http://pf.kakao.com/_MxaxieK/chat">카카오톡채널</a><br />
                      Copyright © TAXASSOFT Corp. All rights reserved.
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
