import { FormControl, MenuItem, Select } from '@mui/material'
import React from 'react'
import { EntityData } from './AddEntities'

type Props = {
    entityDataType:EntityData,
    setEntityDataType:React.Dispatch<React.SetStateAction<EntityData>>
}
export const entityDataArray = ["entry", "journal", "profundity" ] as const

export const ChangeDataTypeEntries: React.FC<Props> = ({entityDataType, setEntityDataType}) => {
    const [openOptions, setOpenOptions] = React.useState(false)

    const handleMenuClick = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
        setOpenOptions(!openOptions);
        if (entityDataArray.includes(e.currentTarget.id as EntityData)) {
            setEntityDataType(e.currentTarget.id as EntityData)
        }
    }

    return (
        <div style={{width: "30%"}}>
            <FormControl sx={{width: "100%"}}>
                <Select
                    open={openOptions}
                    onClick={() => setOpenOptions(!openOptions)}
                    onClose={() => setOpenOptions(false)}
                    value={entityDataType}
                    
                    >
                        {
                        entityDataArray.map((entityName) => {
                            return <MenuItem key={entityName} id={entityName} value={entityName} onClick={(e) =>handleMenuClick(e)}>{entityName}</MenuItem>
                        })
                        }
                </Select>
            </FormControl>
        </div>
    )
}