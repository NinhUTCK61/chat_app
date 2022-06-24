import React, { useContext } from 'react'
import {Button, Menu} from "antd"
import { AppContext } from '../ContextProvider/AppProvider';
import "../../scss/sidebar.css"
function getItem(label, key, icon, children, type) {
    return {
      key,
      icon,
      children,
      label,
      type,
    };
}

export default function SideBar() {
  const {setVisible, roomItem, setSelectionId} = useContext(AppContext)

    const onClick = (e) => {   
        setSelectionId(e.key)
    };
    
    const getItemMenu = roomItem.map((item, index)=>{
        return getItem(item.name, item.id)
    })

    const handleAddRoom = ()=>{
      setVisible(true)
    }

    return (
    <div style={{borderRight: "1px solid #ccc", height: "100vh", textAlign:"center"}}>
        <div style={{display: "flex", alignItems:"center", justifyContent: "center", padding: "16px 0 16px", borderBottom: "1px solid #ccc", height: "74px"}}>
            <img src={require('../../img/logo.jpg')} alt="" style={{width: "40px", height: "40px"}}/>
            <span style={{fontSize: "20px", fontWeight: "bold"}}>Chat App</span>
        </div> 
        { 
          
          <Menu
              onClick={onClick}
              style={{
                  width: "100%",
                  border: "none",
              }}
              defaultOpenKeys={['sub1']}
              mode="inline"
              items={[
                getItem('Chat room list', 'sub1', null, getItemMenu)]}
          />
        }
        <Button style={{marginTop: "12px", width:"90%"}} onClick={handleAddRoom}>Add room</Button>
    </div>
  )
}
