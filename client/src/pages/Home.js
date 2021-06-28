import { Flex, Heading } from "@chakra-ui/react";
import HitProtectedAPI from "../components/HitProtectedApi";
const Home = () => {
  return (
    <Flex h="80vh" align="center" justify="center" direction="column">
      <Heading size="3xl" mb="2vh">
        Hello, welcome.{" "}
      </Heading>

      <HitProtectedAPI />
    </Flex>
  );
};

export default Home;
