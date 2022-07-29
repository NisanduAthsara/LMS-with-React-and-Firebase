import React from 'react'
import Context from '../Auth.Context'
import {getAuth,onAuthStateChanged,getUserData,signOut} from 'firebase/auth'
import { useCookies } from 'react-cookie';

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

    const handleSignout = ()=>{
        signOut(auth)
        removeCookie('token',{path:'/'})
        window.location.assign('/')
    }
    return(
        <div>
            <h1>Student Dashboard</h1>
            <div>
                <h1>{user.name}</h1>
                <h3>{user.email}</h3>
            </div>
            <button onClick={handleSignout}>LogOut</button>
        </div>
    )
}