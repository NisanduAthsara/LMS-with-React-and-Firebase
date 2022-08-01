import React from 'react'
import Context from '../Auth.Context'
import AdminContext from '../Admin.Context'
import {getAuth,onAuthStateChanged,getUserData,signOut,deleteUser} from 'firebase/auth'
import { useCookies } from 'react-cookie';
import { Link,useParams } from 'react-router-dom'

export default function UpdateAssignment(){
    const [user,setUser] = React.useState({})
    const [file,setFile] = React.useState(null)
    const [formData,setFormData] = React.useState({})
    const [assignmentData,setAssignmentData] = React.useState({})
    const {getUserDetails} = React.useContext(Context)
    const {getAllAssignmentSectionsById,deleteAssignmentSection,uploadAssignment,deleteAssignmentFile} = React.useContext(AdminContext)
    const [data,setData] = React.useState({})
    const [cookies, setCookie,removeCookie] = useCookies(['token']);
    const auth = getAuth()

    const {id} = useParams()

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

    return(
        <div>
            <button onClick={delSection}>Delete</button>
            {assignmentData.assignment && <button onClick={()=>deleteAssignmentFile(assignmentData.assignment,id)}>Delete Assignment</button>}
            <form>
                <input type="text" name='name' value={formData.name} onChange={(e)=>handleChange(e)} placeholder='Name'/>
                <input type="text" name='grade' value={formData.grade} onChange={(e)=>handleChange(e)} placeholder='Grade'/>
                {assignmentData.assignment ? <div></div> : <input type="file" onChange={(e)=>handleFileChange(e)}/>}
                <button onClick={(e)=>handleSubmit(e)}>Upload</button>
            </form>
            
        </div>
    )
}