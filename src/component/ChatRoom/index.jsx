import React from 'react'
import { Row, Col } from 'antd/lib/grid'
import SideBar from './SideBar'
import ChatWindow from './ChatWindow'
export default function ChatRoom() {
  return (
    <Row>
        <Col span={5}><SideBar/></Col>
        <Col span={19}><ChatWindow/></Col>
    </Row>
  )
}
