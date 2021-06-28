import React from "react";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { Flex, Text, Image } from "@chakra-ui/react";

function Profile() {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    isAuthenticated && (
      <Flex h="80vh" align="center" justify="center">
        <div>
          <br />
          <Image src={user.picture} alt={user.name} boxSize="150px" />
          <Text fontSize="4xl">{user.name}</Text>
          <Text fontSize="lg">{user.email}</Text>
        </div>
      </Flex>
    )
  );
}

export default withAuthenticationRequired(Profile, {
  onRedirecting: () => <div>Loading...</div>,
});
