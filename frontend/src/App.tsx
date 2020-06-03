import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Quiz from "./Pages/Quiz";
import { ThemeProvider } from "emotion-theming";
import { ThemePrimary } from "./theme";

function App() {
  return (
    <ThemeProvider theme={ThemePrimary}>
      <div className="App">
        <Router>
          <Route path="/test">
            <Quiz></Quiz>
          </Route>
          <Route exact path="/">
            <h1>Site under construction</h1>
          </Route>
        </Router>
      </div>
    </ThemeProvider>
  );
}

export default App;
