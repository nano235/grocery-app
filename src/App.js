import React, { useState, useEffect } from 'react'
import List from './List'
import Alert from './Alert'

const getLocalStorage = () =>{
  let list = localStorage.getItem('list')
  if(list){
    return JSON.parse(localStorage.getItem('list'))
  }else{
    return []
  }
}

function App() {
  const [name, setName] = useState('')
  const [list, setList] = useState(getLocalStorage())
  const [isEditing, setIsEditing] = useState(false)
  const [editID, setEditID] = useState(null)
  const [alert, setAlert] = useState({show:false, msg: "", type: ''})


  const showAlert = (show=false, msg = "", type = "") =>{
      setAlert({show, msg, type})
    }
  const handleSubmit = (e) => {
    e.preventDefault()
    if(!name){
      showAlert(true, "Please input a value", "danger")
    }else if(name && isEditing){
      setList(
        list.map(item => {
          if(item.id === editID){
            return {...item, title:name}
          }
          return item
        })
      )
      setName('')
      showAlert(true, "Item edited", "success")
    }else {
      const newItem = {id: new Date().getTime().toString(), title:name}
      setList([...list, newItem])
      showAlert(true, `${name} was added`, 'success')
      setName('')
      setEditID(null)
      setIsEditing(false)
    }
  }
  const clearItems = () => {
    showAlert(true, "Items cleared", "danger")
    setList([])
  }

  const editItem = (id) => {
    const specificItem = list.find(item => item.id === id)
    setIsEditing(true)
    setEditID(id)
    setName(specificItem.title)
  }

  const deleteItem = (id) => {
    showAlert(true, "Item was deleted", "danger")
    setList(list.filter(item => item.id !== id))
  }

  useEffect(()=>{
    localStorage.setItem('list', JSON.stringify(list))
  },[list])

  return <section className="section-center">
    <form onSubmit = {handleSubmit} className="grocery-form">
      {alert.show && <Alert {...alert} removeAlert={showAlert} />}
      <h3>grocery bud</h3>
      <div className="form-control">
        <input 
          type="text"
          value={name}
          className='grocery'
          placeholder='e.g eggs'
          onChange={(e) => setName(e.target.value)} 
        />
        <button type="submit" className="submit-btn">
          {isEditing ? "Edit" : "Submit"}
        </button>
      </div>
    </form>
    {list.length > 0 && 
    <div className="grocery-container">
      <List items={list} deleteItem={deleteItem} editItem={editItem} />
      <button className="clear-btn" onClick={clearItems}>clear items</button>
    </div>
    
    }
  </section>
}

export default App
