import React from 'react'

export default function StudentTable({name,email,index,uid}){
    
    return(
        <tr key={uid}>
            <td>{name}</td>
            <td>{email}</td>
            <td>{index}</td>
        </tr>
    )
}