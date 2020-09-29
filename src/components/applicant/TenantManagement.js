import React from "react";
import axios from "axios";
import {
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Card,
  CardBody,
} from "reactstrap";
import classnames from "classnames";
import { Settings, Lock, Info, Bell } from "react-feather";
import GeneralTab from "./General";
import ChangePassword from "./ChangePassword";
import ApplicantForm from "./ApplicantForm";
import Notifications from "./Notifications";
import ApplicantApproval from "./ApplicantApproval";
import CheckList from "./checklist/CheckList";
import Breadcrumbs from "../../components/@vuexy/breadCrumbs/BreadCrumb";
import "../../assets/scss/pages/account-settings.scss";
import { green } from "@material-ui/core/colors";
import { PlaylistAddCheck } from "@material-ui/icons";
class TenantManagement extends React.Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      applicantId: this.props.match.params.appReqId,
      activeTab: "1",
      windowWidth: null,
      data: null,
    };
  }

  toggle = (tab) => {
    this.setState({
      activeTab: tab,
    });
  };

  updateWidth = () => {
    this.setState({ windowWidth: window.innerWidth });
  };

  async componentDidMount() {
    if (window !== undefined) {
      this.updateWidth();
      window.addEventListener("resize", this.updateWidth);
    }
    this._isMounted = true;
    var applicantStatus = "";
    var responseCode = "";

    await axios
      .post("/lease/app-search-byid/", {
        appReqstId: this.state.applicantId,
      })

      .then((response) => {
        responseCode = response.data.responseCode;
        applicantStatus = response.data.appInfo.applicantStatus;
        console.log("applicantStatus:::::::::::::" + applicantStatus);
        if (this._isMounted) {
          this.setState({
            applicantStatus: applicantStatus,
          });
        }
      })
      .catch((error) => {
        console.log("Concurrent Login Issue:::" + error);
        this.componentDidMount();
      });
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  render() {
    let { windowWidth } = this.state;
    return (
      <React.Fragment>
        <Breadcrumbs
          breadCrumbTitle="Leasing Process"
          breadCrumbParent="Applicant"
          breadCrumbActive="Summary"
        />
        <div
          className={`${
            windowWidth >= 769 ? "nav-vertical" : "account-setting-wrapper"
          }`}
        >
          <Nav className="account-settings-tab nav-left mr-0 mr-sm-3" tabs>
            <NavItem>
              <NavLink
                className={classnames({
                  active: this.state.activeTab === "1",
                })}
                onClick={() => {
                  this.toggle("1");
                }}
              >
                <PlaylistAddCheck size={16} />
                <span className="d-md-inline-block d-none align-middle ml-1">
                  Check List
                </span>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({
                  active: this.state.activeTab === "2",
                })}
                onClick={() => {
                  this.toggle("2");
                }}
              >
                <Settings size={16} />

                {this.state.applicantStatus === "Approved" ? (
                  <span className="d-md-inline-block d-none align-middle ml-1">
                    General
                  </span>
                ) : (
                  <span className="d-md-inline-block d-none align-middle ml-1">
                    Applicant Status
                  </span>
                )}
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({
                  active: this.state.activeTab === "3",
                })}
                onClick={() => {
                  this.toggle("3");
                }}
              >
                <Lock size={16} />
                <span className="d-md-inline-block d-none align-middle ml-1">
                  Change Password
                </span>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({
                  active: this.state.activeTab === "4",
                })}
                onClick={() => {
                  this.toggle("4");
                }}
              >
                <Info size={16} />
                <span className="d-md-inline-block d-none align-middle ml-1">
                  Applicant Form
                </span>
              </NavLink>
            </NavItem>

            <NavItem>
              <NavLink
                className={classnames({
                  active: this.state.activeTab === "5",
                })}
                onClick={() => {
                  this.toggle("5");
                }}
              >
                <Bell size={16} />
                <span className="d-md-inline-block d-none align-middle ml-1">
                  Notifications
                </span>
              </NavLink>
            </NavItem>
          </Nav>
          <Card>
            <CardBody>
              <TabContent activeTab={this.state.activeTab}>
                <TabPane tabId="1">
                  <CheckList applicantId={this.state.applicantId} />
                </TabPane>
                <TabPane tabId="2">
                  <ApplicantApproval applicantId={this.state.applicantId} />
                </TabPane>

                <TabPane tabId="3">
                  <ChangePassword />
                </TabPane>
                <TabPane tabId="4">
                  <ApplicantForm applicantId={this.state.applicantId} />
                </TabPane>
                <TabPane tabId="5">
                  <Notifications />
                </TabPane>
              </TabContent>
            </CardBody>
          </Card>
        </div>
      </React.Fragment>
    );
  }
}

export default TenantManagement;
