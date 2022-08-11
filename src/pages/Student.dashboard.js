import React from 'react'
import Context from '../Auth.Context'
import {getAuth,onAuthStateChanged,getUserData,signOut} from 'firebase/auth'
import { useCookies } from 'react-cookie';
import Navbar from '../components/Navbar';
import '../styles/style.css'

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
        setUser(data)
    },[])

    return(
        <div>
            <Navbar
                username={user.name}
            />
            <div className='container my-5'>
                <div className='row'>
                    <div className='col-6 bg-light py-3 border border-dark'>
                        <a href="/student/all/assignments" className='text-decoration-none'>All Assignments</a>
                    </div>
                </div>
            </div>
        </div>
    )
}