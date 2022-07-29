import React,{createContext,useEffect,useState} from 'react'
import { collection,addDoc,getDocs,onSnapshot,query,where,deleteDoc,doc} from "firebase/firestore";
import {getAuth,signInWithEmailAndPassword,onAuthStateChanged,createUserWithEmailAndPassword} from 'firebase/auth'
import {database} from './firebaseConfig'
import { useCookies } from 'react-cookie';

const Student_Context = createContext()
export default Student_Context

export function StudentContext({children}){
    const [cookies, setCookie,removeCookie] = useCookies(['token']);
    const auth = getAuth()
    const collectionRef = collection(database,'users')

    const getStudents = async ()=>{
        const typeQuery = query(collectionRef,where("type","==",'Student'))
        const data = await getDocs(typeQuery)
        const students = data.docs.map((item)=>{
            return {...item.data(),id:item.id}
        })
        return students
    }

    const delStudent = async(id)=>{
        try{
            const docToDel = doc(database,'users',id)
            const del = await deleteDoc(docToDel)
            alert('Successfully user deleted')
        }catch(err){
            console.log(err)
        }
    }

    const values = {
        getStudents,
        delStudent
    }

    return(
        <Student_Context.Provider value={values}>
            {children}
        </Student_Context.Provider>
    )
}