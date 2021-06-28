import React from "react";
import { Button } from "@chakra-ui/react";
import { useAuth0 } from "@auth0/auth0-react";

function HitProtectedAPI() {
  const { getAccessTokenSilently } = useAuth0();
  const [error, setError] = React.useState(null);

  const apiCall = async () => {
    console.log("fetching api now");
    let accessToken;
    try {
      accessToken = await getAccessTokenSilently();
    } catch (err) {
      console.error(err);
    }
    try {
      let res = await fetch(`/api/protected/`, {
        headers: { authorization: `Bearer ${accessToken}` },
      });

      console.log(res);
      let message;
      if (res.status === 200) {
        res = await res.json();
        message = res.message;
      } else {
        message = res.statusText;
      }
      window.alert(message);
    } catch (err) {
      window.alert(err);
      setError(err);
    }
  };

  return (
    <Button colorScheme="purple" onClick={apiCall}>
      Protected API
    </Button>
  );
}

export default HitProtectedAPI;
