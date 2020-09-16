import React, { Fragment } from "react";
import Navbar from "react-bootstrap/Navbar";
import { Nav } from "react-bootstrap";
import { NavLink as RouterLink } from "react-router-dom";
import { connect } from "react-redux";
import "./Navbar.css";

export const AppNav = (props) => {
  return (
    <Fragment>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Navbar.Brand>
          <RouterLink to="/home" className="nav-link">
            Sevens
          </RouterLink>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            <RouterLink to={props.relative + "/rules"} className="nav-link">
              Rules
            </RouterLink>
          </Nav>
          <img className="icon mr-2"src={props.userIcon} alt="User" />
          <button className="btn btn-secondary" onClick={props.logout}>
            Logout
          </button>
        </Navbar.Collapse>
      </Navbar>
      {props.children}
    </Fragment>
  );
};
const mapStateToProps = (state) => {
  return {
    userIcon: state.auth.user.photoURL,
  };
};
export default connect(mapStateToProps, null)(AppNav);
