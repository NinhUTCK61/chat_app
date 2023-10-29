import React from "react";
import { Row, Col, Form, Input, Button, Typography, notification } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import styles from "../../scss/signin.module.scss";
import { auth } from "../../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";

export const SignIn = () => {
  const navigate = useNavigate();
  const navigateRegister = () => {
    navigate("/signUp", { replace: true });
  };
  const handleLoginAccount = (value) => {
    signInWithEmailAndPassword(auth, value.email, value.password)
      .then((userCredential) => {
        notification["success"]({
          message: "Welcome to ChatUnity!",
          duration: 1.5,
          top: "50px",
        });
      })
      .catch((error) => {
        const textNotify = error.code
          .replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, " ")
          .replace("auth", "")
          .trim();
        notification["error"]({
          message: `${
            textNotify.charAt(0).toUpperCase() + textNotify.slice(1)
          }`,
          duration: 1.5,
          top: "50px",
        });
      });
  };

  return (
    <div className={styles.signinContainer}>
      <Row justify="center" align="middle" style={{ height: "100vh" }}>
        <Col span={5}>
          <div className={styles.signinBox}>
            <div className={styles.signinLogo}>
              <img src={require("../../img/logo.jpg")} alt="logo" />
              <span>ChatUnity</span>
            </div>
            <div className={styles.signinForm}>
              <Form
                name="normal_login"
                className="login-form"
                initialValues={{ remember: true }}
                onFinish={handleLoginAccount}
              >
                <Form.Item
                  name="email"
                  rules={[
                    {
                      type: "email",
                      message: "The input is not valid E-mail!",
                    },
                    {
                      required: true,
                      message: "Please input your E-mail!",
                    },
                  ]}
                >
                  <Input
                    prefix={<UserOutlined className="site-form-item-icon" />}
                    placeholder="E-mail"
                  />
                </Form.Item>
                <Form.Item
                  name="password"
                  rules={[
                    { required: true, message: "Please input your Password!" },
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    type="current-password"
                    placeholder="Password"
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="login-form-button"
                    style={{ width: "100%" }}
                  >
                    Log in
                  </Button>
                  <div style={{ marginTop: "16px" }}>
                    Or
                    <Typography.Link
                      style={{ paddingLeft: "4px" }}
                      onClick={navigateRegister}
                    >
                      register now!
                    </Typography.Link>
                  </div>
                </Form.Item>
              </Form>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};
