import React,{createContext,useEffect,useState} from 'react'
import { collection,addDoc,getDocs,onSnapshot,query,where} from "firebase/firestore";
import {getAuth,signInWithEmailAndPassword,onAuthStateChanged,createUserWithEmailAndPassword} from 'firebase/auth'
import {database} from './firebaseConfig'
import { useCookies } from 'react-cookie';

const Auth_Context = createContext()
export default Auth_Context

export function AuthContext({children}){

    const [cookies, setCookie,removeCookie] = useCookies(['token']);
    const auth = getAuth()
    const collectionRef = collection(database,'users')
    const [authState,setAuthState] = useState()

    const register = async (name,email,password,grade,classNo,index)=>{
        const indexQuery = query(collectionRef,where("index","==",index))
        const data = await getDocs(indexQuery)
        if(data.docs.length > 0){
            console.log(data.docs)
            alert('User already in use')
        }else{
            createUserWithEmailAndPassword(auth,email,password)
                .then((data)=>{
                    let uid = data.user.uid
                    addDoc(collectionRef,{
                        name,
                        email,
                        index,
                        uid,
                        grade,
                        class:classNo,
                        type:'Student'
                    })
                    .then((data)=>{
                        setCookie('token',uid)
                        alert('User added');
                        window.location.assign('/student/dashboard')
                    })
                    .catch((err)=>{
                        console.log(err.message)
                    })
                })
                .catch((err)=>{
                    alert('Email already in use')
                })
        }
    }

    const adminRegister = async (name,email,password)=>
        createUserWithEmailAndPassword(auth,email,password)
            .then((data)=>{
                let uid = data.user.uid
                addDoc(collectionRef,{
                    name,
                    email,
                    uid,
                    type:'Admin'
                })
                .then((data)=>{
                    setCookie('token',uid)
                    alert('User added');
                    window.location.assign('/admin/dashboard')
                })
                .catch((err)=>{
                    console.log(err.message)
                })
            })
            .catch((err)=>{
                alert('Email already in use')
            })

    const login = async(email,password)=>{
        signInWithEmailAndPassword(auth,email,password)
            .then(async(user)=>{
                let uid = user.user.uid
                const uidQuery = query(collectionRef,where("uid","==",uid))
                const data = await getDocs(uidQuery)
                if(data.docs.length > 0){
                    setCookie('token',uid)
                    const user = data.docs.map((item)=>{
                        return {...item.data(),id:item.id}
                    })[0]
                    if(user.type === 'Student'){
                        window.location.assign('/student/dashboard')
                    }else if(user.type === 'Admin'){
                        window.location.assign('/admin/dashboard')
                    }
                }else{
                    alert('Invalid email or password')
                }
            })
            .catch((err)=>{
                console.log(err)
                alert('Invalid email or password')
            })
    }

    const getUserDetails = async(id)=>{
        const uidQuery = query(collectionRef,where("uid","==",id))
        const data = await getDocs(uidQuery)
        const user = data.docs.map((item)=>{
            return {...item.data()}
        })
        return user[0]
    }

    const values = {
        register,
        login,
        getUserDetails,
        adminRegister
    }

    return(
        <Auth_Context.Provider value={values}>
            {children}
        </Auth_Context.Provider>
    )
}