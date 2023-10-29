import React from "react";
import { Row, Col } from "antd/lib/grid";
import { ModalAddRoom, ModalInvite, SideBar } from "./components";
import { ChatWindow } from "./ChatWindow";

export const ChatRoom = () => {
  return (
    <>
      <Row>
        <Col span={5}>
          <SideBar />
        </Col>
        <Col span={19}>
          <ChatWindow />
        </Col>
      </Row>
      <ModalAddRoom />
      <ModalInvite />
    </>
  );
};
