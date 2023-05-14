import { Box, Button, Card, CardContent, Modal, Typography } from "@mui/material"
import { useState } from "react"
import ReviewForm from "./ReviewForm"
import { deleteReviewMutation } from "../util/postMSQueries"
import GraphQLQuery from "../util/graphQLQuery"

const Review = ({ review, postID }) => {

    const [modalOpen, setModalOpen] = useState(false)

    const handleDeleteReview = async (e) => {
        e.preventDefault()

        if (!window.confirm('¿Está seguro de borrar su reseña?')) {
            return
        }
        try {
            const body = {
                OldRating: review.Rating,
                PostID: postID
            }
            const query = deleteReviewMutation(review.ID, body)
            const response = await GraphQLQuery(query)

            // apigateway have no response from ms
            const jsonRes = await response.json()
            if (jsonRes.data === null || jsonRes.errors) {
                return Promise.reject({msg: "Error response from ApiGateway", error: jsonRes?.errors[0]});
            }
            console.log(jsonRes.data)
        }
        catch (err) {
            console.log(err)
        }
    }
    
    return (
        <Card sx={{ height: '100%', display: 'flex', justifyContent: 'space-between', flexDirection: 'column' }} >
            <CardContent
                sx={{ height: 'min-content' }}
            >
                <Typography gutterBottom variant="h5" component="h2" >
                    Review {review.ID}
                </Typography>
                <Typography variant="h6">{review.User_name}</Typography>
                <Typography>{review.User_email}</Typography>
                <Typography>Puntuación: {"*".repeat(review.Rating)}</Typography>
                <Typography paragraph >{review.Review_text}</Typography>

                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-around', flexDirection: 'row' }} >
                    <Button variant="outlined" onClick={() => {setModalOpen(true)}}>Editar</Button>
                    <Button variant="outlined" color="error" onClick={handleDeleteReview}>Borrar</Button>
                </Box>
            </CardContent>

            <Modal
                open={modalOpen}
                onClose={() => {setModalOpen(false)}}
                children={<div><ReviewForm reviewData={{...review, OldRating: review.Rating}} postID={postID} dataType={'update'} /></div>}
            ></Modal>
        </Card>
    )
}

export default Review;