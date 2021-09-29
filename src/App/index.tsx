import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { useGameState } from "../components/Game";
import { Start } from "../screens/Start";
import "./style.scss";

const App = () => {
  const state = useGameState();

  return (
    <Router>
      <Switch>
        <Route path="/start">
          <Start state={state} />
        </Route>
        <Redirect path="/" to="/start" exact />
      </Switch>
    </Router>
  );
};

export default App;
