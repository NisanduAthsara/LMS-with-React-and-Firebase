import React from 'react'
import Context from '../Auth.Context'
import Student_Context from '../Student.Context';
import {getAuth,onAuthStateChanged,getUserData,signOut} from 'firebase/auth'
import { useCookies } from 'react-cookie';
import SectionTable from '../components/Student.Section.Table'
import { Link,useParams } from 'react-router-dom'
import Navbar from '../components/Navbar';

export default function StudentAssignment(){
    const [file,setFile] = React.useState(null)
    const [data,setData] = React.useState({})
    const [user,setUser] = React.useState({})
    const [assignmentData,setAssignmentData] = React.useState({})
    const [cookies, setCookie,removeCookie] = useCookies(['token']);
    const {getUserDetails} = React.useContext(Context)
    const {uploadAssignment} = React.useContext(Student_Context)
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

    const handleFileChange = (e)=>{
        setFile(e.target.files[0])
    }

    const handleSubmit = (e)=>{
        e.preventDefault()
        if(file.type !== 'application/pdf'){
            alert('You must upload pdf files')
        }else{
            uploadAssignment(file,user.name,user.index,user.grade,id)
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
                        <a href='/student/all/assignments' className='text-decoration-none btn btn-primary custom-margin-right'>Back</a>
                    </div>
                </div>
            </div>
            <div className='container'>
                <div className='row'>
                    <div className='col-sm-6 mx-auto mt-5'>
                        <form className='form justify-content-center'>
                            <div>
                                <div className="text-center p-5 border border-dark rounded mb-3">
                                    <label for="file">
                                        {labelName}
                                        <input type="file" id="file" onChange={(e)=>handleFileChange(e)}/>
                                    </label>
                                </div>
                                <button onClick={(e)=>handleSubmit(e)} className='btn btn-primary d-flex justify-content-center mx-auto'>Upload</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}