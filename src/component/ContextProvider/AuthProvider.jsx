import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase/firebaseConfig";
import { Spin } from "antd";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [signUpCorrected, setSignUpCorrected] = useState(false);

  useEffect(() => {
    const unSubscribed = auth.onAuthStateChanged((users) => {
      if (users) {
        const { displayName, email, uid, photoURL } = users;
        setUser({ displayName, email, uid, photoURL });
        setIsLoading(false);
        setSignUpCorrected(true);
        navigate("/");
        return;
      }
      setSignUpCorrected(false);
      setIsLoading(false);

      navigate("/signIn");
    });
    return () => unSubscribed();
  }, [signUpCorrected]);

  return (
    <AuthContext.Provider value={{ user }}>
      {isLoading ? <Spin style={spinStyle} /> : children}
    </AuthContext.Provider>
  );
};

const spinStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
};
