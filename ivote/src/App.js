import React, { useEffect, createContext, useReducer, useContext } from "react";
import Navbar from "./components/Navbar";
import { BrowserRouter, Route, Switch, useHistory } from "react-router-dom";
import { reducer, initialState } from "./reducers/userReducer";
import Reset from "./components/screens/reset";
import NewSignUp from "./components/screens/NewSignUp";
import NewSignIn from "./components/screens/NewSignIn";
import HomePage from "./components/screens/HomePage";
import ParticipantsList from "./components/screens/ParticipantsList";
export const UserContext = createContext();

const Routing = () => {
  const history = useHistory();
  const { state, dispatch } = useContext(UserContext);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      dispatch({ type: "USER", payload: user });
    } else {
      if (!history.location.pathname.startsWith("/reset")) {
        history.push("/signin");
      }
    }
  }, []);
  return (
    <Switch>
      <Route exact path="/">
        {" "}
        <HomePage />{" "}
      </Route>
      <Route path="/signin">
        {" "}
        <NewSignIn />{" "}
      </Route>
      <Route path="/signup">
        {" "}
        <NewSignUp />{" "}
      </Route>

      <Route exact path="/voters/:id">
        {" "}
        <ParticipantsList />{" "}
      </Route>

      <Route exact path="/reset">
        {" "}
        <Reset />{" "}
      </Route>
    </Switch>
  );
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <Navbar />
        <Routing />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
