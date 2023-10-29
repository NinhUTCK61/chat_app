import { Avatar, Badge, Dropdown, Empty, Menu, Typography } from "antd";
import React, { useContext } from "react";
import {
  AppContext,
  AuthContext,
  ChatContext,
} from "../../../component/ContextProvider";
import { arrayRemove, doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";
import { formatDate } from "../../../utils";
import { NotificationFilled, BellOutlined } from "@ant-design/icons";
import classes from "../../../scss/mentionNotify.module.scss";

export const MentionNotify = () => {
  const { user } = useContext(AuthContext);
  const { setMentionId, messagesMentionUser } = useContext(ChatContext);
  const { setRoomId } = useContext(AppContext);

  const readMentionNotify = async (e) => {
    setRoomId(e.roomId);
    setMentionId(e.id);
    await updateDoc(doc(db, "messages", e.id), {
      mention: arrayRemove(user.uid),
    });
  };

  return (
    <Dropdown
      placement="bottom"
      overlay={
        <Menu
          items={
            messagesMentionUser.length !== 0
              ? messagesMentionUser.map((item, index) => {
                  return {
                    key: index,
                    label: (
                      <Typography.Link
                        onClick={() => {
                          readMentionNotify({
                            id: item.id,
                            roomId: item.roomId,
                          });
                        }}
                      >
                        <div className={classes.menuNotify}>
                          <span className={classes.textName}>{item.name}</span>
                          <span className={classes.textTime}>
                            {formatDate(item.createdAt.seconds)}
                          </span>
                        </div>
                        <div style={{ paddingLeft: "8px" }}>
                          <NotificationFilled style={{ color: "#ffe000" }} />
                          <span className={classes.textMessage}>
                            {item.text}
                          </span>
                        </div>
                      </Typography.Link>
                    ),
                  };
                })
              : [
                  {
                    key: 1,
                    label: <Empty />,
                  },
                ]
          }
        />
      }
    >
      <Badge count={messagesMentionUser.length} overflowCount={10}>
        <Avatar
          className={classes.avatar}
          shape="square"
          size="middle"
          icon={<BellOutlined />}
        />
      </Badge>
    </Dropdown>
  );
};
