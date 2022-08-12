import React from 'react'
import '../styles/page404.css'

export default function Page404(){
    return(
        <div>
            <div className='container'>
                <div className='mt-3'>
                    <div className='d-flex'>
                        <a href='/' className='text-decoration-none btn btn-primary custom-margin-right'>Back</a>
                    </div>
                </div>
            </div>
            <div className='container'>
                <div className='row'>
                    <div className='col-sm-12'>
                        <div className='d-flex justify-content-center align-items-center'>
                            <h1 className='text-center my-auto'>404</h1>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}