import React from 'react'
import Context from '../Auth.Context'
import {getAuth,onAuthStateChanged,getUserData} from 'firebase/auth'

export default function Login(){
    const auth = getAuth()
    const {login} = React.useContext(Context)
    const [crediantials,setCrediantials] = React.useState({})

    const handleChange = (e)=>{
        setCrediantials({...crediantials,...{[e.target.name]:e.target.value}})
    }

    const handleSubmit = (e)=>{
        e.preventDefault()
        login(crediantials.email,crediantials.password)
    }

    React.useEffect(()=>{
        onAuthStateChanged(auth,(data)=>{
            if(data){
                alert('logged in')
            }else{
                alert('not logged in')
            }
        })
    },[])
    return(
        <div>
            <h1>Login</h1>
            <form>
                <input type="email" name='email' value={crediantials.email} onChange={(e)=>handleChange(e)} placeholder='Email'/>
                <input type="password" name='password' value={crediantials.password} onChange={(e)=>handleChange(e)} placeholder='Password'/>

                <button onClick={(e)=>handleSubmit(e)}>Login</button>
            </form>
        </div>
    )
}