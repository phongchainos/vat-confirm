/* eslint-disable no-useless-escape */
import React, { useRef } from "react";
import { Label, Input, Row, Col } from "reactstrap";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faCircle } from "@fortawesome/free-solid-svg-icons";
import "./index.css";

export default function BizNo({ bizNoData, setBizNoData }) {
  const ref1 = useRef(null);
  const ref = useRef(null);

  const onChangeNumber = (e) => {
    if (e.target.value.length === 3 && e.target.name === "number1") {
      ref.current.focus();
    } else if (e.target.value.length === 2 && e.target.name === "number2") {
      ref1.current.focus();
    } else {
    }

    setBizNoData({
      ...bizNoData,
      [e.target.name]: e.target.value,
    });
  };

  const onNumberOnlyChanges = (event) => {
    const keyCode = event.keyCode || event.which;
    const keyValue = String.fromCharCode(keyCode);
    const isValid = new RegExp("[0-9]").test(keyValue);
    if (!isValid) {
      event.preventDefault();
      return;
    }
  };

  return (
    <>
      <Label className="labelBoxBiz" htmlFor="number1">
        <h5>사업자 등록번호</h5>
      </Label>
      <br />
      <Row>
        <Col xs="4" sm="4">
          <Input
            id="number1"
            name="number1"
            innerRef={ref1}
            defaultValue={bizNoData.number1}
            onChange={onChangeNumber}
            type="text"
            className="elmInputNumber"
            maxLength={3}
            onKeyPress={onNumberOnlyChanges}
            required={true}
            inputMode={"numeric"}
          />
        </Col>
        <Col xs="4" sm="4">
          {" "}
          <Input
            // value={bizNoData.number2}
            name="number2"
            onChange={onChangeNumber}
            defaultValue={bizNoData.number2}
            innerRef={ref}
            type="text"
            className="elmInputNumber"
            maxLength={2}
            onKeyPress={onNumberOnlyChanges}
            required={true}
            inputMode={"numeric"}
          />
        </Col>
        <Col xs="4" sm="4">
          <Input
            // value={bizNoData.number3}
            defaultValue={bizNoData.number3}
            onChange={onChangeNumber}
            innerRef={ref1}
            className="elmInputNumber"
            name="number3"
            type="text"
            maxLength={5}
            onKeyPress={onNumberOnlyChanges}
            required={true}
            inputMode={"numeric"}
          />
        </Col>
      </Row>
    </>
  );
}
