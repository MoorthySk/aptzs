import React from "react";
import Sidebar from "react-sidebar";
import EmailList from "./EmailList";
import EmailSidebarContent from "./EmailSidebar";
import { ContextLayout } from "../../../utility/context/Layout";
import ComposeMail from "./ComposeEmail";
import "../../../assets/scss/pages/app-email.scss";
const mql = window.matchMedia(`(min-width: 992px)`);
class Email extends React.Component {
  state = {
    composeMailStatus: false,
    sidebarDocked: mql.matches,
    sidebarOpen: false,
  };
  handleComposeSidebar = (status) => {
    if (status === "open") {
      this.setState({
        composeMailStatus: true,
      });
    } else {
      this.setState({
        composeMailStatus: false,
      });
    }
  };

  UNSAFE_componentWillMount() {
    mql.addListener(this.mediaQueryChanged);
  }

  componentWillUnmount() {
    mql.removeListener(this.mediaQueryChanged);
  }

  onSetSidebarOpen = (open) => {
    this.setState({ sidebarOpen: open });
  };

  mediaQueryChanged = () => {
    this.setState({ sidebarDocked: mql.matches, sidebarOpen: false });
  };

  handleMainAndComposeSidebar = () => {
    this.handleComposeSidebar("close");
    this.onSetSidebarOpen(false);
  };

  render() {
    return (
      <div className="email-application position-relative">
        <div
          className={`app-content-overlay ${
            this.state.composeMailStatus || this.state.sidebarOpen ? "show" : ""
          }`}
          onClick={this.handleMainAndComposeSidebar}
        />

        <EmailList
          mainSidebar={this.onSetSidebarOpen}
          routerProps={this.props}
          handleComposeSidebar={this.handleComposeSidebar}
        />
        <ComposeMail
          handleComposeSidebar={this.handleComposeSidebar}
          currentStatus={this.state.composeMailStatus}
        />
      </div>
    );
  }
}
export default Email;
