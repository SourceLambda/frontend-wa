import { useRef } from "react";
import { reviewMutation } from "../util/postMSQueries";
import GraphQLQuery from "../util/graphQLQuery";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";

const ReviewForm = ({ reviewData, postID, dataType }) => {

    const revTextInput = useRef(reviewData.Review_text)
    const ratingInput = useRef(reviewData.Rating)

    const alterReview = async (e) => {
        e.preventDefault()

        try {
            const data = {
                ...reviewData,
                Review_text: revTextInput.current.value,
                Rating: ratingInput.current.value,
                PostID: postID
            }
            const query = reviewMutation(dataType === 'update' && reviewData.ID, data, dataType)

            const response = await GraphQLQuery(query)

            const jsonRes = await response.json()
            if (jsonRes.data === null && jsonRes.errors) {
                return Promise.reject({msg: "Error response from ApiGateway", error: jsonRes?.errors[0]})
            }

            console.log(jsonRes.data)
        }
        catch (err) {
            console.log(err)
        }

    }

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };
    
    return (
        <Box sx={style} >
            <Typography id="modal-modal-title" variant="h5" component="h3">
                {dataType === 'create' ? "Nueva Reseña" : "Editar Reseña"}
            </Typography>
            <Grid container sx={{display: 'flex', justifyContent: 'space-between', flexDirection: 'column', mt: 1}} spacing={3} >
                <Grid item >
                    <TextField
                        required
                        id="review-text"
                        name="Review_text"
                        inputRef={revTextInput}
                        defaultValue={reviewData.Review_text}
                        label="Escríbenos tu opinión :D"
                        fullWidth
                        multiline
                        rows={4}
                        variant="outlined"
                    />
                </Grid>
                <Grid item >
                    <TextField
                        required
                        id="review-rating"
                        name="Rating"
                        inputRef={ratingInput}
                        defaultValue={reviewData.Rating}
                        label="Puntúanos de 1 a 5"
                        variant="outlined"
                        inputProps={{ inputMode: 'numeric', pattern: '[1-5]' }}
                    />
                </Grid>
                <Grid item >
                    <Button onClick={alterReview} >Guardar Reseña</Button>
                </Grid>
            </Grid>
        </Box>
    )
}

export default ReviewForm;