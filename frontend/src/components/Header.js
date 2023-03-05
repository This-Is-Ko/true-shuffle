import React, { useEffect } from "react"
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import SpotifyLogin from "./SpotifyLogin";
import SpotifyLogout from "./SpotifyLogout";
import SpotifyMenuLogout from "./SpotifyMenuLogout";
import SpotifyMenuLogin from "./SpotifyMenuLogin";
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';

const pages = [
    {
        "title": "Shuffle",
        "link": "/shuffle",
        "special": ""
    },
    {
        "title": "Anaylse My Music",
        "link": "/analysis",
        "special": "NEW "
    },
    {
        "title": "Share Library",
        "link": "/share",
        "special": ""
    },
    {
        "title": "Delete",
        "link": "/delete",
        "special": ""
    },
    {
        "title": "FAQ",
        "link": "/faq",
        "special": ""
    },
    {
        "title": "About",
        "link": "/about",
        "special": ""
    }
];

const Header = ({ loginUri, isAuth }) => {
    const [auth, setAuth] = React.useState(localStorage.getItem("accessToken") != null);
    const [anchorElNav, setAnchorElNav] = React.useState(null);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    useEffect(() => {
        setAuth(isAuth);
    }, [loginUri, isAuth]);

    return (
        <AppBar position="static" sx={{ bgcolor: "#161817" }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <ShuffleIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        TRUE SHUFFLE
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                            PaperProps={{
                                elevation: 0,
                                sx: {
                                    bgcolor: "#161817",
                                }
                            }}
                        >
                            {pages.map((page) => (
                                <MenuItem
                                    key={page.title}
                                    component="a"
                                    href={page.link}
                                    onClick={handleCloseNavMenu}
                                    sx={{
                                        color: 'white', display: 'block', bgcolor: "#161817",
                                        '&:hover': { backgroundColor: '#1DB954' }
                                    }}>
                                    <Typography textAlign="center">{page.title}</Typography>
                                </MenuItem>
                            ))}
                            {auth ?
                                <SpotifyMenuLogout handleCloseNavMenu={handleCloseNavMenu}></SpotifyMenuLogout>
                                :
                                <SpotifyMenuLogin loginUri={loginUri}></SpotifyMenuLogin>
                            }
                        </Menu>
                    </Box>
                    <ShuffleIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        TRUE SHUFFLE
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {pages.map((page) => (
                            <Button
                                key={page.title}
                                // onClick={handleCloseNavMenu}
                                variant="contained"
                                disableElevation
                                sx={{
                                    my: 2, color: 'white', display: 'block', bgcolor: "#161817",
                                    '&:hover': { backgroundColor: '#1DB954' }
                                }}
                                href={page.link}
                            >
                                <Typography display="inline" sx={{ color: "red", fontSize: "0.875rem" }}>{page.special}</Typography>{page.title}
                            </Button>
                        ))}
                    </Box>
                    <Box sx={{ flexGrow: 0, display: { xs: 'none', md: 'flex' } }}>
                        {auth ?
                            <SpotifyLogout />
                            :
                            <SpotifyLogin loginUri={loginUri} />
                        }
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Header