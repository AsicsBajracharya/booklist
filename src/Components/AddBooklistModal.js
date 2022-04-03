import React, { useEffect, useState } from "react"
import { Modal, Button, Input, Checkbox, Select, Typography } from "antd"

const resourceDescriptionList = [
  {
    id: 1,
    title: 'option 1'
  },
  {
    id: 2,
    title: 'option 2'
  },
  {
    id: 3,
    title: 'option 3'
  },
  {
    id: 4,
    title: 'option 4'
  },
]


function AddBooklistModal({ visible, hide, parentNode, appendNode }) {
  const {Option} = Select
  const {Text} = Typography
  const [headerBlock, setHeaderBlock] = useState("")
  const [error, setError] = useState("")
  const [serviceBlock, setServiceBlock] = useState(false)
  const [resourceDescriptionId, setResourceDescriptionId] = useState(null)
  function handleOk() {
    if(!headerBlock){
      setError('Please fill in this field')
      return
    }
    appendNode({
      ServiceHeaderBlockTitle: headerBlock,
      NodeLevel: parentNode.NodeLevel + 1,
      NodeText: `${parentNode.NodeText}${parentNode.children ? parentNode.children.length + 1 : 1}/`,
      IsServiceBlock: serviceBlock,
      ResourceDescriptionId: resourceDescriptionId
    })
    setHeaderBlock('')
    setServiceBlock(false)
    hide()
  }

  useEffect(() =>{
    setError(null)
    setHeaderBlock('')
  },[visible])

  useEffect(() =>{
    setError(null)
    
  },[headerBlock])

  function handleSelect(value){
    console.log(`selected ${value}`);
    setResourceDescriptionId(value)
  }

  return (
    <>
      <Modal title="Basic Modal" visible={visible} onOk={handleOk} onCancel={hide}>
        <p>Parent Node: {parentNode?.ServiceHeaderBlockTitle}</p>
        <p>Enter service header block *</p>
        <Input placeholder="Block Level 1" onChange={(e) => setHeaderBlock(e.target.value)} value = {headerBlock} />
        <Text type = "danger">{error}</Text> 
        <span>
          <p>Is service block</p>
        </span>{" "}
        <Checkbox onChange={(e) => setServiceBlock(e.target.checked)} checked= {serviceBlock}>Is service Block </Checkbox>
        <div>
        {
          serviceBlock && (
            <Select  defaultValue="1" style={{ width: '100%' }} onChange={handleSelect}>
              {
                resourceDescriptionList.map((item ,i) =>{
                  return (
                    <Option value = {item.id} key = {i}>{item.title}</Option>
                  )
                })
              }
            </Select>
          )
        }
        </div>
       
      </Modal>
    </>
  )
}

export default AddBooklistModal
