import { Form, Modal, Input } from 'antd'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import React, { useContext } from 'react'
import { useState } from 'react'
import { db } from '../../firebase/firebaseConfig'
import { AppContext } from '../ContextProvider/AppProvider'
import { AuthContext } from '../ContextProvider/AuthProvider'

export default function ModalAddRoom() {
    const {visible, setVisible} = useContext(AppContext)
    const {user:{uid}} = useContext(AuthContext)
    const [form] = Form.useForm()
    const {roomItem} = useContext(AppContext)
    const [status, setStatus] = useState(false)

    const handleOk = async()=>{
        if(status)
        {   
            setVisible(false)
            await addDoc(collection(db, "rooms"),{
                ...form.getFieldValue(),
                members: [uid],
                createdAt: serverTimestamp()
            })
            form.resetFields()
            setStatus(false)
        }
    }
    const handleCancel = ()=>{
        setVisible(false)
        form.resetFields()
    }
  return (
    <Modal visible={visible} title="Add room" onOk={handleOk} onCancel={handleCancel} okText="Add">
        <Form form={form} layout='vertical'>
            <Form.Item 
                label="Room name:" 
                name="name"
                rules={[{ required: true, message: 'Please input your room name!' },
                    () => ({
                        validator(_, value) {
                            const checkroomName = roomItem.find((roomName)=> roomName.name === value)
                            if(!checkroomName){
                                setStatus(true)
                                return Promise.resolve()
                            }
                            return Promise.reject(new Error('Room name already exists!'))
                        },
                    }) 
                ]}
            >
                <Input placeholder='Enter room name'/>
            </Form.Item>
        </Form>
    </Modal>
  )
}
