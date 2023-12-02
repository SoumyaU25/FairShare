import { useState } from "react";
import "./index.css";

import FS from './assets/FS.png'
import fairshare from './assets/fair.png'

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function Button({ children, onclick }) {
  return <button onClick={onclick} className="button">{children}</button>;
}


function App() {
  
  const[friends, setFriends] = useState(initialFriends)
  const[showAdd, setShowAdd] = useState(false)
  

  function handleAddFriend(friend){
    setFriends((friends)=>[...friends, friend])
    setShowAdd(false)
  }

  

  


  return (
    <div className="logo">
      <div className="cont">
      <img style={{width:'50px'}} src={FS} alt="FS" />
      <img style={{width:'120px'}} src={fairshare} alt="FS" />
      
      </div>
    <div className="app">
      
      <div className="sidebar">
      
        <Friendslist friends={friends} setshowadd={setShowAdd} show={showAdd} onSetfriends={setFriends}/>
        {showAdd && <FormAddFriend onAdd={handleAddFriend}/>}
        <Button onclick = {()=>setShowAdd(!showAdd)}>{showAdd?'Close':'Add friend'}</Button>
      </div>
    </div>
    </div>
  );
}

function Friendslist({friends, setshowadd, show, onSetfriends}) {
  //const friends = initialFriends;

  function handleSplitBill(id,val){
      onSetfriends(friends=>friends.map((friend)=> friend.id === id
      ?{...friend, balance: friend.balance + val}:friend))
  }

  function handleRemove(friend,id){
    let confirm = window.confirm(`Are you sure you want to remove ${friend}`);
    if(confirm){
      onSetfriends(friends=>friends.filter(friend=>friend.id!==id))
    }
    
  }
  
  
  return (
    <ul>
      {friends.map((friend) => (
        <Friend friend={friend} key={friend.id} setshowadd={setshowadd} value={show} handleSplitBill={handleSplitBill} onRemove= {handleRemove}/>
      ))}
    </ul>
  );
}
function Friend({ friend, setshowadd,handleSplitBill, onRemove}) {
  //const[split, setSplit] = useState(null)
  // const isSelected = friend.id;

  const[selected, setSelected] = useState(null)

  function handleSelect(friend){
    setSelected(friend)
    setshowadd(false)
  }

  return (
    <div>
      <li className={selected ?'selected':''}>
        <img src={friend.image} alt={friend.name} />
        <h3> {friend.name} </h3>
        {friend.balance < 0 && (
          <p className="red">
            You owe {friend.name} {Math.abs(friend.balance)}rs.
          </p>
        )}

        {friend.balance > 0 && (
          <p className="green">
            {friend.name} owes you {Math.abs(friend.balance)}/-rs.
          </p>
        )}

        {friend.balance === 0 && <p>You and {friend.name} are even.</p>}

        <Button onclick={()=>handleSelect(selected===null?friend:null)}>{selected?'Close':'Select'}</Button>
        <Button onclick={()=>onRemove(friend.name,friend.id)}>Remove</Button>
       
       
      
      </li>
    
      {selected && <FormSplitBill friend={selected} onSplitBill={handleSplitBill} handleSplitSelected= {handleSelect}/>}
    </div>
  );
}



function FormAddFriend({onAdd}) {
  const[name, setName] = useState('')
  const[img, setImg] = useState('https://i.pravatar.cc/48')
  
  function handleSubmit(e){
    e.preventDefault();

    const id = crypto.randomUUID()

    if(!name || !img){
      return;
    }

    const newfriend = {
      id,
      name,
      image: `${img}?u=${id}`,
      balance:0,
      
    }

    onAdd(newfriend)

    setName('')
    setImg('https://i.pravatar.cc/48')
  }

  return (
    <form action="" className="form-add-friend" onSubmit={handleSubmit}>
      <label>🧍🏻‍♀️Friend name</label>
      <input className="inp" type="text" value={name} onChange={(e)=>setName(e.target.value)} />

      <label>🖼️Image URL</label>
      <input className="inp" type="text" value={img} onChange={(e)=>setImg(e.target.value)}  />

      <Button>Add friend</Button>
    </form>
  );
}

function FormSplitBill({ friend, onSplitBill, handleSplitSelected }) {

  const[bill, setBill] = useState('');
  const[paidbyuser, setPaidbyuser] = useState('')
  const[whoIspaying, setWhoispaying] = useState('user');

  const paidbyFriend = bill? bill-paidbyuser:'';

  function handleSubmit(e){
    e.preventDefault();

    if(!bill || !paidbyuser) return;
    
    onSplitBill(friend.id, whoIspaying === 'user'?paidbyFriend: -paidbyuser)

    handleSplitSelected(null);


  }

  return (
    <form action="" className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split the bill with {friend.name}</h2>
      
      <label>💰Bill value</label>
      <input className="inp" type="text"
       value={bill} onChange={(e)=>setBill(Number(e.target.value))
       } />

    

      <label>🧍🏻‍♀️Your expense</label>
      <input className="inp" type="text" 
         value={paidbyuser} onChange={(e)=>setPaidbyuser(Number(e.target.value) >bill? paidbyuser : Number(e.target.value))}
      />




      <label>💰{friend.name}'s expense</label>
      <input className="disable" type="text" disabled value={paidbyFriend}/>
      



      <label>💷 Who's paying the bill?</label>
      <select className="inp"  value={whoIspaying} onChange={(e)=>setWhoispaying(e.target.value)}>
        <option value="user">You</option>
        <option value="friend">{friend.name}</option>
      </select>


    
     
      

      <Button>Split bill</Button>
    </form>
  );
}

export default App;
