import "./Navbar.css";
import { useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { useEffect, useState } from "react";
import { logoutUser, setUser } from "../store/userSlice";
import { User, UserInfo } from "../../../models/User";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { setBuildings } from "../store/buildingsSlice";
import { chat, createUser, getBuildings, getUserById } from "../services";
import { setChat } from "../store/chatSlice";

function SearchBar({
  searchText,
  setSearchText,
}: {
  searchText: string;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
}) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const [chatMode, setChatMode] = useState(location.pathname.includes("chat"));

  useEffect(() => {
    setChatMode(location.pathname.includes("chat"));
  }, [location]);

  const search = async () => {
    if (chatMode) {
      if (searchText) {
        dispatch(setChat({ message: searchText, response: "%%loading%%" }));
        navigate("chat");
        setSearchText("");
        dispatch(
          setChat({ message: searchText, response: await chat(searchText) })
        );
      }
    } else {
      navigate("/");
      const buildingsData = await getBuildings(1, searchText);
      dispatch(setBuildings(buildingsData));
    }
  };

  const toggleChat = () => {
    navigate(chatMode ? "" : "chat");
    dispatch(setChat({ message: null, response: null }));
    setChatMode(!chatMode);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      search();
    }
  };

  return (
    <>
      <TextField
        variant="outlined"
        size="small"
        fullWidth
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        onKeyDown={handleKeyPress}
        className="navbar-search"
        sx={{ ".MuiOutlinedInput-root": { borderRadius: 5 } }}
      />
      <IconButton onClick={search} className="navbar-icon-button">
        <SearchIcon />
      </IconButton>
      <IconButton onClick={toggleChat} className="navbar-icon-button">
        <AutoAwesomeIcon htmlColor={chatMode ? "#dc2626" : "inherit"} />
      </IconButton>
    </>
  );
}

function UserAvatar({ user }: { user: User }) {
  const showText = !useMediaQuery("(max-width: 1000px)");
  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openMenu, setMenu] = useState(false);

  const toggleMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(e.currentTarget);
    setMenu(!openMenu);
  };
  const nameToInitials = (name: string) =>
    name ? name.split(" ").reduce((acc, e) => acc + e[0], "") : "";
  const logout = () => {
    dispatch(logoutUser());
  };

  return (
    <div onClick={toggleMenu} className="avatar">
      <Avatar className="avatar-img">{nameToInitials(user.name)}</Avatar>
      {showText ? (
        <div className="avatar-text">
          <Typography fontSize={15}>{user.name}</Typography>
          <Typography fontSize={13} color="text.secondary">
            {user.email}
          </Typography>
        </div>
      ) : (
        <KeyboardArrowDownIcon className="avatar-dropdown" />
      )}
      <Menu
        open={openMenu}
        anchorEl={anchorEl}
        className="avatar-menu"
        slotProps={{ paper: { sx: { width: "200px" } } }}
      >
        <MenuItem className="avatar-menu-item" onClick={logout}>
          <LogoutIcon color="error" />
          <Typography color="error" className="avatar-menu-text">
            Log Out
          </Typography>
        </MenuItem>
      </Menu>
    </div>
  );
}

function LogInButton() {
  const marginRight = !useMediaQuery("(max-width: 1000px)") ? "0px" : "24px";
  const dispatch = useDispatch();
  const onSuccess = async (credentials: CredentialResponse) => {
    if (credentials.credential) {
      const userInfo = jwtDecode(credentials.credential) as UserInfo;
      let user = {
        id: userInfo.sub,
        name: userInfo.name,
        username: userInfo.username,
        email: userInfo.email,
        savedBuildings: [],
      };

      try {
        user = await getUserById(userInfo.sub);
      } catch {
        try {
          await createUser(user);
        } catch {
          console.error("Could not get user data");
        }
      }
      dispatch(setUser(user));
    }
  };
  const onError = () => {};

  return (
    <div className="login-button" style={{ marginRight: marginRight }}>
      <GoogleLogin shape={"pill"} onSuccess={onSuccess} onError={onError} />
    </div>
  );
}

function Navbar() {
  const showTitle = !useMediaQuery("(max-width: 1000px)");
  const userState = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [searchText, setSearchText] = useState("");

  const navigateHome = async () => {
    setSearchText("");
    const buildings = await getBuildings(1);
    dispatch(setBuildings(buildings));
    navigate("/");
  };

  return (
    <div className="navbar">
      <div className="navbar-left">
        {showTitle && (
          <Typography
            fontSize={20}
            fontWeight={500}
            width={172}
            onClick={navigateHome}
            className="navbar-button"
          >
            Campus Navigator
          </Typography>
        )}
      </div>
      <div className="navbar-middle">
        <SearchBar searchText={searchText} setSearchText={setSearchText} />
      </div>
      <div className="navbar-right">
        {userState ? <UserAvatar user={userState} /> : <LogInButton />}
      </div>
    </div>
  );
}

export default Navbar;
