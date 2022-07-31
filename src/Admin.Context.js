import React,{createContext,useEffect,useState} from 'react'
import { collection,addDoc,getDocs,onSnapshot,query,where,deleteDoc,doc} from "firebase/firestore";
import {getAuth,signInWithEmailAndPassword,onAuthStateChanged,createUserWithEmailAndPassword} from 'firebase/auth'
import {database} from './firebaseConfig'
import { useCookies } from 'react-cookie';

const Admin_Context = createContext()
export default Admin_Context

export function AdminContext({children}){
    const [cookies, setCookie,removeCookie] = useCookies(['token']);
    const auth = getAuth()
    const assignmentRef = collection(database,'assignment')
    const collectionRef = collection(database,'users')

    const getAllAssignmentSections = async()=>{
        try{
            const allSections = await getDocs(assignmentRef)
            const arr = allSections.docs.map((item)=>{
                return {...item.data(),id:item.id}
            })
            if(allSections.docs.length > 0){
                const sections = arr.map((item)=>{
                    return {...item,id:item.id}
                })
                return sections
            }else{
                return {}
            }
        }catch(err){
            console.log(err)
        }
    }

    const addNewAssignmentSection = async(name,grade,teacher)=>{
        try{
            console.log(name,grade)
            const newSection = await addDoc(assignmentRef,{
                name,
                grade,
                assignment:'',
                teacher
            })
            alert('New Assignment section created')
            window.location.assign('/all/assignments')
        }catch(err){
            console.log(err)
        }
    }

    const values = {
        addNewAssignmentSection,
        getAllAssignmentSections
    }

    return(
        <Admin_Context.Provider value={values}>
            {children}
        </Admin_Context.Provider>
    )
}