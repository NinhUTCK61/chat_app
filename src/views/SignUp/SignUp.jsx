import React, { useMemo } from "react";
import { Row, Col, Form, Input, Button, Typography, notification } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import styles from "../../scss/signup.module.scss";
import { auth, db } from "../../firebase/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { generateKeywords } from "../../service/generateName";
import { useContext } from "react";
import { AppContext } from "../../component/ContextProvider/AppProvider";

export const SignUp = () => {
  const { usersList } = useContext(AppContext);

  const navigate = useNavigate();
  const handleNavigateSignInPage = () => {
    navigate("/signIn");
  };

  const random_bg_color = useMemo(() => {
    const x = Math.floor(Math.random() * 256);
    const y = Math.floor(Math.random() * 256);
    const z = Math.floor(Math.random() * 256);
    const bgColor = "rgb(" + x + "," + y + "," + z + ")";
    return bgColor;
  }, []);

  const handleRegister = async (value) => {
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        value.email,
        value.password
      );

      notification["success"]({
        message: "Successful registration",
        duration: 1.5,
        top: "50px",
      });

      await addDoc(collection(db, "users"), {
        displayName: value.username,
        email: user.email,
        uid: user.uid,
        avatar: random_bg_color,
        createdAt: serverTimestamp(),
        keyWords: generateKeywords(value.username),
      });
    } catch (error) {
      const textNotify = error.code
        .replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, " ")
        .replace("auth", "")
        .trim();

      notification["error"]({
        message: `${textNotify.charAt(0).toUpperCase() + textNotify.slice(1)}`,
        duration: 1.5,
        top: "50px",
      });
    }
  };

  return (
    <div className={styles.signupContainer}>
      <Row justify="center" align="middle" style={{ height: "100vh" }}>
        <Col span={5}>
          <div className={styles.signupBox}>
            <div className={styles.signupLogo}>
              <img src={require("../../img/logo.jpg")} alt="logo" />
              <span>ChatUnity</span>
            </div>
            <div className={styles.signupForm}>
              <Form
                name="normal_login"
                className="login-form"
                initialValues={{ remember: true }}
                onFinish={handleRegister}
              >
                <Form.Item
                  name="username"
                  rules={[
                    { required: true, message: "Please input your username!" },
                    () => ({
                      validator(_, value) {
                        const checkUserName = usersList.find(
                          (userName) => userName.displayName === value
                        );
                        if (!checkUserName) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error("Username already exists!")
                        );
                      },
                    }),
                  ]}
                >
                  <Input
                    prefix={<UserOutlined className="site-form-item-icon" />}
                    placeholder="Username"
                  />
                </Form.Item>
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
                    () => ({
                      validator(_, value) {
                        if (
                          value.match(
                            /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{6,}$/
                          )
                        ) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error(
                            "Password length must be more than 6, contain at least one digit and one upper case!"
                          )
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    type="password"
                    placeholder="Password"
                  />
                </Form.Item>

                <Form.Item
                  name="confirm"
                  dependencies={["password"]}
                  hasFeedback
                  rules={[
                    {
                      required: true,
                      message: "Please confirm your password!",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error(
                            "The two passwords that you entered do not match!"
                          )
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    type="confirm-password"
                    placeholder="Confirm password"
                    refix={<LockOutlined className="site-form-item-icon" />}
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="login-form-button"
                    style={{ width: "100%" }}
                  >
                    Register
                  </Button>
                  <div style={{ marginTop: "16px" }}>
                    Already have an account?{" "}
                    <Typography.Link onClick={handleNavigateSignInPage}>
                      sign in now!
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
