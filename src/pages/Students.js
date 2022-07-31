import React from 'react'
import Context from '../Auth.Context'
import StudentContext from '../Student.Context'
import {getAuth,onAuthStateChanged,getUserData,signOut,deleteUser} from 'firebase/auth'
import { useCookies } from 'react-cookie';
import { Link } from 'react-router-dom'
import StudentTable from '../components/Student.Table'

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

    return(
        <div>
            <button onClick={handleSignout}>LogOut</button>
            <h1>All Students</h1>
            {studentElements &&
                <table>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Index No.</th>
                        <th>Class No.</th>
                        <th>Grade</th>
                    </tr>
                    {studentElements}
                </table>
            }
        </div>
    )
}