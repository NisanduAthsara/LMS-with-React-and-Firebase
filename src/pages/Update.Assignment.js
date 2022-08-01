import React from 'react'
import Context from '../Auth.Context'
import AdminContext from '../Admin.Context'
import {getAuth,onAuthStateChanged,getUserData,signOut,deleteUser} from 'firebase/auth'
import { useCookies } from 'react-cookie';
import { Link,useParams } from 'react-router-dom'

export default function UpdateAssignment(){
    const [user,setUser] = React.useState({})
    const [file,setFile] = React.useState({})
    const [assignmentData,setAssignmentData] = React.useState({})
    const {getUserDetails} = React.useContext(Context)
    const {getAllAssignmentSectionsById,deleteAssignmentSection,uploadAssignment} = React.useContext(AdminContext)
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
        }
        fetchData()
    },[])

    const handleFileChange = (e)=>{
        setFile(e.target.files[0])
    }

    const delSection = ()=>{
        deleteAssignmentSection(id)
    }

    const fileUp = async(e)=>{
        e.preventDefault()
        uploadAssignment(file,id)
    }

    return(
        <div>
            <h1>jj</h1>
            <h1>{id}</h1>
            <button onClick={delSection}>Delete</button>
            <form>
                <input type="file" onChange={(e)=>handleFileChange(e)}/>
                <button onClick={(e)=>fileUp(e)}>Upload</button>
            </form>
        </div>
    )
}