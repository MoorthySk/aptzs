import React from "react";
import * as Icon from "react-feather";
import {
  Accessibility,
  AcUnitSharp,
  Dashboard,
  SupervisorAccount,
  BusinessTwoTone,
  EmojiTransportationTwoTone,
  SupervisedUserCircleTwoTone,
  AccessibilityNew,
  FormatListBulletedRounded,
  GroupAddRounded,
  DeckRounded,
  ChatSharp,
  PaymentTwoTone,
  SportsKabaddiTwoTone,
  HomeWork,
  AssignmentTurnedIn,
  AssignmentInd,
  GroupWork,
  PeopleAltOutlined,
  Payment,
  DirectionsCar,
  CheckBoxOutlined,
  AppsOutlined,
} from "@material-ui/icons";
const permissionList = [
  "Admin",
  "CEO",
  "sendu",
  "Manager",
  "Founder",
  "Technical Arc",
];

const horizontalMenuConfig = [
  {
    id: "dashboard",
    title: "Dashboard",
    type: "dropdown",
    icon: <Icon.Home size={16} />,
    children: [
      {
        id: "analyticsDash",
        title: "Analytics",
        type: "item",
        icon: <Icon.Circle size={10} />,
        navLink: "/",
        permissions: ["admin", "editor"],
      },
      {
        id: "dashboard1",
        title: "Dashboard 1",
        type: "item",
        icon: <Icon.Circle size={12} color="primary" />,
        permissions: ["admin", "editor"],
        navLink: "/mainDashboard",
      },
      {
        id: "eCommerceDash",
        title: "eCommerce",
        type: "item",
        icon: <Icon.Circle size={10} />,
        navLink: "/ecommerce-dashboard",
        permissions: ["admin"],
      },
    ],
  },
  {
    id: "maintReq",
    title: "Service Request",
    type: "item",
    icon: <Icon.File size={20} />,
    permissions: permissionList,
    navLink: "/maintReq",
  },
  //Tenant Maintanance Request
  {
    id: "User",
    title: "User",
    type: "item",
    icon: <Icon.File size={20} />,
    permissions: ["admin", "editor"],
    navLink: "/User",
  },
  // User Master

  {
    id: "useradd",
    title: "User Master",
    type: "item",
    icon: <Icon.User size={20} />,
    permissions: ["admin", "editor"],
    navLink: "/useradd",
  },

  {
    id: "roleadd",
    title: "Role Master",
    type: "item",
    icon: <Icon.User size={20} />,
    permissions: ["admin", "editor"],
    navLink: "/roleadd",
  },
];

export default horizontalMenuConfig;
