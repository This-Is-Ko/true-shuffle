import React from "react";
import { Typography, Fade, Box, Modal, Divider, Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const HowToModal = ({ isModalOpen, handleClose, steps }) => {
    return (
        <Modal
            open={isModalOpen}
            onClose={handleClose}
            aria-labelledby="how-to-modal-title"
            aria-describedby="how-to-modal-description"
        >
            <Fade in={isModalOpen}>
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: { xs: "80%", sm: '70%', md: "50%", lg: "40%" },
                    maxWidth: 600,
                    bgcolor: '#292e2f',
                    borderRadius: 2,
                    boxShadow: 24,
                    p: 4,
                    overflowY: 'auto',
                }}>
                    <Typography variant='h4' component="div" sx={{ color: "white", fontWeight: 'bold', marginBottom: 2 }}>
                        How To
                    </Typography>

                    {
                        steps.map((step, index) => {
                            let text = step;
                            // Only add the number if it's not a "Note:" step
                            if (!step.startsWith("Note: ")) {
                                text = `${text}`; // Add number for steps
                            }

                            return (
                                <Box key={index} sx={{ marginBottom: 2 }}>
                                    <Typography variant='body1' sx={{ color: "white", lineHeight: 1.6 }}>
                                        {/* Add the step number only for non-"Note:" steps */}
                                        {!step.startsWith("Note: ") && (
                                            <span style={{
                                                fontWeight: 'bold',
                                                fontSize: '1.2rem',
                                                marginRight: '10px',
                                            }}>
                                                {index + 1}.
                                            </span>
                                        )}
                                        {text}
                                    </Typography>
                                    {index < steps.length - 1 && <Divider sx={{ my: 1, backgroundColor: '#444' }} />}
                                </Box>
                            );
                        })
                    }

                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 3, gap: 1 }}>
                        <Typography variant="body2" sx={{ color: "lightgrey" }}>
                            For more assistance, feel free to send an email <Link underline="none" href={"mailto:" + process.env.REACT_APP_CONTACT_EMAIL_ADDRESS}>here</Link>.
                        </Typography>
                        <Typography variant="body2" sx={{ color: "lightgrey" }}>
                            Or check out our <Link component={RouterLink} to="/faq" underline="none" onClick={handleClose} sx={{ color: "#1DB954", "&:hover": { textDecoration: "underline" } }}>FAQ</Link> and <Link component={RouterLink} to="/about" underline="none" onClick={handleClose} sx={{ color: "#1DB954", "&:hover": { textDecoration: "underline" } }}>About</Link> pages.
                        </Typography>
                        <Typography variant="body2" sx={{ color: "lightgrey" }}>
                            Have ideas? Share them on our <Link underline="none" href="https://trueshuffle.featurebase.app/" target="_blank" rel="noopener noreferrer" sx={{ color: "#1DB954", "&:hover": { textDecoration: "underline" } }}>feedback board</Link>.
                        </Typography>
                    </Box>
                </Box>
            </Fade>
        </Modal>
    );
};

export default HowToModal;
