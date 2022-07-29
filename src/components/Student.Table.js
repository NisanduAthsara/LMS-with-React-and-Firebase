import React from 'react'

export default function StudentTable({name,email,index,uid,deleteStudent,id,classNo,grade}){
    
    return(
        <tr key={uid}>
            <td>{name}</td>
            <td>{email}</td>
            <td>{index}</td>
            <td>{classNo}</td>
            <td>{grade}</td>
            <button onClick={()=>deleteStudent(id)}>Delete</button>
        </tr>
    )
}