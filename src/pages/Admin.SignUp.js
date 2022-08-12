import React from 'react'
import Context from '../Auth.Context'
import {getAuth,onAuthStateChanged,getUserData,signOut} from 'firebase/auth'
import { useCookies } from 'react-cookie';
import Navbar from '../components/Navbar'

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
            <Navbar
                username={user.name}
            />
            <div className='container'>
                <div className='mt-3'>
                    <div className='d-flex'>
                        <a href='/admin/dashboard' className='text-decoration-none btn btn-primary custom-margin-right'>Back</a>
                    </div>
                </div>
            </div>
            <div className='container'>
                <div className='row'>
                    <div className='col-sm-12'>
                        <form className='form justify-content-center'>
                            <div className="d-flex align-items-center justify-content-center">
                                <label for="username" className="form-label ml-5">Username: </label>
                                <input type="text" name='name' value={crediantials.name} onChange={(e)=>handleChange(e)} placeholder='Name' className='form-control w-50' id='username'/>
                            </div>
                            <div className="d-flex align-items-center justify-content-center mt-2">
                                <label for="email" className="form-label ml-5">Email: </label>
                                <input type="email" name='email' value={crediantials.email} onChange={(e)=>handleChange(e)} placeholder='Email' className='form-control w-50' id='email'/>
                            </div>
                            <div className="d-flex align-items-center justify-content-center mt-2">
                                <label for="password" className="form-label ml-5">Password: </label>
                                <input type="password" name='password' value={crediantials.password} onChange={(e)=>handleChange(e)} placeholder='Password' className='form-control w-50' id='password'/>
                            </div>
                            <button onClick={handleSubmit} className='btn btn-primary mx-auto text-center d-flex justify-content-center my-3'>SignUp</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}