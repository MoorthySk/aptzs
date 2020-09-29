import React from "react";
import { Link } from "react-router-dom";
import classnames from "classnames";
import navigationConfig from "../../../../../configs/navigationConfig";
import SideMenuGroup from "./SideMenuGroup";
import { Badge } from "reactstrap";
import { ChevronRight } from "react-feather";
import RbacList from "../../../../../configs/RbacList";
//import { FormattedMessage } from 'react-intl'
import { history } from "../../../../../history";

class SideMenuContent extends React.Component {
  constructor(props) {
    super(props);

    this.parentArr = [];
    this.collapsedPath = null;
    this.redirectUnauthorized = () => {
      history.push("/misc/not-authorized");
    };
  }
  state = {
    flag: true,
    isHovered: false,
    activeGroups: [],
    currentActiveGroup: [],
    tempArr: [],
  };

  handleGroupClick = (id, parent = null, type = "") => {
    let openGgroup = this.state.activeGroups;
    let activeGgroup = this.state.currentActiveGroup;
    let tempArr = this.state.tempArr;
    // Active Group to apply sidebar-group-active class
    if (type === "item" && parent === null) {
      activeGgroup = [];
      tempArr = [];
    } else if (type === "item" && parent !== null) {
      activeGgroup = [];
      if (tempArr.includes(parent)) {
        tempArr.splice(tempArr.indexOf(parent) + 1, tempArr.length);
      } else {
        tempArr = [];
        tempArr.push(parent);
      }
      activeGgroup = tempArr.slice(0);
    } else if (type === "collapse" && parent === null) {
      tempArr = [];
      tempArr.push(id);
    } else if (type === "collapse" && parent !== null) {
      if (activeGgroup.includes(parent)) {
        tempArr = activeGgroup.slice(0);
      }
      if (tempArr.includes(id)) {
        // tempArr.splice(tempArr.indexOf(id), 1)
        tempArr.splice(tempArr.indexOf(id), tempArr.length);
      } else {
        tempArr.push(id);
      }
    } else {
      tempArr = [];
    }

    if (type === "collapse") {
      // If open group does not include clicked group item
      if (!openGgroup.includes(id)) {
        // Get unmatched items that are not in the active group
        let temp = openGgroup.filter(function (obj) {
          return activeGgroup.indexOf(obj) === -1;
        });
        // Remove those unmatched items from open group
        if (temp.length > 0 && !openGgroup.includes(parent)) {
          openGgroup = openGgroup.filter(function (obj) {
            return !temp.includes(obj);
          });
        }
        if (openGgroup.includes(parent) && activeGgroup.includes(parent)) {
          openGgroup = activeGgroup.slice(0);
        }
        // Add group item clicked in open group
        if (!openGgroup.includes(id)) {
          openGgroup.push(id);
        }
      } else {
        // If open group includes click group item, remove it from open group
        openGgroup.splice(openGgroup.indexOf(id), 1);
      }
    }
    if (type === "item") {
      openGgroup = activeGgroup.slice(0);
    }

    this.setState({
      activeGroups: openGgroup,
      tempArr: tempArr,
      currentActiveGroup: activeGgroup,
    });
  };

  initRender = (parentArr) => {
    this.setState({
      activeGroups: parentArr.slice(0),
      currentActiveGroup: parentArr.slice(0),
      flag: false,
    });
  };

