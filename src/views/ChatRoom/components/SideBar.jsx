import React, { useContext } from "react";
import { Button, Menu } from "antd";
import classes from "../../../scss/sidebar.module.scss";
import { AppContext } from "../../../component/ContextProvider";
import styled from "styled-components";

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

export const SideBar = () => {
  const { setVisible, roomItem, setRoomId } = useContext(AppContext);

  const onClick = (e) => {
    setRoomId(e.key);
  };

  const getItemMenu = roomItem.map((item) => {
    return getItem(item.name, item.id);
  });

  const handleAddRoom = () => {
    setVisible(true);
  };

  return (
    <div className={classes.sidebar}>
      <div className={classes.sidebarHeader}>
        <img src={require("../../../img/logo.jpg")} alt="" />
        <span style={{ fontSize: "20px", fontWeight: "bold" }}>ChatUnity </span>
      </div>
      {
        <MenuStyle
          className={classes.sidebarMenu}
          onClick={onClick}
          defaultOpenKeys={["sub1"]}
          mode="inline"
          items={[getItem("Chat room list", "sub1", null, getItemMenu)]}
        />
      }
      <Button className={classes.buttonAddRoom} onClick={handleAddRoom}>
        Add room
      </Button>
    </div>
  );
};

const MenuStyle = styled(Menu)`
  .ant-menu-sub.ant-menu-inline {
    height: calc(100vh - 180px) !important;
    overflow-y: auto !important;
    overflow-x: clip !important;
  }

  ::-webkit-scrollbar {
    width: 10px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px #ccc;
    border-radius: 10px;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 10px;
  }
`;
