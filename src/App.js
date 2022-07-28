import React from 'react'
import {app} from './firebaseConfig'
import {AuthContext} from './Auth.Context'
import Register from './components/SignUp'
import Login from './components/Login'
import {Routes,Route} from 'react-router-dom'
import {CookiesProvider} from 'react-cookie'

export default function App(){
    return(
        <CookiesProvider>
        <AuthContext>
            <Routes>
                <Route path='/' element={<Login/>}/>
                <Route path='/register' element={<Register/>}/>
            </Routes>
        </AuthContext>
        </CookiesProvider>
    )
}