import React from "react";
import AppBar from "@material-ui/core/AppBar";
import { Toolbar } from "@material-ui/core";
import { Button } from "@material-ui/core";
import "../styles/NavBarHome.css";
import logo from "../images/3.png";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";

const useStyles = makeStyles({
  navBar: {
    flexWrap: "wrap",
    display: "flex",
    position: "fixed",
    padding: "20px 0 20px 20px",
    background:
      "linear-gradient(180deg, rgba(2, 0, 36, 1) 0%, rgb(44, 44, 51) 35%, rgba(255,255,255,0))",
    border: 0,
    boxShadow: "none",
    boxSizing: "border-box",
    justifyContent: "space-between",
    alignItems: "center",
  },
  login: {
    margin: "0 0 0 10px",
    padding: "3 3 3 3",
    fontSize: "120%",
    borderRadius: "5px",
    background: "#fe5d61",
    fontFamily: "Segoe UI",
    "&:hover": {
      backgroundColor: "#f23333",
    },
  },
  signup: {
    margin: "0 0 0 1200px",
    padding: "3 3 3 3",
    fontSize: "120%",
    borderRadius: "5px",
    background: "#fe5d61",
    fontFamily: "Segoe UI",
    "&:hover": {
      backgroundColor: "#f23333",
    },
  },
});
function NavBarHome() {
  const classes = useStyles();
  return (
    <div>
      <AppBar className={classes.navBar} position="static">
        <Toolbar className="toolbar">
          <img src={logo} alt="logo" width="300" />
          <Button
            component={Link}
            to={"/register"}
            className={classes.signup}
            color="inherit"
          >
            Sign Up
          </Button>
          <Button className={classes.login} color="inherit">
            Login
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default NavBarHome;
