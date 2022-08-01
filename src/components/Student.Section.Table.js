import React from 'react'

export default function SectionTable({name,assignment,id,teacher}){
    const assignmentTD = assignment.length === 0 ? "Still Not Added" : <a href={assignment} target="_blank" download>Download</a>
    return(
        <tr key={id}>
            <td>{name}</td>
            <td>{teacher}</td>
            <td>{assignmentTD}</td>
        </tr>
    )
}