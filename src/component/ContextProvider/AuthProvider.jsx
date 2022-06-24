import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase/firebaseConfig';
import { Spin } from 'antd';
export const AuthContext = React.createContext();
export default function AuthProvider({children}) {
    const [user, setUser] = useState({})
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true)
    const [signUpCorrected, setSignUpCorrected] = useState(false)

    React.useEffect(()=>{
      const unsubscibed = auth.onAuthStateChanged((users)=>{
          if(users){
            const {displayName, email, uid, photoURL} = users;
            setUser({displayName, email, uid, photoURL})
            setIsLoading(false);
            setSignUpCorrected(true)
            navigate('/')
            return
          }
          setSignUpCorrected(false)
          setIsLoading(false)
          navigate('/signIn',{replace:true});
      })
      return ()=> unsubscibed();
    },[signUpCorrected]);
  
    return (
      <AuthContext.Provider value={{user}}>
        {isLoading ? <Spin style ={{display: 'flex', justifyContent: 'center', alignItems:'center', height: '100vh'}}/> : children}
      </AuthContext.Provider>
    )
}
