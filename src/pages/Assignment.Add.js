import React from 'react'
import Context from '../Auth.Context'
import AdminContext from '../Admin.Context'
import {getAuth,onAuthStateChanged,getUserData,signOut,deleteUser} from 'firebase/auth'
import { useCookies } from 'react-cookie';
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar';
import '../styles/style.css'

export default function AssignmentSectionAdd(){
    const [user,setUser] = React.useState({})
    const {getUserDetails} = React.useContext(Context)
    const {addNewAssignmentSection} = React.useContext(AdminContext)
    const [data,setData] = React.useState({})
    const [file,setFile] = React.useState(null)
    const [cookies, setCookie,removeCookie] = useCookies(['token']);
    const auth = getAuth()
    
    let fileName = null
    if(file){
        if(file.name.length > 15){
            fileName = file.name.slice(0,15)+"....pdf"
        }else{
            fileName = file.name
        }
    }else{
        fileName = ""
    }
    const labelName = fileName ? fileName : 'Select File'

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

    const handleFileChange = (e)=>{
        setFile(e.target.files[0])
    }

    const handleSubmit = (e)=>{
        e.preventDefault()
        if(file.type !== 'application/pdf'){
            alert('You must upload pdf files')
        }else{
            addNewAssignmentSection(data.name,data.grade,user.name,file)
        }
    }

    return(
        <div>
            <Navbar
                username={user.name}
            />
            <div className='container'>
                <div className='mt-3'>
                    <div className='d-flex'>
                        <a href='/all/assignments' className='text-decoration-none btn btn-primary custom-margin-right'>Back</a>
                    </div>
                </div>
            </div>
            <div className="container">
                <div className='row'>
                    <div className='col-sm-12 mt-5'>
                    <form className='justify-content-center'>
                        <div className='w-50 mx-auto'>
                            <div className=''>
                                <div className="d-flex align-items-center justify-content-center mb-3">
                                    <label for="name" className="form-label ml-5">Name: </label>
                                    <input type="text" name='name' id="name" className='form-control' value={data.name} onChange={(e)=>handleChange(e)} placeholder='Name'/>
                                </div>
                                <div className="d-flex align-items-center justify-content-center mb-3">
                                    <label for="grade" className="form-label ml-5">Grade: </label>
                                    <input type="number" name='grade' id="grade" className='form-control' value={data.grade} onChange={(e)=>handleChange(e)} placeholder='Grade'/>
                                </div>
                                <div className="text-center p-5 border border-dark rounded mb-3">
                                    <label for="file">
                                        {labelName}
                                        <input type="file" id="file" onChange={(e)=>handleFileChange(e)}/>
                                    </label>
                                </div>

                                <button onClick={(e)=>handleSubmit(e)} className='btn btn-primary'>Add</button>
                            </div>
                        </div>
                    </form>
                    </div>
                </div>
            </div>
        </div>
    )
}