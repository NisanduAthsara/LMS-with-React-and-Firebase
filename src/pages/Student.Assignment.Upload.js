import React from 'react'
import Context from '../Auth.Context'
import Student_Context from '../Student.Context';
import {getAuth,onAuthStateChanged,getUserData,signOut} from 'firebase/auth'
import { useCookies } from 'react-cookie';
import SectionTable from '../components/Student.Section.Table'
import { Link,useParams } from 'react-router-dom'

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
        // const assigmentData = await getAllAssignmentSectionsById(id)
        // console.log(assigmentData)
        // setAssignmentData(assigmentData)
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

    // const handleDel = ()=>{
    //     deleteAssignmentSection()
    // }

    // console.log(assignmentData)
    // const formDiv = assignmentData ? <div>
    //     <input type="file" onChange={(e)=>handleFileChange(e)}/>
    //     <button onClick={(e)=>handleSubmit(e)}>Upload</button>
    // </div> : <button>Delete</button>

    return(
        <div>
            <h1>Assignment Section</h1>
            <form>
                <input type="file" onChange={(e)=>handleFileChange(e)}/>
                <button onClick={(e)=>handleSubmit(e)}>Upload</button>
            </form>
        </div>
    )
}