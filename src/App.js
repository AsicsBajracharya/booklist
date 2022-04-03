import React, { useEffect, useState, useCallback } from "react"
import { Collapse, Tooltip, Notification, notification } from "antd"
import Header from "./Components/Header"
import db from "./data.json"
import { PlusSquareOutlined, DeleteOutlined, CaretRightOutlined, CheckCircleOutlined   } from "@ant-design/icons"
import AddBooklistModal from "./Components/AddBooklistModal"

function App() {
  const [data, setData] = useState(db)
  const [dataSaveCount, setDataSaveCount] = useState(0)
  const [formattedData, setFormattedData] = useState([])
  const [highestNodeLevel, setHighestNodeLevel] = useState(0)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [currentNode, setCurrentNode] = useState(null)
  const [highestId, setHighestId] = useState(-1)
  const { Panel } = Collapse

  //find the highest node level & highest id
  useEffect(() => {
    data.forEach((item) => {
      if (item.NodeLevel > highestNodeLevel) {
        setHighestNodeLevel(item.NodeLevel)
      }
      if (item.ServiceHeaderBlockId > highestId) {
        setHighestId(item.ServiceHeaderBlockId)
      }
    })
  }, [data, highestId, highestNodeLevel])

  const formatData = useCallback(
    (data) => {
      let fd = []
      for (let i = 0; i <= highestNodeLevel; i++) {
        if (i === 0) {
          let root = data.filter((v) => v.NodeLevel === 0)[0]
          fd.push({ ...root })
        } else {
          const elements = data.filter((v) => v.NodeLevel === i)
          elements.forEach((v) => {
            let hierarchy = v.NodeText.replace(/\/\d+\/$/, "").split("/")
            let selfIndex = parseInt(v.NodeText.match(/(\d+)\/$/)[1]) - 1
           
              let parent = fd[0]
              hierarchy.forEach((h) => {
                if (h === "") {
                  return
                } else {
                  let index = parseInt(h) - 1
                  parent = parent.children[index]
                }
              })
              if (typeof parent.children === "undefined") {
                parent.children = []
              }
              parent.children[selfIndex] = { ...v }
           
            
          })
        }
      }
      return fd
    },
    [highestNodeLevel]
  )

  useEffect(() => {
    if (highestNodeLevel && highestId) {
      console.log('setting formatted data')
      setFormattedData(formatData(data))
    }
  }, [data, highestNodeLevel, highestId, formatData])

  function addItem(event, node) {
    event.stopPropagation()
    setIsModalVisible(true)
    setCurrentNode(node)
  }

  function deleteItem(event, node){
    event.stopPropagation()
    //find all children items to delete
    console.log(node.NodeText)
    const remainintItems = data.filter(el => el.ServiceHeaderBlockId !== node.ServiceHeaderBlockId)
    setData(remainintItems)
  }

  function openNotification(placement){
    notification.open({
      icon: <CheckCircleOutlined />,
      message: `Success ${placement}`,
      description:'New service header block has been added successfully',
      placement,
      duration: 2,
      className: 'custom-toast'
    });
  };
  function renderData(data) {
    const main = data.map((item, i) => {
      return (
        <Panel
          key={i}
          header={`${item.ServiceHeaderBlockTitle} `}
          extra = {item.NodeLevel && !item.IsServiceBlock ?[
            <Tooltip placement="right" title="Add Service Block Element" color="#fff" overlayInnerStyle={{color: '#34aeeb', fontSize: '15px', fontWeight:'700'}}>
               <span onClick={(event) => addItem(event, item)}>
                  <PlusSquareOutlined />
               </span>
            </Tooltip>
           ,     
           <Tooltip placement="right" title="Delete Service Block Element" color="#fff" overlayInnerStyle={{color: '#ff772e', fontSize: '15px', fontWeight:'700'}}>
             <span onClick={(event) => deleteItem(event, item)}>
              <DeleteOutlined style={{color: 'red', marginLeft: '12px'}}/>
             </span>
            </Tooltip>
          ]
          : item.IsServiceBlock ?
            [
              <Tooltip placement="right" title="Delete Service Block Element" color="#fff" overlayInnerStyle={{color: '#ff772e', fontSize: '15px', fontWeight:'700'}}>
             <span onClick={(event) => deleteItem(event, item)}>
              <DeleteOutlined style={{color: 'red', marginLeft: '12px'}}/>
             </span>
            </Tooltip>
            ] :[
              <Tooltip placement="right" title="Add Service Block Element" color="#fff" overlayInnerStyle={{color: '#34aeeb', fontSize: '15px', fontWeight:'700'}}>
              <span onClick={(event) => addItem(event, item)}>
                 <PlusSquareOutlined />
              </span>
           </Tooltip>
          

            ]
          } 
         
          // extra={[
          //   <Tooltip placement="right" title="Add Service Block Element" color="#fff" overlayInnerStyle={{color: '#34aeeb', fontSize: '15px', fontWeight:'700'}}>
          //      <span onClick={(event) => addItem(event, item)}>
          //         <PlusSquareOutlined />
          //      </span>
          //   </Tooltip>
          //  ,     
          //  <Tooltip placement="right" title="Delete Service Block Element" color="#fff" overlayInnerStyle={{color: '#ff772e', fontSize: '15px', fontWeight:'700'}}>
          //    <span onClick={(event) => deleteItem(event, item)}>
          //     <DeleteOutlined style={{color: 'red', marginLeft: '12px'}}/>
          //    </span>
          //   </Tooltip>
          // ]
          // }
        >
          {item.children && renderData(item.children)}
        </Panel>
      )
    })
    return (
      <Collapse defaultActiveKey={["1"]} bordered={false} ghost={true} expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />} className="site-collapse-custom-collapse">
        {main}
      </Collapse>
    )
  }

  function getNextId() {
    return highestId + 1
  }

  function appendNode(nodeData) {
    let newObj = {
      ...nodeData,
      NodeText: nodeData.NodeText,
      ServiceHeaderBlockId: getNextId(),
      NodeLevel: nodeData.NodeLevel,
    }

    setData([...data, newObj])
    openNotification('bottomRight')
    
  }

  return (
    <>
      <Header />

      {formattedData && renderData(formattedData)}

      <AddBooklistModal visible={isModalVisible} hide={() => setIsModalVisible(false)} parentNode={currentNode} appendNode={(nodeData) => appendNode(nodeData)} />
    </>
  )
}

export default App
