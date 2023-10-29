import { LogoutOutlined, UserAddOutlined } from "@ant-design/icons";
import { Avatar, Button, Popover, Tooltip } from "antd";
import React, { useContext, useState } from "react";
import classes from "../../../scss/headerMain.module.scss";
import { arrayRemove, doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";
import { AppContext } from "../../../component/ContextProvider";

export const HeaderMain = () => {
  const {
    selectionRoom,
    userInRoom,
    userRoot,
    setIsInviteMemberVisible,
    roomId,
  } = useContext(AppContext);

  const [visible, setVisible] = useState(false);

  const handleVisibleChange = (newVisible) => {
    setVisible(newVisible);
  };

  const handleOutRooom = async () => {
    const [{ ...userHost }] = userRoot;
    await updateDoc(doc(db, "rooms", roomId), {
      members: arrayRemove(userHost.uid),
    });
    setVisible(false);
  };
  return (
    <header className={classes.header}>
      <Popover
        content={
          <Button className={classes.outRoom} onClick={handleOutRooom}>
            Out Room
          </Button>
        }
        placement="right"
        title="You want to out room!"
        trigger="click"
        visible={visible}
        onVisibleChange={handleVisibleChange}
      >
        <Button className={classes.button}>
          {selectionRoom.name} <LogoutOutlined />
        </Button>
      </Popover>

      <div className={classes.invite}>
        <Button onClick={() => setIsInviteMemberVisible(true)}>
          <UserAddOutlined />
          Invite
        </Button>
        <Avatar.Group maxCount={2} size="middle">
          {userInRoom.map((user, index) => {
            return (
              <Tooltip
                title={user.displayName}
                key={user.id}
                placement="bottom"
              >
                <Avatar style={{ background: `${user.avatar}` }}>
                  {user.displayName.charAt(0).toUpperCase()}
                </Avatar>
              </Tooltip>
            );
          })}
        </Avatar.Group>
      </div>
    </header>
  );
};
