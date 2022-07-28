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

    const register = async (name,email,password,index)=>{
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
                        type:'Student'
                    })
                    .then((data)=>{
                        alert('User added')
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

    const login = async(email,password)=>{
        signInWithEmailAndPassword(auth,email,password)
            .then(async(user)=>{
                let uid = user.user.uid
                const uidQuery = query(collectionRef,where("uid","==",uid))
                const data = await getDocs(uidQuery)
                if(data.docs.length > 0){
                    setCookie('token',uid)
                    alert('Logged in successful')
                    console.log(data.docs.map((item)=>{
                        return {...item.data(),id:item.id}
                    }))
                }else{
                    alert('Invalid email or password')
                }
            })
            .catch((err)=>{
                console.log(err)
            })
    }

    const values = {
        register,
        login
    }

    return(
        <Auth_Context.Provider value={values}>
            {children}
        </Auth_Context.Provider>
    )
}