import React from 'react'
import Context from '../Auth.Context'
import Student_Context from '../Student.Context';
import {getAuth,onAuthStateChanged,getUserData,signOut} from 'firebase/auth'
import { useCookies } from 'react-cookie';
import SectionTable from '../components/Student.Section.Table'

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
    return(
        <div>
            <h1>Assignment Section</h1>
            <table>
                <tr>
                    <th>Name</th>
                    <th>Teacher</th>
                    <th>Assignment</th>
                </tr>
                {sectionElements}
            </table>
        </div>
    )
}