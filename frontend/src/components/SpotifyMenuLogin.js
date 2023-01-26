import React, {useEffect} from "react";
import { Typography, MenuItem } from '@mui/material';

const SpotifyMenuLogin = ({ loginUri }) => {

    const [localLoginUri, setLocalLoginUri] = React.useState("/#");

    useEffect(() => {
      setLocalLoginUri(loginUri)
    }, [loginUri]);
  
    return (
        <MenuItem
            component="a"
            href={localLoginUri}
            key={"logout"}
            sx={{
                color: 'white', display: 'block', bgcolor: "#161817"
            }}>
            <Typography textAlign="center">Login</Typography>

        </MenuItem>
    )

}

export default SpotifyMenuLogin;
