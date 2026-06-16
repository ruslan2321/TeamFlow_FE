import { Center, Spinner } from "@chakra-ui/react";

export default function PageLoader() {
  return (
    <Center minH="100dvh" w="full">
      <Spinner size="xl" color="blue.500" thickness="3px" />
    </Center>
  );
}
