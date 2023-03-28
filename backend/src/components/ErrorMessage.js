import React from "react";
import { Typography } from "@mui/material";

const ErrorMessage = ({ error, isGeneric }) => {
    return (
        <div className="loading-container">
            {
                isGeneric === true ?
                    <Typography variant='body1' component="div" sx={{ paddingTop: "5px", color: "white" }}>
                        Something went wrong. Please try again later.
                    </Typography>
                    :
                    <Typography variant='body1' component="div" sx={{ paddingTop: "5px", color: "white" }}>
                        {error.message}
                    </Typography>

            }
        </div>
    )
}
export default ErrorMessage