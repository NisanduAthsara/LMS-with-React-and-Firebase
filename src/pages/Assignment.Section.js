import React from 'react'
import Context from '../Auth.Context'
import AdminContext from '../Admin.Context'
import SectionTable from '../components/Section.Table'
import {getAuth,onAuthStateChanged,getUserData,signOut,deleteUser} from 'firebase/auth'
import { useCookies } from 'react-cookie';
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import '../styles/style.css'

export default function AssignmentSection(){
    const [user,setUser] = React.useState({})
    const {getUserDetails} = React.useContext(Context)
    const {getAllAssignmentSections} = React.useContext(AdminContext)
    const [allSections,setAllSections] = React.useState([])
    const [sectionElements,setSectionElements] = React.useState(null)
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
        setUser(data)
    },[])

    React.useEffect(()=>{
        async function fetchData(){
            const sections = await getAllAssignmentSections()
            setAllSections(sections)
        }
        fetchData()
    },[])

    React.useEffect(()=>{
        if(allSections.length !== undefined){
            const sectionArr = allSections.map((sec)=>{
                return <SectionTable
                    name={sec.name}
                    assignment={sec.assignment}
                    id={sec.id}
                    grade={sec.grade}
                    teacher={sec.teacher}
                />
            })
            setSectionElements(sectionArr)
        }
    },[allSections])

    return(
        <div>
            <Navbar
                username={user.name}
            />
            <div className='container'>
                <div className='mt-3'>
                    <div className='d-flex'>
                        <a href='/admin/dashboard' className='text-decoration-none btn btn-primary custom-margin-right'>Back</a>
                        <a href='/new/assignment/section' className='text-decoration-none btn btn-primary'>New</a>
                    </div>
                </div>
            </div>
            <div className='container'>
                <div className='row d-flex justify-content-center'>
                    <div className='col-sm-12 mt-5'>
                        <table className='table'>
                            <thead className='table-dark'>
                                <tr>
                                    <th>Name</th>
                                    <th>Grade</th>
                                    <th>Teacher</th>
                                    <th>Assignment</th>
                                    <th>Options</th>
                                    <th>Submissions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sectionElements}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}