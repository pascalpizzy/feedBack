import { createContext, useState, useEffect } from 'react'
import {v4 as uuidv4} from 'uuid'

const FeedbackContext = createContext()

export const FeedbackProvider = ({children}) => {

    const[feedback, setFeedback] = useState([])

    const[feedbackEdit, setFeedbackEdit] = useState({
        item: {},
        edit: false
    })

    useEffect(() => {
       fetchFeedback()
    }, [])

    //Fetch feedback
    const fetchFeedback = async () => {
        const response = await fetch(`http://localhost:5000/feedback?_sort=id&_order=desc`)
        const data = await response.json()

        setFeedback(data)
    }

    
    //delete feedback
    const deleteFeedback = async (id) => {
        if(window.confirm('Are you sure you want to Delete?')){

            await fetch(`http://localhost:5000/feedback/${id}`, {method: 'DELETE'})
    
          setFeedback(feedback.filter((item) => item.id !== id))
        }
      }

      //UPdate feedback item
      const updateFeedback = async (id, updItem)=>{
        const response =  await fetch(`http://localhost:5000/feedback/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json', 
            },
            body: JSON.stringify(updItem),
            })

            const data = await response.json()

        setFeedback(
            feedback.map((item) => (
            item.id === id ? {...item, ...data
            }: item ))
        )
      }

      //set item to be updated
      const editFeedback = (item) => {
        setFeedbackEdit({
            item,
            edit: true
        })
      }


      //to add feedback
      const addFeedback = async (newFeedback) => {
        const response = await fetch('http://localhost:5000/feedback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newFeedback),
        })
        const data = await response.json()
        setFeedback([data,...feedback])
      }

    return <FeedbackContext.Provider value={{
        feedback,
        deleteFeedback,
        addFeedback,
        editFeedback,
        feedbackEdit,
        updateFeedback,
    }}>
        {children}
    </FeedbackContext.Provider>
}

export default FeedbackContext