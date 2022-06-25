import React, { useContext, useMemo, useRef, useEffect } from 'react'
import { Avatar, Tooltip,  Button, Typography,  Popover, Alert, Form, Mentions, Dropdown, Menu, Badge } from 'antd'
import { UserAddOutlined, LogoutOutlined, SendOutlined,  BellOutlined, NotificationFilled,  MoreOutlined } from '@ant-design/icons';
import { auth, db } from '../../firebase/firebaseConfig';
import { AuthContext } from '../ContextProvider/AuthProvider';
import { AppContext } from '../ContextProvider/AppProvider';
import useFirestore from '../../hook/useFirestore';
import { addDoc, arrayRemove, collection, deleteDoc, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { useForm } from 'antd/lib/form/Form';
import { useState } from 'react';
import { formatRelative } from 'date-fns/esm';
import "../../scss/chatRoom.css"

export default function ChatWindow() {
  const {user} = useContext(AuthContext)
  const {selectionRoom, 
        userInRoom, 
        userRoot, 
        setIsInviteMemberVisible,
        setSelectionId,
        selectionId,
        userMention
      } = useContext(AppContext)

  const content = (
    <div>
      <Typography.Title level={5} style={{whiteSpace:"nowrap", textOverflow:"ellipsis"}}>{userRoot[0]?.displayName}</Typography.Title>
      <Button style={{color:"red"}} onClick={()=>auth.signOut()}>Log Out</Button>
    </div>
  );
  

  const [visible, setVisible] = useState(false);

  const handleVisibleChange = (newVisible) => {
    setVisible(newVisible);
  };

  const handleOutRooom = async()=>{
    const [{...userHost}] = userRoot;
    await updateDoc(doc(db,"rooms", selectionId), {
      members: arrayRemove(userHost.uid)
    })
    setVisible(false);
  }
   
  const [form] = useForm()

  const [inputValue, setInputValue] = useState('')

  const handleInputChange = (e)=>{
    setInputValue(e)
  }

  const mentionIdUser = userInRoom.filter((user)=>{
    return inputValue?.split(" ").includes(`@${user.displayName}`)
  })
  .map((user)=>{
    return user.uid
  })

  const handleOnsubmit = async(e)=>{
    const [{...userHost}] = userRoot;
    if(inputValue.trim() !== "")
    {
      await addDoc(collection(db, "messages"),{
        text: inputValue,
        uid: user.uid,
        name: selectionRoom.name,
        roomId: selectionRoom.id,
        displayName: userHost.displayName,
        mention: mentionIdUser,
        avartar: userRoot[0].avartar,
        createdAt: serverTimestamp()
      })
      setInputValue("")
      setFirtTime(true)
      form.resetFields(["messages"])
    }
    setFirtTime(true)
  }
   
  const conditionMessages = useMemo(()=>{
    return{
      fielName: "roomId",
      operator: "==",
      compareValue: selectionRoom.id
    }
  }, [selectionRoom.id])

  const messages = useFirestore("messages", conditionMessages)
   
  const conditionMentionMessages = useMemo(()=>{
    return{
      fielName: "mention",
      operator: "array-contains",
      compareValue: user.uid
    }
  },[user.uid])

  const messagesMentionUser = useFirestore("messages", conditionMentionMessages)
  
  const messagesMentionId = useMemo(()=>{
    return(
      messagesMentionUser.map((mention)=>{
        return mention.id
      })
    )
  },[messagesMentionUser.length])

  const formatDate = (seconds)=>{
    let formattedDate = "";
    if(seconds)
    {
      formattedDate = formatRelative(new Date(seconds * 1000), new Date())
      formattedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)
    }
    return formattedDate
  }

  const elementMessagesRef = useRef()
  
  const [selectionIdMention, setSelectionIdMention] = useState('')
  const [element, setElement] = useState()
  const [firtTime, setFirtTime] = useState(true)

  const handleEnterMessagesMention = async(e)=>{
    setSelectionId(e.roomId)
    setSelectionIdMention(e.id)
    setFirtTime(false)
    
    await updateDoc(doc(db,"messages", e.id), {
      mention: arrayRemove(user.uid)
    })
    
  }

  useEffect(()=>{
    if(firtTime)
    { 
      if(elementMessagesRef.current)
      {
        elementMessagesRef.current.scrollTop = elementMessagesRef.current.scrollHeight - elementMessagesRef.current.clientHeight;
      }
    } else{
      if(element)
      {
        element.scrollIntoView()
      }
    }
    return
  }
  ,[messages.length, firtTime, element])

  const handleDeleteMessages = async(e)=>{
    await deleteDoc(doc(db, "messages", e.id));
  }

  return (
    <div>
        <header style={{height: "74px", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "space-between", 
                borderBottom: "1px solid #ccc",
                padding: "0px 28px"
              }}  
        >   
            
            <Dropdown 
              placement="bottomLeft" arrow
              overlay={
                <Menu
                  items={messagesMentionUser.map((item, index)=>{
                    return(
                      {
                        key: index,
                        label: (
                          <Typography.Link onClick={()=>{handleEnterMessagesMention({id: item.id,roomId: item.roomId });}}>
                            <div style={{display:"flex", justifyContent: "space-between", alignItems:"center", paddingBottom:"4px"}}>
                              <span style={{fontSize:"16px", fontWeight:"bold", color:"#000", width:"174px", overflow:"hidden", whiteSpace:"nowrap", textOverflow:"ellipsis"}}>
                                {item.name}
                              </span> 
                              <span style={{fontSize:"12px", color:"#ccc", paddingTop:"2px"}}>
                                {formatDate(item.createdAt.seconds)}
                              </span>
                            </div>
                            <div style={{paddingLeft:"8px", display:"flex", alignItems:"center"}}>
                              <NotificationFilled style={{color:"#ffe000"}}/>
                              <span style={{padding:"0px 2px 0 4px"}}>{item.displayName}:</span>
                              <span style={{paddingLeft:"4px", color:"#000", whiteSpace:"nowrap", textOverflow:"ellipsis", width:"208px", overflow:"hidden", display:"inline-block"}}>
                                {item.text}
                              </span>
                            </div>
                          </Typography.Link>
                        ),
                      }
                    )
                  })}
                />
              } 
            >
              <Badge  count={messagesMentionUser.length} overflowCount={10}>
                <Avatar style={{background:"#1890ff", color:"#fff"}} shape="square" size="middle" icon={<BellOutlined />}/>
              </Badge>
            </Dropdown>

            <Popover placement="bottomRight" content={content}>
              <Avatar size="large" style={{marginRight:"4px", boxShadow:"1px 1px 15px #ccc", cursor:"pointer", background:`${userRoot[0]?.avartar}` }}>{userRoot[0]?.displayName.charAt(0).toUpperCase()}</Avatar>
            </Popover>
        </header>
        {selectionRoom.id ? (
          <div >
              <header style={{height: "52px", 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "space-between", 
                      borderBottom: "1px solid #ccc",
                      padding: "0px 28px"
                    }}  
              >   
                  <Popover
                    content={<Button style={{border:"1px solid red", color:"red"}} onClick={handleOutRooom}>Out Room</Button>}
                    placement="right"
                    title="You want to out room!"
                    trigger="click"
                    visible={visible}
                    onVisibleChange={handleVisibleChange}
                  >
                    <Button style={{fontWeight: "bold", border:"1px solid #359eff", color:"#359eff"}}>{selectionRoom.name} <LogoutOutlined /></Button>
                  </Popover>
                  
                  <div style={{display: "flex", alignItems: "center"}}>
                    <Button onClick={()=>setIsInviteMemberVisible(true)}><UserAddOutlined />Invite</Button>
                    <Avatar.Group
                      maxCount={2}
                      size="middle"
                    >
                        {
                          userInRoom.map((user, index)=>{
                            return (<Tooltip title={user.displayName} key={user.id}>
                              <Avatar style={{background:`${user.avartar}`}}>{user.displayName.charAt(0).toUpperCase()}</Avatar>
                            </Tooltip>)
                          })
                        }
                    </Avatar.Group>
                  </div>
              </header>
      
              <div 
                style={{display:"flex", 
                flexDirection: "column", 
                height: "calc(100vh - 126px)", 
                padding:"16px 6px 16px 22px", 
                justifyContent: "flex-end"}}
              >
                <div style={{overflowY:"auto", maxHeight:"100%", textAlign:"end"}}
                  ref={elementMessagesRef}
                >
                    {
                      messages?.map((message,index)=>{
                        let styleContainerMessage ={marginRight:"12px"}
                        let styleBannerMessage = {}
                        let backgroundMessage = "#359eff"
                        let colorMessage = "#fff"
                        let marginMessageUser = "4px 6px 10px 0" 
                        let textAlign = ""
                        let taskMessagesCss = {}
                        if(user.uid === message.uid)
                        {
                          styleBannerMessage = {
                            display: "flex", 
                            alignItems: "center", 
                            flexDirection:"row-reverse",
                          }
                          
                          taskMessagesCss={display:"flex", alignItems:"center", flexDirection:"row-reverse"}
                          
                        }else{
                          styleContainerMessage = {
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                          }

                          styleBannerMessage={
                            display: "flex", 
                            alignItems: "center",
                          }
                          backgroundMessage = "#fff"
                          colorMessage="#000"
                          marginMessageUser = "4px 0px 10px 6px"
                          textAlign = "start"

                          taskMessagesCss = {display:"flex", alignItems:"center"}
                        }
                        return(
                          <div
                            key={index}
                            style={ styleContainerMessage}
                            ref={el => {
                              if (!el) return;
                              if(messagesMentionId.includes(message.id))
                              {
                                if(selectionIdMention === message.id)
                                { 
                                  // el.scrollIntoView(true)
                                  setElement(el)
                                }
                              }
                            }}
                          >
                              <div style={styleBannerMessage}>
                                <Avatar style={{background:`${message?.avartar}`}}>{message.displayName.charAt(0).toUpperCase()}</Avatar>
                                <span style={{fontSize: "17px", fontWeight: "bold", padding:"0px 4px"}}>{message.displayName}</span>
                                <span style={{padding: "2px 8px 0px", fontSize:"13px", color:"#948f88"}}>{formatDate(message?.createdAt?.seconds)}</span>
                              </div>
                              <div style={taskMessagesCss}>
                                <Typography.Paragraph style={{border: "1px solid #ccc", 
                                  display: "inline-block", 
                                  borderRadius:"10px",
                                  backgroundColor:`${backgroundMessage}`,
                                  padding:"8px",
                                  margin:`${marginMessageUser}`,
                                  color:`${colorMessage}`,
                                  textAlign: textAlign
                                  }}
                                >
                                  {message.text}
                                </Typography.Paragraph>
                                {
                                  user.uid.includes(message.uid)&&(<Popover content={(<Typography.Link style={{color:"red"}} onClick={()=>handleDeleteMessages(message)}>Delete</Typography.Link>)}>
                                    <MoreOutlined style={{color:"#ccc", cursor:"pointer"}}/>
                                  </Popover>)
                                }
                              </div>
                          </div> 
                        )
                      })
                    }
                </div>
                
                

                <Form form={form} style={{display: "flex", marginTop:"12px", alignItems:"center"}} >
                  <Form.Item style={{width: "100%", border:"1px solid #359eff", borderRadius:"3px", marginBottom:"0"} } name="messages">
                    <Mentions 
                       name='messages'
                      placeholder="Enter messages..." 
                      style={{border: "none", fontSize: "16px"}}
                      onPressEnter={e=>handleOnsubmit(e)}
                      onChange={(e)=>handleInputChange(e)}
                      autoFocus={true}
                      value={inputValue}
                      autoSize={{maxRows: 1}}
                      onKeyPress={e => {
                        if(e.key === 'Enter')
                           e.preventDefault()
                        }}
                    >
                      {
                        userMention?.map((user)=>{
                          if(user.id !== userRoot[0].uid)
                          {
                            return(
                              <Mentions.Option key={user.id} value={user.display} style={{display:"flex", alignItems:"center"}}>
                                <Avatar style={{background:`${user.avartar}`}}>{user.display.charAt(0).toUpperCase()}</Avatar>
                                <span style={{paddingLeft:"6px"}}>{user.display}</span>
                              </Mentions.Option>
                            )
                          }
                        })
                      }
                    </Mentions>
                  </Form.Item>
                  
                  <SendOutlined style={{color: "#1890ff", padding: "0px 6px 0 12px", fontSize:"26px"}} onClick={handleOnsubmit}/>
                </Form>
              </div>
          </div>
        ) :
        (
          <Alert
            style={{margin: "20px"}}
            message="Let's go to chat room"
            type="info"
            showIcon
          />
        )
        }
    </div>
  )
}
