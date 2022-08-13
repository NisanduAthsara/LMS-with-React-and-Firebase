import React from 'react'
import Context from '../Auth.Context'
import AdminContext from '../Admin.Context'
import {getAuth,onAuthStateChanged,getUserData,signOut,deleteUser} from 'firebase/auth'
import { useCookies } from 'react-cookie';
import { Link,useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'

export default function UpdateAssignment(){
    const [user,setUser] = React.useState({})
    const [file,setFile] = React.useState(null)
    const [formData,setFormData] = React.useState({})
    const [assignmentData,setAssignmentData] = React.useState({assignment:false})
    const {getUserDetails} = React.useContext(Context)
    const {getAllAssignmentSectionsById,deleteAssignmentSection,uploadAssignment,deleteAssignmentFile} = React.useContext(AdminContext)
    const [data,setData] = React.useState({})
    const [cookies, setCookie,removeCookie] = useCookies(['token']);
    const auth = getAuth()

    const {id} = useParams()

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

    React.useEffect(()=>{
        async function fetchData(){
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
            const assignmentDetails = await getAllAssignmentSectionsById(id)
            if(assignmentDetails === undefined){
                alert('Invalid id')
                window.location.assign('/all/assignments')
            }
            setAssignmentData(assignmentDetails)
            setUser(data)
            setFormData(assignmentDetails)
        }
        fetchData()
    },[])

    const handleFileChange = (e)=>{
        setFile(e.target.files[0])
    }

    const delSection = ()=>{
        deleteAssignmentSection(id,assignmentData.assignment)
    }

    const handleSubmit = async(e)=>{
        e.preventDefault()
        if(file){
            if(file.type !== 'application/pdf'){
                alert('You must upload pdf files')
            }else{
                if(assignmentData.assignment){
                    uploadAssignment(file,id,formData.name,formData.grade)
                }else{
                    uploadAssignment(file,id,formData.name,formData.grade)
                }
            }
        }else{
            if(assignmentData.assignment){
                uploadAssignment(file,id,formData.name,formData.grade)
            }else{
                uploadAssignment(file,id,formData.name,formData.grade)
            }
        }

    }

    const handleChange = (e)=>{
        console.log(formData)
        setFormData({...formData,...{[e.target.name]:e.target.value}})
    }
    const fileInput = <div className="text-center p-5 border border-dark rounded mb-3">
        <label for="file">
            {labelName}
            <input type="file" id='file' onChange={(e)=>handleFileChange(e)}/>
        </label>
    </div>
    const fileUploadField = assignmentData.assignment ? <div></div> : fileInput
    return(
        <div>
            <Navbar
                username={user.name}
            />
            <div className='container'>
                <div className='mt-3'>
                    <div className='d-flex'>
                        <a href='/all/assignments' className='text-decoration-none btn btn-primary custom-margin-right'>Back</a>
                        <button onClick={delSection} className='btn btn-danger custom-margin-right'>Delete</button>
                        {assignmentData.assignment && <button onClick={()=>deleteAssignmentFile(assignmentData.assignment,id)} className='btn btn-danger ml-2'>Delete Assignment</button>}
                    </div>
                </div>
            </div>
            <div className='container'>
                <div className='row'>
                    <div className='col-sm-12'>
                    <form className='form justify-content-center'>
                        <div className='w-50 mx-auto'>
                                <div className=''>
                                    <div className="d-flex align-items-center justify-content-center mb-3">
                                        <label for="name" className="form-label ml-5">Name: </label>
                                        <input type="text" id='name' name='name' value={formData.name} onChange={(e)=>handleChange(e)} placeholder='Name' className='form-control'/>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-center mb-3">
                                        <label for="grade" className="form-label ml-5">Grade: </label>
                                        <input type="text" id='grade' name='grade' value={formData.grade} onChange={(e)=>handleChange(e)} placeholder='Grade' className='form-control'/>
                                    </div>
                                    {fileUploadField}
                                    <button onClick={(e)=>handleSubmit(e)} className='btn btn-primary d-flex mx-auto justify-content-center text-center'>Upload</button>
                                </div>    
                        </div>            
                    </form>
                    </div>
                </div>
            </div>
            
        </div>
    )
}