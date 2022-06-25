import { Form, Modal, Select, Spin, Avatar, Typography, Divider, Popover } from 'antd'
import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore'
import React, { useContext } from 'react'
import { useMemo } from 'react'
import { useState } from 'react'
import { db } from '../../firebase/firebaseConfig'
import { AppContext } from '../ContextProvider/AppProvider'
import { AuthContext } from '../ContextProvider/AuthProvider'
import {debounce} from "lodash"
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import { FreeMode, Pagination } from "swiper";


const DeboutSelect = ({fetchOption, debounceTimeout = 300, ...props})=>{
    const [fetching, setFetching] = useState(false);
    const [options, setOptions] = useState([])

    const debounceFetcher = useMemo(()=>{
        const loadOptions = (value)=>{
            setOptions([]);
            setFetching(true)
                fetchOption(value, props.currentmembers).then(newOption =>{
                    setOptions(newOption)
                    setFetching(false)
                })
            }
        return debounce(loadOptions, debounceTimeout)
    }, [debounceTimeout, fetchOption])
    
   
    return(
        <Select 
            labelInValue
            filterOption={false}
            onSearch={debounceFetcher}
            notFoundContent={fetching ? <Spin size='middle'/> : null}
            size={"large"}
            {...props}
        >
            {
                options?.map(opt=>{
                    return (<Select.Option key={opt.valueOpt} value={opt.valueOpt} title={opt.labelOpt} style={{display:"flex", alignItem:"center"}}>
                        <Avatar style={{background:`${opt.photoULR}`}} size="small">
                            {opt.labelOpt?.charAt(0)?.toUpperCase()}
                        </Avatar>
                        <span style={{marginLeft:"4px"}}>{`${opt.labelOpt}`}</span> 
                    </Select.Option>)
                })
            }
        </Select>
    )
}
 
async function fetchUserList(search, currentmembers){
    const q = query(collection(db, "users"), where("keyWords", "array-contains", search))
    const querySnapshot = await getDocs(q);
    const arrayUserList = querySnapshot.docs.map((doc) => {
        return{
        labelOpt: doc.data().displayName,
        valueOpt: doc.data().uid,
        photoULR: doc.data().avartar}
    });
    const arrayUserOutRoom = arrayUserList.filter((opt)=> (!currentmembers.includes(opt.valueOpt)))
    return arrayUserOutRoom
}


export default function InviteModal() {
    const {visible, 
    setVisible,
    isInviteMemberVisible, 
    setIsInviteMemberVisible, 
    selectionId,
    selectionRoom,
    usersList
    } = useContext(AppContext)
 
    const {user:{uid}} = useContext(AuthContext)
    const [form] = Form.useForm()
    const [value, setValue] = useState([])

    const handleOk = async()=>{

        setIsInviteMemberVisible(false)
        await updateDoc(doc(db ,'rooms',selectionId),{
            members:[...selectionRoom.members, ...value.map((val)=> val.value)]
        })
        form.resetFields(["selectorUser"])
    }

    const handleCancel = ()=>{
        setIsInviteMemberVisible(false)
        form.resetFields(["selectorUser"])
    }

  return (
    <Modal 
        visible={isInviteMemberVisible} 
        title="Invite members" onOk={handleOk} 
        onCancel={handleCancel} 
        okText="Add"
        width={350}
    >   
        <div >
            <Typography.Title level={5}>Members're free time</Typography.Title>
            <Divider style={{margin:"12px 0"}}/>
            <Swiper
                slidesPerView={6}
                spaceBetween={4}
                freeMode={true}
                pagination={{
                    clickable: true,
                }}
                modules={[FreeMode, Pagination]}
                style={{margin:"12px 0"}}
            >
                {
                    usersList.filter((user)=>!selectionRoom.members?.includes(user.uid))?.map((user)=>{
                        return(
                            <SwiperSlide key={user.uid} style={{width:"38px", textAlign:"center"}}>
                                <Popover content={
                                    <p>{user.displayName}</p>
                                } trigger="hover">
                                    <Avatar size="middle" style={{background:`${user.avartar}`}} label={user.displayName}>{user.displayName.charAt(0).toUpperCase()}</Avatar>
                                    <p style={{textOverflow:"ellipsis", whiteSpace:"nowrap", overflow:"hidden"}}>{user.displayName}</p>
                                </Popover>
                            </SwiperSlide>
                        )
                    })
                }
            </Swiper>
        </div>
       
        <Form form={form} layout='vertical'>
            <Form.Item name='selectorUser'>
                <DeboutSelect
                    mode="multiple"
                    opt="Member's name: "
                    value={value}
                    placeholder = "Enter member's name..."
                    fetchOption={fetchUserList}
                    onChange={newValue => setValue(newValue)}
                    style={{width: "100%"}}
                    currentmembers={selectionRoom.members}
                />
            </Form.Item>
        </Form>
    </Modal>
  )
}