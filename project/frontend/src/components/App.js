import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";

import DataProvider from "./DataProvider";
import Table from "./Table";
import Form from "./Form";

const App = () => (
    <Fragment>
      <DataProvider endpoint="api/lead/"
                    render={data => <Table data={data} />} />
      <Form endpoint="api/lead/" />
    </Fragment>
);


const wrapper = document.getElementById("app");

wrapper ? ReactDOM.render(<App/>, wrapper) : null;
