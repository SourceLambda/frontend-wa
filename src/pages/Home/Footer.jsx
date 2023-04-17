import { Container, Grid, Link, Typography } from "@mui/material";

const Footer = () => {

    return (
        <>
            <Container
                maxWidth="md"
                component="footer"
                sx={{
                    borderTop: (theme) => `1px solid ${theme.palette.divider}`,
                    mt: 8,
                    py: [3, 6],
                }}
            >
                <Grid container spacing={4} justifyContent="space-evenly">
                    <Grid xs={6} sm={3} item >
                        <Typography variant="h6" color="text.primary" gutterBottom>
                            <Link href='/contact'>Contact</Link>
                        </Typography>
                    </Grid>
                    <Grid xs={6} sm={3} item >
                        <Typography variant="h6" color="text.primary" gutterBottom>
                            <Link href='/about'>About</Link>
                        </Typography>
                    </Grid>
                    <Grid xs={6} sm={3} item >
                        <Typography variant="h6" color="text.primary" gutterBottom>
                            <Link href='/terms'>Terms & Conditions</Link>
                        </Typography>
                    </Grid>
                </Grid>
            </Container>
            <Typography variant='body2' align='center' >
                &#169; SourceLambda {new Date().getFullYear()}.
            </Typography>
        </>
    )
}

export default Footer;