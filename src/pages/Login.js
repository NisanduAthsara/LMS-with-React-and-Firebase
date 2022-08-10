import React from 'react'
import Context from '../Auth.Context'
import {getAuth,onAuthStateChanged,getUserData} from 'firebase/auth'

export default function Login(){
    const auth = getAuth()
    const {login} = React.useContext(Context)
    const [crediantials,setCrediantials] = React.useState({})

    const handleChange = (e)=>{
        setCrediantials({...crediantials,...{[e.target.name]:e.target.value}})
    }

    const handleSubmit = (e)=>{
        e.preventDefault()
        login(crediantials.email,crediantials.password)
    }
    return(
        <div className="container my-5">
            <div className="row">
                <div className="col">
                    <h1 className="text-center mb-5">Login</h1>
                    <form className="form justify-content-center mb-5">
                        <div className="d-flex align-items-center justify-content-center">
                            <label for="email" className="form-label ml-5">Email: </label>
                            <input type="email" name='email' id="email" value={crediantials.email} onChange={(e)=>handleChange(e)} placeholder='Email' className="col-4 form form-control w-50"/><br/>
                        </div>
                        <div className="d-flex align-items-center justify-content-center mt-4">
                            <label for="password" className="form-label ml-5 mr-5">Password: </label>
                            <input type="password" name='password' id="password" value={crediantials.password} onChange={(e)=>handleChange(e)} placeholder='Password' className="col-6 form form-control w-50"/>
                        </div>

                        <button onClick={(e)=>handleSubmit(e)} className="btn btn-primary mx-auto text-center d-flex justify-content-center my-3">Login</button>
                    </form>
                    <div className="text-center mt-5">Haven't an account? <a href="/register">Register</a></div>
                </div>
            </div>
        </div>
    )
}