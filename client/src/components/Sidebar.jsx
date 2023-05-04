import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
  Menu,
  MenuItem,
} from "@mui/material";

import {
    LightModeOutlined,
    DarkModeOutlined,
  ChevronLeft,
  ChevronRightOutlined,
  HomeOutlined,
    ShoppingCartOutlined,
    Groups2Outlined,
    // ArrowDropDownOutlined,
    // ReceiptLongOutlined,
    PublicOutlined,
    // PointOfSaleOutlined,
    // TodayOutlined,
    // CalendarMonthOutlined,
    // AdminPanelSettingsOutlined,
    // TrendingUpOutlined,
    // PieChartOutlined,
} from "@mui/icons-material";
import LogoutIcon from '@mui/icons-material/Logout';
import { useLocation, useNavigate } from "react-router-dom";
import FlexBetween from "./FlexBetween";
import profileImage from "assets/profileImage.jpeg";
import { useDispatch}  from "react-redux";
import { useAuthStore } from '../state/store'


const navItems = [
    {
        text: "Dashboard",
        icon: <HomeOutlined />,
      },
      {
        text: "Class",
        icon: null,
      },
      {
        text: "New Classroom",
        icon: <ShoppingCartOutlined />,
      },
      // {
      //   text: "Classrooms",
      //   icon: <Groups2Outlined />,
      // },
      {
        text: "Students",
        icon: null,
      },
      {
        text: "All Students",
        icon: <PublicOutlined />,
      },
];
const Sidebar = ({
  isNonMobile,
  drawerWidth,
  isSidebarOpen,
  setIsSidebarOpen,
}) => {
  const { pathname } = useLocation();
  const [active, setActive] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();
  const dispatch = useDispatch();

  function userLogout(){
    localStorage.removeItem('token');
    navigate('/')
  }

  useEffect(() => {
    setActive(pathname.substring(1));
  }, [pathname]);

  const [anchorEl, setAnchorEl] = useState(null);
  const isOpen = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const { username } = useAuthStore(state => state.auth)


  return (
    <Box component="nav">
      {isSidebarOpen && (
        <Drawer
          open={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          variant="persistent"
          anchor="left"
          sx={{
            width: drawerWidth,
            "& .MuiDrawer-paper": {
              color: theme.palette.secondary[200],
              backgroundColor: theme.palette.background.alt,
              boxSizing: "border-box",
              borderWidth: isNonMobile ? 0 : "2px",
              width: drawerWidth,
            },
          }}
        >
          <Box width="100%">
            <Box m="1.5rem 2rem 2rem 3rem">
              <FlexBetween color={theme.palette.secondary.main}>
                <Box display="flex" alignItems="center" gap="0.5rem">
                  <Typography variant="h4" fontWeight="bold">
                    ATTENDNOW
                  </Typography>
                </Box>
                {!isNonMobile && (
                  <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    <ChevronLeft />
                  </IconButton>
                )}
              </FlexBetween>
            </Box>
            <List>
              {navItems.map(({ text, icon }) => {
                if (!icon) {
                  return (
                    <Typography key={text} sx={{ m: "2.25rem 0 1rem 3rem" }}>
                      {text}
                    </Typography>
                  );
                }
                const lcText = text.toLowerCase();

                return (
                  <ListItem key={text} disablePadding>
                    <ListItemButton
                      onClick={() => {
                        navigate(`/${lcText}`);
                        setActive(lcText);
                      }}
                      sx={{
                        backgroundColor:
                          active === lcText
                            ? theme.palette.secondary[300]
                            : "transparent",
                        color:
                          active === lcText
                            ? theme.palette.primary[600]
                            : theme.palette.secondary[100],
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          ml: "2rem",
                          color:
                            active === lcText
                              ? theme.palette.primary[600]
                              : theme.palette.secondary[200],
                        }}
                      >
                        {icon}
                      </ListItemIcon>
                      <ListItemText primary={text} />
                      {active === lcText && (
                        <ChevronRightOutlined sx={{ ml: "auto" }} />
                      )}
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Box>



          <Box position="absolute" bottom="2rem">
            <Divider />
            <FlexBetween textTransform="none" gap="1.5rem" m="1rem 2rem 0 1rem">
              <Box
                component="img"
                alt="profile"
                src={profileImage}
                height="40px"
                width="40px"
                borderRadius="50%"
                sx={{ objectFit: "cover" }}
              />
              <Box textAlign="left">
                <Typography
                  fontWeight="bold"
                  fontSize="0.9rem"
                  sx={{ color: theme.palette.secondary[100] }}
                >
                  {username}
                </Typography>
                <Typography
                  fontSize="0.8rem"
                  sx={{ color: theme.palette.secondary[200] }}
                >
                  {"Admin"}
                </Typography>
              </Box>
              <Button
              onClick={userLogout}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                textTransform: "none",
                gap: "1rem",
              }}
            >
              <LogoutIcon
                sx={{ color: theme.palette.secondary[300], fontSize: "25px" }}
              />
              </Button>
              {/* <Menu
              anchorEl={anchorEl}
              open={isOpen}
              onClose={handleClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
              <MenuItem onClick={handleClose}>Log Out</MenuItem>
            </Menu> */}
            {/* <IconButton onClick={() => dispatch(setMode())}>
                   {theme.palette.mode === 'dark' ?(
                       <DarkModeOutlined sx={{ fontSize: "25px" }}/>
                   ): (
                       <LightModeOutlined sx={{ fontSize: "25px" }}/>
                   )}
            </IconButton> */}
            </FlexBetween>
          </Box>
        </Drawer>
      )}
    </Box>
 
  );
};

export default Sidebar;
