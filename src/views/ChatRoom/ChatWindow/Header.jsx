import React, { useContext } from "react";
import { MentionNotify } from "./MentionNotify";
import { Avatar, Button, Popover, Typography } from "antd";
import { auth } from "../../../firebase/firebaseConfig";
import { AppContext } from "../../../component/ContextProvider";
import classes from "../../../scss/header.module.scss";

export const Header = () => {
  const { userRoot } = useContext(AppContext);

  const content = (
    <div>
      <Typography.Title
        level={5}
        style={{ whiteSpace: "nowrap", textOverflow: "ellipsis" }}
      >
        {userRoot[0]?.displayName}
      </Typography.Title>
      <Button style={{ color: "red" }} onClick={() => auth.signOut()}>
        Log Out
      </Button>
    </div>
  );

  return (
    <header className={classes.header}>
      <MentionNotify />
      <Popover placement="bottomRight" content={content}>
        <Avatar
          size="large"
          className={classes.avatar}
          style={{
            background: `${userRoot[0]?.avatar}`,
          }}
        >
          {userRoot[0]?.displayName.charAt(0).toUpperCase()}
        </Avatar>
      </Popover>
    </header>
  );
};
