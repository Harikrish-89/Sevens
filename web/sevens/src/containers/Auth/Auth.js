import React, { Fragment } from "react";
import { connect } from "react-redux";
import * as Actions from "../../store/actions";
import sevensImage from "../../assets/images/sevens.jpg";
import "./Auth.css";
import { Redirect } from "react-router";
import Spinner from "../../components/Spinner/Spinner";

export const Auth = (props) => {
  let display = (
    <Fragment>
      <div className="card-group">
        <div className="card mb-3 text-center container">
          <div className="text-center">
            <img className="card-img-top img" src={sevensImage} alt="Sevens" />
          </div>
          <div className="card-body">
            <h5 className="card-title">Welcome to sevens</h5>
            <button className="btn btn-primary" onClick={props.onLogin}>
              Sign In with google
            </button>
          </div>
        </div>
      </div>
    </Fragment>
  );
  let authRedirect = null;
  if (props.isLoggedIn) {
    authRedirect = <Redirect to="/home" />;
  }

  if (props.isLoading) {
    display = <Spinner />;
  }
  return (
    <div>
      {display} {authRedirect}
    </div>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    onLogin: () => {
      dispatch(Actions.signInAsync());
    },
  };
};

const mapStateToProps = (state) => {
  return {
    isLoading: state.auth.isLoading,
    isLoggedIn: state.auth.token != null,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
