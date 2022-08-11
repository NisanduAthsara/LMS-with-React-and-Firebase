import React from 'react'
import Context from '../Auth.Context'
import {getAuth,onAuthStateChanged,getUserData,signOut} from 'firebase/auth'
import { useCookies } from 'react-cookie';
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

export default function Admin(){
    const [user,setUser] = React.useState({})
    const [cookies, setCookie,removeCookie] = useCookies(['token']);
    const {getUserDetails} = React.useContext(Context)
    const auth = getAuth()

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
            <div className='container my-5'>
                <div className='row g-2'>
                    <div className='col-sm-6'>
                        <div className='bg-light py-3 border border-dark'>
                            <a href="/admin/new/signup" className='text-decoration-none px-2'>New Admin</a>
                        </div>
                    </div>
                    <div className='col-sm-6'>
                        <div className='bg-light py-3 border border-dark'>
                            <a href="/all/students" className='text-decoration-none px-2'>All Students</a>
                        </div>
                    </div>
                    <div className='col-sm-6'>
                        <div className='bg-light py-3 border border-dark'>
                            <a href="/all/assignments" className='text-decoration-none px-2'>Assignment Sections</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}