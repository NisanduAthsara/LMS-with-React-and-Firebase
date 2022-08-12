import React from 'react'
import '../styles/style.css'

export default function StudentTable({name,email,index,uid,deleteStudent,id,classNo,grade}){
    
    return(
        <tr key={uid}>
            <td>{name}</td>
            <td>{email}</td>
            <td>{index}</td>
            <td>{classNo}</td>
            <td>{grade}</td>
            <a onClick={()=>deleteStudent(id)} className='onClick d-flex align-items-center'>Delete</a>
        </tr>
    )
}