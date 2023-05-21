import { useRef, useState } from "react";
import { reviewMutation } from "../util/postMSQueries";
import GraphQLQuery from "../util/graphQLQuery";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import SnackBarNotification from "./SnackBarNotification";

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

const ReviewForm = ({ reviewData, postID, dataType }) => {

    const revTextInput = useRef()
    const ratingInput = useRef()

    const [snackBarInfo, setSnackBarInfo] = useState({
        message: '',
        barType: 'info',
        time: 3000,
        state: false,
        redirectHandler: () => {}
    })
    const [invalid, setInvalid] = useState({
        text: false,
        rating: false
    });

    const alterReview = async (e) => {
        e.preventDefault()

        // form validation
        const invalidText = !/([\w ]{10,1000})/.test(revTextInput.current.value);
        const invalidRating = ratingInput.current.value < 1 || ratingInput.current.value > 5;
        setInvalid({
            text: invalidText,
            rating: invalidRating
        })
        if (invalidText || invalidRating) {
            return
        }

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

            setSnackBarInfo({
                message: dataType === 'create' ? 'Reseña creada correctamente' : 'Reseña actualizada correctamente',
                type: 'success',
                time: 3000,
                state: true,
                redirectHandler: () => window.location.reload()
            })
            //console.log(jsonRes.data)
        }
        catch (err) {
            console.log(err)
        }

    }
    
    return (
        <>
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
                            error={invalid.text}
                            helperText={(invalid.text) && 'Ingresa más texto por favor.'}
                            fullWidth
                            multiline
                            rows={4}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item >
                        <TextField
                            sx={{width: '150px'}}
                            required
                            id="review-rating"
                            name="Rating"
                            inputRef={ratingInput}
                            defaultValue={reviewData.Rating}
                            type="number"
                            error={invalid.rating}
                            helperText={(invalid.rating) && 'Ingrése un número válido.'}
                            label="Puntúanos de 1 a 5"
                            variant="outlined"
                            inputProps={{ inputMode: 'numeric', step: 1, min: 1, max: 5 }}
                            // alterReview ratingInput.current.value > 5 || ratingInput.current.value < 1
                        />
                    </Grid>
                    <Grid item >
                        <Button onClick={alterReview} color='secondary' >Guardar Reseña</Button>
                    </Grid>
                </Grid>
            </Box>
            <SnackBarNotification sncBarData={snackBarInfo} />
        </>
    )
}

export default ReviewForm;