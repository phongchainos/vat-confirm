/* eslint-disable no-useless-escape */
import React, { useRef } from "react";
import { Label, Input, Row, Col } from "reactstrap";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faCircle } from "@fortawesome/free-solid-svg-icons";
import "./index.css";

export default function BusinessNumberBox({ stateValue, setStateValue }) {
  const ref = useRef(null);
  const ref1 = useRef(null);

  const onChange = (e) => {
    if (e.target.value.length === 3 && e.target.name === "value1") {
      ref.current.focus();
    } else if (e.target.value.length === 4 && e.target.name === "value2") {
      ref1.current.focus();
    } else {
    }
    setStateValue({
      ...stateValue,
      [e.target.name]: e.target.value,
    });
  };

  const onNumberOnlyChange = (event) => {
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
      <Label className="labelBox mt-3" htmlFor="value1">
        <h5>휴대폰 번호</h5>
      </Label>
      <br />
      <Row>
        <Col xs="4" sm="4">
          <Input
            id="value1"
            name="value1"
            defaultValue={stateValue.value1}
            onChange={onChange}
            type="text"
            className="elmInputNumber"
            maxLength={3}
            onKeyPress={onNumberOnlyChange}
            inputMode={"numeric"}
          />
        </Col>
        <Col xs="4" sm="4">
          <Input
            defaultValue={stateValue.value2}
            name="value2"
            innerRef={ref}
            onChange={onChange}
            type="text"
            className="elmInputNumber"
            maxLength={4}
            onKeyPress={onNumberOnlyChange}
            inputMode={"numeric"}
          />
        </Col>
        <Col xs="4" sm="4">
          <Input
            defaultValue={stateValue.value3}
            onChange={onChange}
            name="value3"
            innerRef={ref1}
            type="text"
            className="elmInputNumber"
            maxLength={4}
            onKeyPress={onNumberOnlyChange}
            inputMode={"numeric"}
          />
        </Col>
      </Row>
    </>
  );
}
