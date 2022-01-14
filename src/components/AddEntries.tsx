import React from "react"
import {IState as Props} from "../App"

interface IProps {
    entries: Props["entries"],
    setEntries: React.Dispatch<React.SetStateAction<Props["entries"]>>
}


const AddEntries: React.FC<IProps> = ({entries, setEntries}) => {
    
    const [input, setInput] = React.useState({
        title: "",
        description: "",
        private: false
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {checked, name, value, type} = e.target
        // Allows for checkbox to be updated
        const assigningVal = type === "checkbox" ? checked : value
        setInput({
            ...input,
            [name]: assigningVal
        })
    }

    const handleClick = () => {
        // Add input field as most recent entry
        setEntries([
            ...entries,
            {
                title: input.title,
                description: input.description,
                private: input.private
            }
            
        ])
        // Resets input after entry has been added
        setInput({
            title: "",
            description: "",
            private: false
        })
    }


    return (
        <div>
            <input 
            type="text"
            name="title"
            placeholder="Enter title"
            onChange={ handleChange}
            value={input.title}
            >
            </input>
            <input 
            type="text"
            name="description"
            placeholder="Enter description"
            value={input.description}
            onChange={ handleChange }
            >
            </input>
            <input
            type="checkbox"
            name="private"
            checked={input.private}
            onChange={ handleChange }
            ></input>
            <label htmlFor="private">Private</label>
            <button
            onClick={ handleClick }
            >
                Submit
            </button>
        </div>
    )
}

export default AddEntries