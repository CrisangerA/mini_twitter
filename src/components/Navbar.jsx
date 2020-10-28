import React, { useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
// Materiial
import { fade, makeStyles, AppBar, Toolbar, IconButton, Typography, InputBase, Badge, MenuItem, Menu } from './Material';
import { CTooltip } from './Custom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Auth from '../config/auth';

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: 'none',
    color: '#fff',
    fontFamily: 'malatan',
    fontWeight: 'bold',
    textDecoration: 'none',
    fontSize: '30px',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '30ch',
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
}));

export default function Navbar() {
  const classes = useStyles();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  useEffect(() => {

  }, [location.pathname]);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="secondary">
            <FontAwesomeIcon icon={['fab', 'twitter']} />
          </Badge>
        </IconButton>
        <p>Twitter</p>
      </MenuItem>
      <MenuItem>
        <IconButton aria-label="show 11 new notifications" color="inherit">
          <Badge badgeContent={11} color="secondary">
            <FontAwesomeIcon icon={['fab', 'google']} />
          </Badge>
        </IconButton>
        <p>Google</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <FontAwesomeIcon icon={['fab', 'facebook']} />
        </IconButton>
        <p>Facebook</p>
      </MenuItem>
    </Menu>
  );

  const handleLogout = (e) => {
    Auth.logout(() => console.info('Logout'));
  }

  return (
    <div className={classes.grow}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="open drawer"
          >
            <FontAwesomeIcon icon="bars" />
          </IconButton>
          <NavLink to="/" style={{ maxWidth: 200, textDecoration: 'none' }}>
            <Typography className={classes.title} variant="h6" >
              Twitter
            </Typography>
          </NavLink>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <FontAwesomeIcon icon="search" />
            </div>
            <InputBase
              placeholder="Buscar..."
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
            />
          </div>
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>

            {Auth.isAuthenticated() && <CTooltip title="Inicio">
              <IconButton aria-label="user" color="inherit">
                <Badge badgeContent={0} color="secondary">
                  <NavLink to="/">
                    <FontAwesomeIcon icon={['fab', 'twitter']} color="#fff" />
                  </NavLink>
                </Badge>
              </IconButton>
            </CTooltip>}
            {Auth.isAuthenticated() && <CTooltip title="Mi Cuenta">
              <IconButton aria-label="user" color="inherit">
                <Badge badgeContent={0} color="secondary">
                  <NavLink to="/account">
                    <FontAwesomeIcon icon="user" color="#fff" />
                  </NavLink>
                </Badge>
              </IconButton>
            </CTooltip>}


            {Auth.isAuthenticated()
              ? <CTooltip title="Cerrar Sesión">
                <NavLink to="/signin">
                  <IconButton aria-label="user" color="inherit" onClick={handleLogout}>
                    <Badge badgeContent={0} color="secondary">
                      <FontAwesomeIcon icon="sign-out-alt" color="#fff" />
                    </Badge>
                  </IconButton>
                </NavLink>
              </CTooltip>
              : <CTooltip title="Iniciar Sesión">
                <NavLink to="/signin">
                  <IconButton aria-label="user" color="inherit">
                    <Badge badgeContent={0} color="secondary">
                      <FontAwesomeIcon icon="sign-in-alt" color="#fff" />
                    </Badge>
                  </IconButton>
                </NavLink>
              </CTooltip>
            }

          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <FontAwesomeIcon icon="ellipsis-v" />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </div>
  );
}
