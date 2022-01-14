import React from "react"
import {IState as Props} from "../App"
import {Box, Card, CardActions, CardContent, Button, Typography} from '@mui/material'



const AllEntries: React.FC<Props> = ({entries, privateMode}) => {
    const renderEntries = () => entries.map((entry) => {
        return (
            <>
            { !entry.private || privateMode
            ?
                <Card sx={{display: "inline-block", m: 3, width: 500}}>
                    <CardContent>
                        <Typography variant="h5" component="div" gutterBottom>
                            {entry.title}
                        </Typography>
                        <Typography sx={{ fontSize: 14 }} color="text.secondary">
                            {entry.description}
                        </Typography>

                    </CardContent>
                </Card>
            : <></>
            }
            </>
        )
    })
    return (
        <div>
            {renderEntries()}
        </div>
    )

}

export default AllEntries