import React from 'react'

export default function SectionTable({name,assignment,id,teacher}){
    const assignmentTD = assignment.length === 0 ? "Still Not Added" : <button>Download</button>
    return(
        <tr key={id}>
            <td>{name}</td>
            <td>{teacher}</td>
            <td>{assignmentTD}</td>
        </tr>
    )
}