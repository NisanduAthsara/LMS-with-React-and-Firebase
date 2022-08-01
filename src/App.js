import React from 'react'
import {app} from './firebaseConfig'
import {AuthContext} from './Auth.Context'
import {StudentContext} from './Student.Context'
import {AdminContext} from './Admin.Context'
import Register from './pages/SignUp'
import Login from './pages/Login'
import {Routes,Route} from 'react-router-dom'
import {CookiesProvider} from 'react-cookie'
import AdminDashboard from './pages/Admin.dashboard'
import StudentDashboard from './pages/Student.dashboard'
import AdminSignUp from './pages/Admin.SignUp'
import Students from './pages/Students'
import AssignmentSections from './pages/Assignment.Section'
import AddAssignmentSection from './pages/Assignment.Add'
import StudentAssignment from './pages/Student.Assignments'
import AssignmentUpdate from './pages/Update.Assignment'

export default function App(){
    return(
        <CookiesProvider>
        <AuthContext>
        <StudentContext>   
        <AdminContext>
            <Routes>
                <Route path='/' element={<Login/>}/>
                <Route path='/register' element={<Register/>}/>
                <Route path='/admin/dashboard' element={<AdminDashboard/>}/>
                <Route path='/admin/new/signup' element={<AdminSignUp/>}/>
                <Route path='/student/dashboard' element={<StudentDashboard/>}/>
                <Route path='/all/students' element={<Students/>}/>
                <Route path='/all/assignments' element={<AssignmentSections/>}/>
                <Route path="/new/assignment/section" element={<AddAssignmentSection/>}/>
                <Route path="/assignment/options/:id" element={<AssignmentUpdate/>}/>
                <Route path="/student/all/assignments" element={<StudentAssignment/>}/>
            </Routes>
        </AdminContext>    
        </StudentContext>     
        </AuthContext>
        </CookiesProvider>
    )
}