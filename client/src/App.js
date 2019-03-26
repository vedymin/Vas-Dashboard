import React, { Component } from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import ScoreTable from "./components/scoreTable";
import NavBar from "./components/navBar";
import Settings from "./components/settings";

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <NavBar />
        <Switch>
          <Route path="/scores" component={ScoreTable} />
          <Route path="/settings" component={Settings} />
          {/* <Route path="/movies/:_id" component={MovieForm} />
        <Route path="/movies" component={Movies} />
        <Route path="/customers" component={Customers} />
        <Route path="/rentals" component={Rentals} />
        <Route path="/not-found" component={NotFound} />
        <Redirect from="/" exact to="/movies" />
        <Redirect to="/not-found" /> */}
        </Switch>
      </React.Fragment>
    );
  }
}

export default App;
