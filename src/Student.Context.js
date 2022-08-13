import React,{createContext,useEffect,useState} from 'react'
import { collection,addDoc,getDocs,getDoc,onSnapshot,query,where,deleteDoc,doc} from "firebase/firestore";
import {getAuth,signInWithEmailAndPassword,onAuthStateChanged,createUserWithEmailAndPassword} from 'firebase/auth'
import { ref,refFromURL,getDownloadURL,uploadBytesResumable,deleteObject} from "firebase/storage";
import {database,storage} from './firebaseConfig'
import { useCookies } from 'react-cookie';
import {v4} from 'uuid'
import { useNavigate } from "react-router-dom";

const Student_Context = createContext()
export default Student_Context

export function StudentContext({children}){
    const [cookies, setCookie,removeCookie] = useCookies(['token']);
    const auth = getAuth()
    const collectionRef = collection(database,'users')
    const assignmentRef = collection(database,'assignment')
    const stdAssignmentRef = collection(database,'std_assignment')

    const navigate = useNavigate()

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
            const users = await getStudents()
            alert('Successfully user deleted')
            return users
        }catch(err){
            console.log(err)
        }
    }

    const getAllAssignmentSections = async(grade)=>{
        try{
            const gradeQuery = query(assignmentRef,where("grade","==",grade))
            const allSections = await getDocs(gradeQuery)
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

    const uploadAssignment = (file,name,indexNo,grade,id)=>{
        if(file){
            const storageRef = ref(storage, `files/${file.name+v4()}`);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on('state_changed',(snapshot)=>{
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
            },(err)=>{
                console.log(err)
            },()=>{
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    addDoc(stdAssignmentRef,{
                        name,
                        indexNo,
                        grade,
                        student_assignment:downloadURL,
                        uploadedAssignment:id
                    })
                    .then(()=>{
                        alert('Assignment Added')
                        navigate('/student/all/assignments')
                    })
                    .catch((err)=>{
                        console.log(err)
                    })
                });
            })
        }
    }

    const deleteAssignmentSection = (id,downloadURL)=>{
        const storageRef = ref(storage,downloadURL)
        if(downloadURL){
            deleteObject(storageRef)
            .then(()=>{
                const docToDel = doc(database,'std_assignment',id)
                deleteDoc(docToDel)
                    .then(()=>{
                        alert('Section Deleted')
                        navigate('/student/all/assignments')
                    })
                    .catch((err)=>{
                        console.log(err)
                    })
            })
            .catch((err)=>{
                console.log(err)
            })
        }else{
            const docToDel = doc(database,'std_assignment',id)
            deleteDoc(docToDel)
                .then(()=>{
                    alert('Section Deleted')
                    navigate('/student/all/assignments')
                })
                .catch((err)=>{
                    console.log(err)
                })
        }
    }

    // const getAllAssignmentSectionsById = async(id)=>{
    //     try{
    //         const assignmentQuery = query(stdAssignmentRef,where('uploadedAssignment','==',id))
    //         const assignmentId = await getDocs(assignmentQuery)
    //         console.log(assignmentId[0].data())
    //         const allSections = assignmentId[0].data()
    //         // const idQuery = doc(database, "std_assignment", assignmentId)
    //         // const allSections = await getDoc(idQuery)
    //         console.log(allSections)
    //         return allSections
    //     }catch(err){
    //         console.log(err)
    //     }
    // }

    const values = {
        getStudents,
        delStudent,
        getAllAssignmentSections,
        uploadAssignment,
        deleteAssignmentSection
    }

    return(
        <Student_Context.Provider value={values}>
            {children}
        </Student_Context.Provider>
    )
}