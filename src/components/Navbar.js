import React from 'react'
import { useCookies } from 'react-cookie';
import {getAuth,signOut} from 'firebase/auth'

export default function Navbar(props){
    const [cookies, setCookie,removeCookie] = useCookies(['token']);
    const auth = getAuth()

    const handleSignout = ()=>{
        signOut(auth)
        removeCookie('token',{path:'/'})
        window.location.assign('/')
    }
    return(
        <nav className="navbar navbar-expand-lg navbar-light bg-light d-flex align-items-center">
            <div className="container-fluid">
                <h3 className="navbar-brand pt-2" href="#">Hi {props.username}!</h3>
                    
                <a className="ms-auto onClick" onClick={handleSignout}>
                    SignOut
                </a>
            </div>
        </nav>
    )
}