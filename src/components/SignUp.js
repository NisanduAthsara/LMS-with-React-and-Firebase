import React from 'react'
import Context from '../Auth.Context'

export default function SignUp(){
    const {register} = React.useContext(Context)
    const [crediantials,setCrediantials] = React.useState({})

    const handleChange = (e)=>{
        setCrediantials({...crediantials,...{[e.target.name]:e.target.value}})
    }

    const handleSubmit = (e)=>{
        e.preventDefault()
        register(crediantials.name,crediantials.email,crediantials.password,crediantials.index)
    }

    return(
        <div>
            <form>
                <input type="text" name='name' value={crediantials.name} onChange={(e)=>handleChange(e)} placeholder='Name'/>
                <input type="email" name='email' value={crediantials.email} onChange={(e)=>handleChange(e)} placeholder='Email'/>
                <input type="password" name='password' value={crediantials.password} onChange={(e)=>handleChange(e)} placeholder='Password'/>
                <input type="text" name='index' value={crediantials.index} onChange={(e)=>handleChange(e)} placeholder='Index No.'/>

                <button onClick={(e)=>handleSubmit(e)}>Register</button>
            </form>
        </div>
    )
}