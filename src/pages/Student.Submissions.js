import React from 'react'
import Context from '../Auth.Context'
import Student_Context from '../Admin.Context';
import {getAuth,onAuthStateChanged,getUserData,signOut} from 'firebase/auth'
import { useCookies } from 'react-cookie';
import SectionTable from '../components/Submision.Table'
import { Link,useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'

export default function StudentAssignment(){
    const [user,setUser] = React.useState({})
    const [cookies, setCookie,removeCookie] = useCookies(['token']);
    const [allSections,setAllSections] = React.useState([])
    const [sectionElements,setSectionElements] = React.useState(null)
    const {getUserDetails} = React.useContext(Context)
    const {getAllSubmissionSectionsByID} = React.useContext(Student_Context)
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
        setUser(data)
    },[])

    React.useEffect(()=>{
        async function fetchData(){
            if(id){
                const assignmentSections = await getAllSubmissionSectionsByID(id)
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
                    index={item.indexNo}
                    id={item.id}
                    grade={item.grade}
                    assignment={item.student_assignment}
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

    const tableTag = <table className='table'>
        <thead className='table-dark'>
            <tr>
                <th>Name</th>
                <th>Index</th>
                <th>Grade</th>
                <th>Options</th>
            </tr>
        </thead>
        <tbody>
            {sectionElements}
        </tbody>
    </table>

    const emptyTag = <div class="alert alert-warning" role="alert">
        Not Yet Any Submissions
    </div>

    const bodyTag = allSections.length > 0 ? tableTag : emptyTag
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
            <div className='container'>
                <div className='row'>
                    <div className='col-sm-12 d-flex justify-content-center'>
                        <div className='col-sm-12 mt-5'>
                            {bodyTag}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}