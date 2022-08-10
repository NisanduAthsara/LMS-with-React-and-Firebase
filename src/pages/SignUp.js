import React from 'react'
import Context from '../Auth.Context'

export default function SignUp(){
    const {register} = React.useContext(Context)
    const [crediantials,setCrediantials] = React.useState({})

    const handleChange = (e)=>{
        setCrediantials({...crediantials,...{[e.target.name]:e.target.value}})
    }

    const handleSubmit = (e)=>{
        e.preventDefault()
        register(crediantials.name,crediantials.email,crediantials.password,crediantials.grade,crediantials.classNo,crediantials.index)
    }

    return(
        <div className="container my-5">
            <div className="row">
                <div className='col'>
                    <h1 className='text-center mb-5'>Register</h1>
                    <form className="form justify-content-center mb-5">
                        <div className="d-flex align-items-center justify-content-center mb-3">
                            <label for="name" className="form-label ml-5">Name: </label>
                            <input type="text" id="name" name='name' className="col-4 form form-control w-50" value={crediantials.name} onChange={(e)=>handleChange(e)} placeholder='Name'/>
                        </div>
                        <div className="d-flex align-items-center justify-content-center mb-3">
                            <label for="email" className="form-label ml-5">Email: </label>
                            <input type="email" id="email" name='email' className="col-4 form form-control w-50" value={crediantials.email} onChange={(e)=>handleChange(e)} placeholder='Email'/>
                        </div>
                        <div className="d-flex align-items-center justify-content-center mb-3">
                            <label for="password" className="form-label ml-5">Password: </label>
                            <input type="password" id="password" name='password' className="col-4 form form-control w-50" value={crediantials.password} onChange={(e)=>handleChange(e)} placeholder='Password'/>
                        </div>
                        <div className="d-flex align-items-center justify-content-center mb-3">
                            <label for="index" className="form-label ml-5">Index No.: </label>
                            <input type="text" id="index" name='index' className="col-4 form form-control w-50" value={crediantials.index} onChange={(e)=>handleChange(e)} placeholder='Index No.'/>
                        </div>
                        <div className="d-flex align-items-center justify-content-center mb-3">
                            <label for="grade" className="form-label ml-5">Grade: </label>
                            <input type="number" id="grade" name='grade' className="col-4 form form-control w-50" value={crediantials.grade} onChange={(e)=>handleChange(e)} placeholder='Grade'/>
                        </div>
                        <div className="d-flex align-items-center justify-content-center mb-3">
                            <label for="classNo" className="form-label ml-5">Class No.: </label>
                            <input type="text" id="classNo" name='classNo' className="col-4 form form-control w-50" value={crediantials.classNo} onChange={(e)=>handleChange(e)} placeholder='Class No.'/>
                        </div>

                        <button onClick={(e)=>handleSubmit(e)} className="btn btn-primary mx-auto text-center d-flex justify-content-center my-3">Register</button>
                    </form>
                    <div className="text-center mt-5">Haven an account? <a href="/">Login</a></div>
                </div>
            </div>
        </div>
    )
}