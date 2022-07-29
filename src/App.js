import React from 'react'
import {app} from './firebaseConfig'
import {AuthContext} from './Auth.Context'
import Register from './components/SignUp'
import Login from './components/Login'
import {Routes,Route} from 'react-router-dom'
import {CookiesProvider} from 'react-cookie'
import AdminDashboard from './components/Admin.dashboard'
import StudentDashboard from './components/Student.dashboard'
import AdminSignUp from './components/Admin.SignUp'

export default function App(){
    return(
        <CookiesProvider>
        <AuthContext>
            <Routes>
                <Route path='/' element={<Login/>}/>
                <Route path='/register' element={<Register/>}/>
                <Route path='/admin/dashboard' element={<AdminDashboard/>}/>
                <Route path='/admin/new/signup' element={<AdminSignUp/>}/>
                <Route path='/student/dashboard' element={<StudentDashboard/>}/>
            </Routes>
        </AuthContext>
        </CookiesProvider>
    )
}