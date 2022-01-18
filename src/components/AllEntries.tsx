import React, {useState} from "react"
import {IState as Props, entry} from "../App"
import {Box, Card, CardActions, CardContent, Button, Typography} from '@mui/material'

import { Delete, LockOpen, LockOutlined } from '@mui/icons-material';




const AllEntries: React.FC<Props> = ({entries, privateMode}) => {
    const renderEntries = () => entries.map((entry) => {
        const HoverIconBar: React.FC<{isPrivate: boolean}> = (prop) => {
            return (
                <>
                    { prop.isPrivate
                    ? 
                    <LockOutlined />
                    : 
                    <LockOpen />
                    }
                    <Delete />
                </>
            )
        }

        console.log(entry)
        const AllThings = () => {
            const [isHovering, setIsHovering] = useState(false);

            return (
                <>
                    { !entry.private || privateMode
                    ?
                        <Card sx={{display: "inline-block", m: 3, width: 500}} onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
                            <CardContent>
                                <Typography variant="h5" component="div" gutterBottom>
                                    {entry.title}
                                </Typography>
                                <Typography sx={{ fontSize: 14, pb: 1 }} color="text.secondary">
                                    {entry.description}
                                </Typography>

                                <div style={{height: 25}}>
                                    { isHovering
                                    ? <HoverIconBar isPrivate={entry.private}/>
                                    : <></>
                                    }
                                </div>
                           
                            </CardContent>
                        </Card>
                    : <></>
                    }
                </>
            )
        }

        return (
            < AllThings />
        )

    })
    return (
        <div>
            {renderEntries()}
        </div>
    )

}

export default AllEntries