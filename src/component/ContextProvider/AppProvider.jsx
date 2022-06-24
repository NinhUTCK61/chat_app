import { collection,  onSnapshot } from 'firebase/firestore';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { db } from '../../firebase/firebaseConfig';
import useFirestore from '../../hook/useFirestore';
import { AuthContext } from './AuthProvider';

export const AppContext = createContext();
export default function AppProvider({children}) {

    const [visible, setVisible] = useState(false)
    const [selectionId, setSelectionId] = useState('')
    const [isInviteMemberVisible, setIsInviteMemberVisible] = useState(false)
    const {user} = useContext(AuthContext)

    const {user:{uid}} = useContext(AuthContext)
    
    const condition = useMemo(()=>{
        return {
          fielName: "members",
          operator: "array-contains",
          compareValue: uid
        }
    },[uid]) 
    
    const roomItem =  useFirestore("rooms", condition)
    console.log("room: ", roomItem)
    
    const selectionRoom = roomItem.find((item)=> selectionId === item.id) || {}
    
    const userCondition = useMemo(()=>{
        return {
            fielName: "uid",
            operator: "in",
            compareValue: selectionRoom.members
          }
    }, [selectionRoom.members])
    
    const userInRoom =  useFirestore("users", userCondition)

    const userRootCondition = useMemo(()=>{
      return {
          fielName: "uid",
          operator: "==",
          compareValue: user.uid
      }
    }, [user.uid])
    const userRoot = useFirestore("users", userRootCondition)
    
    const [usersList, setUsersList] = useState([])
    useEffect(()=>{
      const querySnapshot = onSnapshot(collection(db,"users"),(doc)=>{
        const queryUser = doc.docs.map((user)=>{
            return {...user.data()}
        })
        setUsersList(queryUser)
      })
      
      return querySnapshot
    },[]) 
    const userMention = userInRoom.map((user)=>{
      return({id:`${user.uid}`,display: `${user.displayName}`, avartar: `${user.avartar}`})
    })
    console.log(usersList)
  return (
    <AppContext.Provider value={{visible, 
        setVisible, roomItem, 
        selectionId, setSelectionId, 
        selectionRoom, 
        userInRoom, userRoot,
        isInviteMemberVisible,
        setIsInviteMemberVisible,
        usersList,
        userMention
      }}
    >
        {children}
    </AppContext.Provider>
  )
}
