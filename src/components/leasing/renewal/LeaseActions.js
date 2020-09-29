import React, { Component } from "react";

import {
  UncontrolledButtonDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
} from "reactstrap";
import { ChevronDown } from "react-feather";
export default class LeaseActions extends Component {
  constructor(props) {
    super(props);

    this.invokeParentMethod = this.invokeParentMethod.bind(this);
  }
  invokeParentMethod() {
    console.log("action");
  }
  render() {
    return (
      <React.Fragment>
        <div className="dropdown mr-1 mb-1 d-inline-block">
          <UncontrolledButtonDropdown>
            <DropdownToggle outline color="primary" caret>
              Primary
              <ChevronDown size={15} />
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem tag="a">Option 1</DropdownItem>
              <DropdownItem tag="a">Option 2</DropdownItem>
              <DropdownItem tag="a">Option 3</DropdownItem>
            </DropdownMenu>
          </UncontrolledButtonDropdown>
        </div>
      </React.Fragment>
    );
  }
}
