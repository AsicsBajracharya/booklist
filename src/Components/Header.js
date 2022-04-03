import React, { useEffect } from "react"
import {PageHeader, Typography, Avatar} from 'antd'
import {UserOutlined} from '@ant-design/icons'
function Header() {
  const {Text} = Typography

  return(
    <div className="site-page-header-ghost-wrapper">
    <PageHeader title = "Service Header Block List" extra = {[<Text strong>Tech</Text>, <Avatar size={64} icon = {<UserOutlined />}  />]} />
  </div>
  )
 
}

export default Header
