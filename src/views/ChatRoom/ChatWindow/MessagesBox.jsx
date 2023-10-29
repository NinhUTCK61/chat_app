import React, { useContext, useState } from "react";
import { AuthContext, ChatContext } from "../../../component/ContextProvider";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";
import { formatDate } from "../../../utils";
import { Avatar, Popover, Typography } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import classes from "../../../scss/chatMain.module.scss";

export const MessagesBox = () => {
  const { mentionId, messagesMentionId, messages } = useContext(ChatContext);
  const { user } = useContext(AuthContext);

  const [open, setOpen] = useState("");

  const handleOpenChange = (id) => {
    setOpen(id);
  };

  const handleDeleteMessages = async (e) => {
    setOpen("");
    await deleteDoc(doc(db, "messages", e.id));
  };
  return (
    <div>
      {messages?.map((message, index) => {
        let styleContainerMessage = { marginRight: "12px" };
        let styleBannerMessage = {};
        let backgroundMessage = "#359eff";
        let colorMessage = "#fff";
        let marginMessageUser = "4px 6px 10px 0";
        let textAlign = "";
        let taskMessagesCss = {};
        if (user.uid === message.uid) {
          styleBannerMessage = {
            display: "flex",
            alignItems: "center",
            flexDirection: "row-reverse",
          };

          taskMessagesCss = {
            display: "flex",
            alignItems: "center",
            flexDirection: "row-reverse",
          };
          textAlign = "left";
        } else {
          styleContainerMessage = {
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          };

          styleBannerMessage = {
            display: "flex",
            alignItems: "center",
          };
          backgroundMessage = "#fff";
          colorMessage = "#000";
          marginMessageUser = "4px 0px 10px 6px";
          textAlign = "left";
          taskMessagesCss = { display: "flex", alignItems: "center" };
        }
        return (
          <div
            key={index}
            style={styleContainerMessage}
            ref={(el) => {
              // el can be null - see https://reactjs.org/docs/refs-and-the-dom.html#caveats-with-callback-refs
              if (!el) return;
              if (messagesMentionId.includes(message.id)) {
                if (mentionId === message.id) {
                  el.scrollIntoView(true);
                }
              }
            }}
          >
            <div style={styleBannerMessage}>
              <Avatar style={{ background: `${message?.avatar}` }}>
                {message.displayName.charAt(0).toUpperCase()}
              </Avatar>
              <span className={classes.textName}>{message.displayName}</span>
              <span className={classes.textTime}>
                {formatDate(message?.createdAt?.seconds)}
              </span>
            </div>
            <div style={taskMessagesCss}>
              <Typography.Paragraph
                style={{
                  backgroundColor: `${backgroundMessage}`,
                  margin: `${marginMessageUser}`,
                  color: `${colorMessage}`,
                  textAlign: `${textAlign}`,
                }}
                className={classes.textMessage}
              >
                {message.text}
              </Typography.Paragraph>
              {user.uid.includes(message.uid) && (
                <Popover
                  visible={open === message.id}
                  onVisibleChange={() => handleOpenChange(message.id)}
                  trigger="click"
                  content={
                    <Typography.Link
                      style={{ color: "red" }}
                      onClick={() => handleDeleteMessages(message)}
                    >
                      Delete
                    </Typography.Link>
                  }
                >
                  <span>
                    <MoreOutlined
                      style={{ color: "#222", cursor: "pointer" }}
                    />
                  </span>
                </Popover>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