  componentDidMount() {
    this.initRender(this.parentArr[0] ? this.parentArr[0] : []);
    RbacList.rbacMenuList();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.activePath !== this.props.activePath) {
      if (this.collapsedMenuPaths !== null) {
        this.props.collapsedMenuPaths(this.collapsedMenuPaths);
      }

      this.initRender(
        this.parentArr[0] ? this.parentArr[this.parentArr.length - 1] : []
      );
    }
  }

  render() {
    // Loop over sidebar items
    // eslint-disable-next-line
    const menuItems = navigationConfig.map((item) => {
      const CustomAnchorTag = item.type === "external-link" ? `a` : Link;
      // checks if item has groupheader
      if (item.type === "groupHeader") {
        return (
          <li
            className="navigation-header"
            key={`group-header-${item.groupTitle}`}
          >
            <span>{item.groupTitle}</span>
          </li>
        );
      }
      if (
        item.navLink &&
        item.collapsed !== undefined &&
        item.collapsed === true
      ) {
        this.collapsedPath = item.navLink;
        this.props.collapsedMenuPaths(item.navLink);
      }

      if (
        item.permissions !== undefined &&
        !item.permissions.includes(localStorage.getItem("roleName")) &&
        item.navLink === this.props.activePath
      ) {
        return this.redirectUnauthorized();
      } else if (
        (item.permissions !== undefined &&
          item.permissions.includes(localStorage.getItem("roleName"))) ||
        item.permissions === undefined
      ) {
        return (
          <li
            className={classnames("nav-item", {
              "has-sub": item.type === "collapse",
              open: this.state.activeGroups.includes(item.id),
              "sidebar-group-active": this.state.currentActiveGroup.includes(
                item.id
              ),
              hover: this.props.hoverIndex === item.id,
              active:
                (this.props.activeItemState === item.navLink &&
                  item.type === "item") ||
                (item.parentOf &&
                  item.parentOf.includes(this.props.activeItemState)),
              disabled: item.disabled,
            })}
            key={item.id}
            onClick={(e) => {
              e.stopPropagation();
              if (item.type === "item") {
                this.props.handleActiveItem(item.navLink);
                this.handleGroupClick(item.id, null, item.type);
                if (this.props.deviceWidth <= 1200 && item.type === "item") {
                  this.props.toggleMenu();
                }
              } else {
                this.handleGroupClick(item.id, null, item.type);
              }
            }}
          >
            <CustomAnchorTag
              to={
                item.filterBase
                  ? item.filterBase
                  : item.navLink && item.type === "item"
                  ? item.navLink
                  : ""
              }
              href={item.type === "external-link" ? item.navLink : ""}
              className={"d-flex justify-content-between align-items-center"}
              onMouseEnter={() => {
                this.props.handleSidebarMouseEnter(item.id);
              }}
              onMouseLeave={() => {
                this.props.handleSidebarMouseEnter(item.id);
              }}
              key={item.id}
              onClick={(e) => {
                return item.type === "collapse" ? e.preventDefault() : "";
              }}
              target={item.newTab ? "_blank" : undefined}
            >
              <div className="menu-text d-flex align-items-center">
                {item.icon}
                <span className="menu-item menu-title">{item.title}</span>
              </div>

              {item.badge ? (
                <div className="menu-badge">
                  <Badge color={item.badge} className="mr-1" pill>
                    {item.badgeText}
                  </Badge>
                </div>
              ) : (
                ""
              )}
              {item.type === "collapse" ? (
                <ChevronRight className="menu-toggle-icon" size={13} />
              ) : (
                ""
              )}
            </CustomAnchorTag>
            {item.type === "collapse" ? (
              <SideMenuGroup
                group={item}
                handleGroupClick={this.handleGroupClick}
                activeGroup={this.state.activeGroups}
                handleActiveItem={this.props.handleActiveItem}
                activeItemState={this.props.activeItemState}
                handleSidebarMouseEnter={this.props.handleSidebarMouseEnter}
                activePath={this.props.activePath}
                hoverIndex={this.props.hoverIndex}
                initRender={this.initRender}
                parentArr={this.parentArr}
                triggerActive={undefined}
                currentActiveGroup={this.state.currentActiveGroup}
                permission={this.props.permission}
                currentUser={localStorage.getItem("roleName")}
                redirectUnauthorized={this.redirectUnauthorized}
                collapsedMenuPaths={this.props.collapsedMenuPaths}
                toggleMenu={this.props.toggleMenu}
                deviceWidth={this.props.deviceWidth}
                parentPermission={this.parentPermission}
              />
            ) : (
              ""
            )}
          </li>
        );
      } else {
        if (
          item.permissions &&
          !item.permissions.includes(localStorage.getItem("roleName")) &&
          item.children
        ) {
          item.children.forEach((i) => {
            if (i.navLink === this.props.activePath) {
              this.redirectUnauthorized();
            }
          });
        }
      }
    });
    return <React.Fragment>{menuItems}</React.Fragment>;
  }
}
export default SideMenuContent;
