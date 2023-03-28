import React, { useEffect } from "react";
import { Typography, Fade, Box, Modal } from "@mui/material";

const HowToModal = ({ isModalOpen, handleClose, steps }) => {
    return (
        <Modal
            open={isModalOpen}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Fade in={isModalOpen}>
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: { xs: "70%", sm: '70%', md: "50%", lg: "40%", xl: "35%" },
                    maxWidth: 500,
                    bgcolor: '#292e2f',
                    boxShadow: 24,
                    p: 4,
                }}>
                    <Typography variant='h4' component="div" sx={{ paddingTop: "10px", color: "lightgrey" }}>
                        How To
                    </Typography>
                    <br />
                    {
                        steps.map(
                            (step, index) => {
                                let text = step
                                if (!step.startsWith("Note: ")) {
                                    text = index + 1 + ". " + text
                                }
                                return (
                                    <Typography variant='body1' component="div" sx={{ paddingTop: "5px", color: "lightgrey" }}>
                                        {text}
                                    </Typography>
                                )
                            }
                        )
                    }
                </Box>
            </Fade>
        </Modal>
    )
}

export default HowToModal