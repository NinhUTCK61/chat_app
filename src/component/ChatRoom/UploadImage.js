import { CloseCircleOutlined, FileImageTwoTone } from '@ant-design/icons'
import { Popover,  Image, message } from 'antd'
import Upload from 'antd/lib/upload/Upload'
import React, { useContext, useEffect, useState } from 'react'
import "../../scss/uploadImage.css"
import { AppContext } from '../ContextProvider/AppProvider'
const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
};

const beforeUpload = (file) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';

  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }

  const isLt2M = file.size / 1024 / 1024 < 50;

  if (!isLt2M) {
    message.error('Image must smaller than 50MB!');
  }

  return isJpgOrPng && isLt2M;
};

export default function UploadImage() {
  const [imageUrl, setImageUrl] = useState();
  const { setImageObj, visibleImage, setVisibleImage} = useContext(AppContext)
  const handleChange = (info) => {
    if (info.file.status === 'uploading') {
      return;
    }

    if (info.file.status === 'done') {
      setImageObj(info)
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (url) => {
        setImageUrl(url);
        setVisibleImage(true)
      });
    }
  };
  
  const hide = () => {
    setVisibleImage(false);
    setImageUrl(null)
    setImageObj(null)
  };
  
  useEffect(()=>{
    return(
      URL.revokeObjectURL(imageUrl)
    )
  },[imageUrl])

  return (
    <div>
        <Popover
          content={
            <div className='displayImage'>
              <CloseCircleOutlined onClick={hide} className="closeImage"/>
              <Image
                width={200}
                src={imageUrl}
              />
            </div>
          }
          visible={visibleImage}
          trigger="click"
          placement="topRight"
        >
          <Upload
              name="avatar"
              listType="picture-card"
              showUploadList={false}
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              beforeUpload={beforeUpload}
              onChange={handleChange}
          >
              <FileImageTwoTone style={{fontSize:"26px", padding:"0px 0px 0px 16px"}}/>
          </Upload>
        </Popover>
    </div>
  )
}
