import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Quiz from "./Pages/Quiz";
import { ThemeProvider } from "emotion-theming";
import { ThemePrimary } from "./theme";
import Landing from './Pages/Landing'
import './database'
function App() {
  return (
    <ThemeProvider theme={ThemePrimary}>
      <div className="App">
        <Router>
          <Route path="/quiz">
            <Quiz></Quiz>
          </Route>
          <Route exact path="/">
            <Landing></Landing>
          </Route>
        </Router>
      </div>
    </ThemeProvider>
  );
}

export default App;
