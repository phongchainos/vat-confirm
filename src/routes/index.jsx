import React, { useEffect } from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import FormVat from "../components/TaxasReturnVat/index";
import DownLoad from "../components/DownLoad/DownLoad"
import DownLoad2 from "../components/DownLoad/DownLoad2";

export default function RouteURL() {
  return (
    <Switch>
      <Route exact path="/result/:filename">
        <DownLoad />
      </Route>
      <Route exact path="/realResult/:filename">
        <DownLoad2 />
      </Route>
      <Route path="/Home">
        <FormVat />
      </Route>
      <Route path="/">
        <Redirect to={'/Home'} />
      </Route>
      )
    </Switch>
  );
}
