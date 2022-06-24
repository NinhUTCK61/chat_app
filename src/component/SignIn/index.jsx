import React, { useState } from 'react'
import { Row, Col, Form, Input, Button, Typography, notification } from 'antd'
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import styles from "../../scss/signin.module.scss"
import { auth } from '../../firebase/firebaseConfig';
import {useNavigate} from"react-router-dom"
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function SignIn() {
  
    const [emailValue, setEmailValue] = useState("")
    const [passwordValue, setPasswordValue] = useState("")

    const navigate = useNavigate()
    const handleNavigateRegisterPage = ()=>{
        navigate('/signUp', {replace:true})
    }
    const handleLoginAccountCreated = ()=>{
        signInWithEmailAndPassword(auth, emailValue, passwordValue)
        .then((userCredential) => { 
            notification["success"]({
                message:"Logged in successfully",
                duration: 1.5,
                top: "50px"
            })
        })
        .catch((error)=>{
            const textNotify = (error.code).replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi , ' ').replace("auth", '').trim()
            notification['error']({
                message: `${textNotify.charAt(0).toUpperCase() + textNotify.slice(1)}`,
                duration: 1.5,
                top: "50px"
            })
        })
    }

  return (
    <div className={styles.signinContainer}>
        <Row justify='center' align='middle' style={{height: "100vh"}}>
            <Col span={5}>
                <div className={styles.signinBox}>
                    <div className={styles.signinLogo}>
                        <img src={require("../../img/logo.jpg")} alt="logo" />
                        <span>Chat App</span>
                    </div>
                    <div className={styles.signinForm}>
                        <Form
                            name="normal_login"
                            className="login-form"
                            initialValues={{ remember: true }}
                        >
                            <Form.Item
                                name="email"
                                rules={[
                                {
                                    type: 'email',
                                    message: 'The input is not valid E-mail!',
                                },
                                {
                                    required: true,
                                    message: 'Please input your E-mail!',
                                },
                                ]}
                            >
                                <Input value={emailValue} 
                                    prefix={<UserOutlined className="site-form-item-icon" />} 
                                    placeholder="E-mail" onChange={(e)=>setEmailValue(e.target.value)}
                                />
                            </Form.Item>
                            <Form.Item
                                name="password"
                                rules={[{ required: true, message: 'Please input your Password!' }]}
                            >
                                <Input.Password
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                type="password"
                                placeholder="Password"
                                onChange={e=>setPasswordValue(e.target.value)}
                                />
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" 
                                htmlType="submit" 
                                className="login-form-button" 
                                style={{width:"100%"}}
                                onClick={handleLoginAccountCreated}
                                >
                                    Log in
                                </Button>
                                <div style={{marginTop: "16px"}}>
                                    Or <Typography.Link onClick={handleNavigateRegisterPage}>register now!</Typography.Link>
                                </div>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </Col>
        </Row>
    </div>
  )
}
