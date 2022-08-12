import React from 'react'
import Context from '../Auth.Context'
import Student_Context from '../Student.Context';
import {getAuth,onAuthStateChanged,getUserData,signOut} from 'firebase/auth'
import { useCookies } from 'react-cookie';
import SectionTable from '../components/Student.Section.Table'
import Navbar from '../components/Navbar'

export default function StudentAssignment(){
    const [user,setUser] = React.useState({})
    const [cookies, setCookie,removeCookie] = useCookies(['token']);
    const [allSections,setAllSections] = React.useState([])
    const [sectionElements,setSectionElements] = React.useState(null)
    const {getUserDetails} = React.useContext(Context)
    const {getAllAssignmentSections} = React.useContext(Student_Context)
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
        setUser(data)
    },[])

    React.useEffect(()=>{
        async function fetchData(){
            if(user.grade){
                const assignmentSections = await getAllAssignmentSections(user.grade)
                setAllSections(assignmentSections)
            }
        }
        fetchData()
    },[user])

    React.useEffect(()=>{
        if(allSections.length !== undefined){
            const sectionArr = allSections.map((item)=>{
                return <SectionTable
                    name={item.name}
                    assignment={item.assignment}
                    id={item.id}
                    teacher={item.teacher}
                />
            })
            setSectionElements(sectionArr)
        }
    },[allSections])

    const handleSignout = ()=>{
        signOut(auth)
        removeCookie('token',{path:'/'})
        window.location.assign('/')
    }
    const tabelDiv = <table className='table'>
        <thead className='table-dark'>
            <tr>
                <th>Name</th>
                <th>Teacher</th>
                <th>Assignment</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            {sectionElements}
        </tbody>
    </table>

    const emptyTag = <div class="alert alert-warning" role="alert">
        Not Yet Added Any Assignments
    </div>
    const contentDiv = allSections.length > 0 ? tabelDiv : emptyTag
    return(
        <div>
            <Navbar
                username={user.name}
            />
            <div className='container'>
                <div className='mt-3'>
                    <div className='d-flex'>
                        <a href='/student/dashboard' className='text-decoration-none btn btn-primary custom-margin-right'>Back</a>
                    </div>
                </div>
            </div>
            <div className='container'>
                <div className='row'>
                    <div className='col-sm-12 mt-5'>
                        {contentDiv}
                    </div>
                </div>
            </div>
        </div>
    )
}