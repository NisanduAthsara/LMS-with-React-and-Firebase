import React from 'react'
import Context from '../Auth.Context'
import {getAuth,onAuthStateChanged,getUserData,signOut} from 'firebase/auth'
import { useCookies } from 'react-cookie';

export default function AdminSignUp(){
    const [crediantials,setCrediantials] = React.useState({})
    const [user,setUser] = React.useState({})
    const [cookies, setCookie,removeCookie] = useCookies(['token']);
    const {adminRegister,getUserDetails} = React.useContext(Context)
    const auth = getAuth()

    const handleChange = (e)=>{
        setCrediantials({...crediantials,...{[e.target.name]:e.target.value}})
    }

    const handleSubmit = (e)=>{
        e.preventDefault()
        adminRegister(crediantials.name,crediantials.email,crediantials.password)
    }

    React.useEffect(async()=>{
        onAuthStateChanged(auth,(data)=>{
            if(!data){
                window.location.assign('/')
            }
        })

        if(!cookies.token){
            signOut(auth)
            window.location.assign('/')
        }

        const data = await getUserDetails(cookies.token)
        if(data.type === 'Student'){
            window.location.assign('/student/dashboard')
        }
        setUser(data)
    },[])

    const handleSignout = ()=>{
        signOut(auth)
        removeCookie('token',{path:'/'})
        window.location.assign('/')
    }
    return(
        <div>
            <h1>Admin Dashboard</h1>
            <div>
                <form>
                    <input type="text" name='name' value={crediantials.name} onChange={(e)=>handleChange(e)} placeholder='Name'/>
                    <input type="email" name='email' value={crediantials.email} onChange={(e)=>handleChange(e)} placeholder='Email'/>
                    <input type="password" name='password' value={crediantials.password} onChange={(e)=>handleChange(e)} placeholder='Password'/>
                    <button onClick={handleSubmit}>SignUp</button>
                </form>
            </div>
            <button onClick={handleSignout}>LogOut</button>
        </div>
    )
}