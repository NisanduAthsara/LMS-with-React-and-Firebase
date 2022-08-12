import React from 'react'
import Context from '../Auth.Context'
import StudentContext from '../Student.Context'
import {getAuth,onAuthStateChanged,getUserData,signOut,deleteUser} from 'firebase/auth'
import { useCookies } from 'react-cookie';
import { Link } from 'react-router-dom'
import StudentTable from '../components/Student.Table'
import Navbar from '../components/Navbar'

export default function Student(){
    const [user,setUser] = React.useState({})
    const [cookies, setCookie,removeCookie] = useCookies(['token']);
    const [allStudents,setAllStudents] = React.useState([])
    const [studentElements,setStudentElements] = React.useState(null)
    const {getUserDetails} = React.useContext(Context)
    const {getStudents,delStudent} = React.useContext(StudentContext)
    const auth = getAuth()

    const deleteStudent = async(id)=>{
        const students = await delStudent(id)
        setAllStudents(students)
    }

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

        const students = await getStudents()
        setAllStudents(students)
    },[])

    React.useEffect(()=>{
        const stdArr = allStudents.map((std)=>{
            console.log(std.id)
            return <StudentTable
                name={std.name}
                email={std.email}
                index={std.index}
                uid={std.uid}
                deleteStudent={deleteStudent}
                id={std.id}
                classNo={std.class}
                grade={std.grade}
            />
        })
        setStudentElements(stdArr)
    },[allStudents])

    const handleSignout = ()=>{
        signOut(auth)
        removeCookie('token',{path:'/'})
        window.location.assign('/')
    }
    const tableDiv = <table className='table'>
        <thead className='table-dark'>
            <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Index No.</th>
                <th>Class No.</th>
                <th>Grade</th>
                <th>Action</th>
            </tr>
        </thead>
        <tbody>
            {studentElements}
        </tbody>
    </table>

    const emptyDiv = <div class="alert alert-warning" role="alert">
        Not Yet Any Students
    </div>

    const contentDiv = allStudents.length > 0 ? tableDiv : emptyDiv

    return(
        <div>
            <Navbar
                username={user.name}
            />
            <div className='container'>
                <div className='mt-3'>
                    <div className=''>
                        <a href='/admin/dashboard' className='text-decoration-none btn btn-primary'>Back</a>
                    </div>
                </div>
            </div>
            <div className='container'>
                <div className='row d-flex justify-content-center'>
                    <div className='col-sm-12 mt-5'>
                        {contentDiv}
                    </div>
                </div>
            </div>
            
        </div>
    )
}