import React,{createContext,useEffect,useState} from 'react'
import { collection,addDoc,getDoc,onSnapshot,query,where,deleteDoc,doc,getDocs, updateDoc} from "firebase/firestore";
import {getAuth,signInWithEmailAndPassword,onAuthStateChanged,createUserWithEmailAndPassword} from 'firebase/auth'
import { ref,refFromURL,getDownloadURL,uploadBytesResumable,deleteObject} from "firebase/storage";
import {database,storage} from './firebaseConfig'
import { useCookies } from 'react-cookie';
import {v4} from 'uuid'
import { useNavigate } from "react-router-dom";

const Admin_Context = createContext()
export default Admin_Context

export function AdminContext({children}){
    const [cookies, setCookie,removeCookie] = useCookies(['token']);
    const auth = getAuth()
    const assignmentRef = collection(database,'assignment')
    const collectionRef = collection(database,'users')
    const stdAssignmentRef = collection(database,'std_assignment')

    const navigate = useNavigate()

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

    const getAllAssignmentSectionsById = async(id)=>{
        try{
            const idQuery = doc(database, "assignment", id)
            const allSections = await getDoc(idQuery)

            return allSections.data()
        }catch(err){
            console.log(err)
        }
    }

    const addNewAssignmentSection = async(name,grade,teacher,file)=>{
        try{
            const storageRef = ref(storage, `files/${file.name+v4()}`);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on('state_changed',(snapshot)=>{
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
            },(err)=>{
                console.log(err)
            },()=>{
                getDownloadURL(uploadTask.snapshot.ref).then(async(downloadURL) => {
                    const newSection = await addDoc(assignmentRef,{
                        name,
                        grade,
                        assignment:downloadURL,
                        teacher
                    })
                    alert('New Assignment section created')
                    navigate('/all/assignments')
                });
            })
        }catch(err){
            console.log(err)
        }
    }

    const deleteAssignmentSection = (id,downloadURL)=>{
        const storageRef = ref(storage,downloadURL)
        if(downloadURL){
            deleteObject(storageRef)
            .then(()=>{
                const docToDel = doc(database,'assignment',id)
                deleteDoc(docToDel)
                    .then(()=>{
                        alert('Section Deleted')
                        navigate('/all/assignments')
                    })
                    .catch((err)=>{
                        console.log(err)
                    })
            })
            .catch((err)=>{
                console.log(err)
            })
        }else{
            const docToDel = doc(database,'assignment',id)
            deleteDoc(docToDel)
                .then(()=>{
                    alert('Section Deleted')
                    navigate('/all/assignments')
                })
                .catch((err)=>{
                    console.log(err)
                })
        }
    }

    const uploadAssignment = (file,docID,name,grade)=>{
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
                    const docToUp = doc(database,'assignment',docID)
                    updateDoc(docToUp,{
                        assignment:downloadURL,
                        name,
                        grade
                    })
                    .then(()=>{
                        alert('Assignment Added')
                        navigate('/all/assignments')
                    })
                    .catch((err)=>{
                        console.log(err)
                    })
                });
            })
        }else{
            const docToUp = doc(database,'assignment',docID)
            updateDoc(docToUp,{
                name,
                grade
            })
            .then(()=>{
                alert('Data Updated')
                navigate('/all/assignments')
            })
            .catch((err)=>{
                console.log(err)
            })
        }
        
    }

    const deleteAssignmentFile = async(downloadURL,docID)=>{
        const storageRef = ref(storage,downloadURL)
        deleteObject(storageRef)
            .then(()=>{
                const docToUp = doc(database,'assignment',docID)
                updateDoc(docToUp,{
                    assignment:''
                })
                .then(()=>{
                    alert('Assignment Deleted')
                    navigate('/all/assignments')
                })
                .catch((err)=>{
                    console.log(err)
                })
            })
            .catch((err)=>{
                console.log(err)
            })
    }

    const getAllSubmissionSectionsByID = async(id)=>{
        try{
            const gradeQuery = query(stdAssignmentRef,where("uploadedAssignment","==",id))
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

    const values = {
        addNewAssignmentSection,
        getAllAssignmentSections,
        getAllAssignmentSectionsById,
        deleteAssignmentSection,
        uploadAssignment,
        deleteAssignmentFile,
        getAllSubmissionSectionsByID
    }

    return(
        <Admin_Context.Provider value={values}>
            {children}
        </Admin_Context.Provider>
    )
}