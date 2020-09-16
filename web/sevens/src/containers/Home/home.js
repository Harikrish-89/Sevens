import * as Actions from "../../store/actions";
import { connect, useSelector } from "react-redux";
import React, { Fragment } from "react";
import AppNav from "../../components/Navbar/Navbar";
import { Redirect, Route, Switch } from "react-router";
import Rules from "../../components/Rules/Rules";
import Play from "./Play/Play";
import Join from "./Join/Join";
import Host from "./Host/Host";
import Game from "./Game/Game";
import TableMessage from "./TableMessage/TableMessage";

export const Home = (props) => {
  const tableMessage = useSelector((state) => {
    return state.game.TableMessage ? state.game.TableMessage : null;
  });

  const gameId = useSelector((state) => {
    return state.game.game ? state.game.game.GameID : null;
  });
  const tableMessageComponent = tableMessage ? (
    <TableMessage tableMessage={tableMessage} gameId={gameId} />
  ) : null;
  let display = (
    <Fragment>
      <AppNav logout={props.logout} relative={props.match.path}>
        {tableMessageComponent}
        <Switch>
          <Route path={props.match.path + "/play"} component={Play} />
          <Route path={props.match.path + "/rules"} component={Rules} />
          <Route path={props.match.path + "/join"} component={Join} />
          <Route path={props.match.path + "/host"} component={Host} />
          <Route path={props.match.path + "/game"} component={Game} />
          <Redirect path={props.match.path} to={props.match.path + "/play"} />
        </Switch>
      </AppNav>
    </Fragment>
  );
  if (props.isLoggedOut) {
    display = <Redirect to="/" />;
  }
  return <div>{display}</div>;
};

const mapStateToProps = (state) => {
  return {
    isLoggedOut: state.auth.token === null,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => {
      dispatch(Actions.logoutAsync());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
