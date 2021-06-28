import { BrowserRouter as Router, Switch, Link, Route } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import Profile from "./pages/Profile";
import { ChakraProvider } from "@chakra-ui/react";

import { Flex, Spacer } from "@chakra-ui/react";
import ActionButton from "./components/ActionButton";
import Home from "./pages/Home";
import "./App.css";

function App() {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();
  return (
    <Router>
      <ChakraProvider>
        <Flex w="100%" p={4} color="black" bg="gray.100" align="center">
          <div>
            <Link className="link" to="/">
              Home
            </Link>
            {isAuthenticated && (
              <Link className="link" to="/profile">
                Profiles
              </Link>
            )}
          </div>
          <Spacer />
          {isAuthenticated ? (
            <ActionButton
              onClick={logout}
              children="Log Out"
              colorScheme="red"
              variant="solid"
            />
          ) : (
            <ActionButton
              onClick={loginWithRedirect}
              children="Log In"
              colorScheme="green"
              variant="solid"
            />
          )}
        </Flex>

        <Switch>
          <Route path="/profile">
            <Profile />
          </Route>

          <Route exact path="/">
            <Home />
          </Route>
        </Switch>
      </ChakraProvider>
    </Router>
  );
}

export default App;
