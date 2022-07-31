import React from 'react'
import Context from '../Auth.Context'
import AdminContext from '../Admin.Context'
import {getAuth,onAuthStateChanged,getUserData,signOut,deleteUser} from 'firebase/auth'
import { useCookies } from 'react-cookie';
import { Link } from 'react-router-dom'

export default function AssignmentSectionAdd(){
    const [user,setUser] = React.useState({})
    const {getUserDetails} = React.useContext(Context)
    const {addNewAssignmentSection} = React.useContext(AdminContext)
    const [data,setData] = React.useState({})
    const [cookies, setCookie,removeCookie] = useCookies(['token']);
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
        console.log(data)
        setUser(data)
    },[])

    const handleChange = (e)=>{
        setData({...data,...{[e.target.name]:e.target.value}})
    }

    const handleSubmit = (e)=>{
        e.preventDefault()
        addNewAssignmentSection(data.name,data.grade,user.name)
    }

    return(
        <div>
            <form>
                <input type="text" name='name' value={data.name} onChange={(e)=>handleChange(e)} placeholder='Name'/>
                <input type="number" name='grade' value={data.grade} onChange={(e)=>handleChange(e)} placeholder='Grade'/>

                <button onClick={(e)=>handleSubmit(e)}>Register</button>
            </form>
        </div>
    )
}