import { Alert, Snackbar } from '@mui/material';


const SnackBarNotification = ({ sncBarData }) => {
    
    return (
        <Snackbar open={sncBarData.state} autoHideDuration={sncBarData.time} onClose={sncBarData.redirectHandler}>
            <Alert severity={sncBarData.type} variant='filled' sx={{ width: '100%' }}>
                {sncBarData.message}
            </Alert>
        </Snackbar>
    )
}

export default SnackBarNotification