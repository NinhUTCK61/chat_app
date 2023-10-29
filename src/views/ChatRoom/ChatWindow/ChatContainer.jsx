import React, { useContext } from "react";
import { AuthContext, AppContext } from "../../../component/ContextProvider";
import { Avatar, Alert, Form, Mentions, Button } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { db } from "../../../firebase/firebaseConfig";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useForm } from "antd/lib/form/Form";
import { useState } from "react";
import classes from "../../../scss/chatMain.module.scss";
import { HeaderMain } from "./HeaderMain";
import { MessagesBox } from "./MessagesBox";

export const ChatContainer = () => {
  const { user } = useContext(AuthContext);
  const { selectionRoom, userInRoom, userRoot, userMention } =
    useContext(AppContext);
  console.log(userMention);
  const [form] = useForm();

  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e) => {
    setInputValue(e);
  };

  const mentionIdUser = userInRoom
    .filter((user) => {
      return inputValue?.split(" ").includes(`@${user.displayName}`);
    })
    .map((user) => {
      return user.uid;
    });

  const handleOnsubmit = async (e) => {
    const [{ ...userHost }] = userRoot;
    if (inputValue.trim() !== "") {
      await addDoc(collection(db, "messages"), {
        text: inputValue,
        uid: user.uid,
        name: selectionRoom.name,
        roomId: selectionRoom.id,
        displayName: userHost.displayName,
        mention: mentionIdUser,
        avatar: userRoot[0].avatar,
        createdAt: serverTimestamp(),
      });
      setInputValue("");
      form.resetFields(["messages"]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") e.preventDefault();
  };
  return (
    <>
      {selectionRoom.id ? (
        <>
          <HeaderMain />
          <div className={classes.chatMain}>
            <div className={classes.chatContent}>
              <MessagesBox />
              <Form
                form={form}
                className={classes.form}
                onFinish={handleOnsubmit}
              >
                <Form.Item className={classes.formItem} name="messages">
                  <Mentions
                    name="messages"
                    placeholder="Enter messages..."
                    style={{ border: "none", fontSize: "16px" }}
                    onPressEnter={(e) => handleOnsubmit(e)}
                    onChange={(e) => handleInputChange(e)}
                    autoFocus={true}
                    value={inputValue}
                    autoSize={{ maxRows: 1 }}
                    onKeyPress={handleKeyPress}
                  >
                    {userMention?.map((user) => {
                      if (user.id !== userRoot[0].uid) {
                        return (
                          <Mentions.Option
                            key={user.id}
                            value={user.display}
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <Avatar style={{ background: `${user.avatar}` }}>
                              {user.display.charAt(0).toUpperCase()}
                            </Avatar>
                            <span style={{ paddingLeft: "6px" }}>
                              {user.display}
                            </span>
                          </Mentions.Option>
                        );
                      }
                    })}
                  </Mentions>
                </Form.Item>

                <Form.Item className={classes.submit}>
                  <Button
                    htmlType="submit"
                    type="primary"
                    icon={<SendOutlined />}
                    className={classes.button}
                  />
                </Form.Item>
              </Form>
            </div>
          </div>
        </>
      ) : (
        <Alert
          style={{ margin: "20px" }}
          message="Let's go to chat room"
          type="info"
          showIcon
        />
      )}
    </>
  );
};
