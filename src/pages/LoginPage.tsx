import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Heading,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Link,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useLoginMutation } from "../api/AuthApi";
import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import LockIcon from "../Icon/LockIocn";
import EyeIconOff from "../Icon/EyeIconOff";
import EyeIconOn from "../Icon/EyeIconOn";
import { useToast } from "@chakra-ui/react";
import LoginIcon from "../Icon/LoginIcon";

export default function Login() {
  const [loginMutation, { isLoading }] = useLoginMutation();
  const [passwordShow, setpasswordShow] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const [formData, setFormData] = useState({
    login: "",
    password: "",
  });
  const PasswordVisible = () => {
    setpasswordShow((prev) => !prev);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await loginMutation(formData).unwrap();
      localStorage.setItem("authToken", res.token);
      if (res.token) {
        const { token, ...userData } = res;

        localStorage.setItem("user", JSON.stringify(userData));
        toast({
          title: "Вход успешен",
          description: "",
          position: "top",
          status: "success",
          duration: 3000,
          isClosable: false,
        });
        navigate("/task");
      }
    } catch {
      toast({
        title: "Ошибка входа",
        position: "top",
        description: "Неверный логин или пароль",
        status: "error",
        duration: 3000,
        isClosable: false,
      });
    }
  };

  if (isLoading) {
    return (
      <Box
        position="fixed"
        top={0}
        left={0}
        w="100vw"
        h="100vh"
        bg="rgba(255, 255, 255, 0.8)"
        zIndex="9999"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Spinner color="#0099FF" size={"lg"} />
      </Box>
    );
  }

  return (
    <Grid gridTemplateColumns="50% 50%">
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        gap="1.5rem"
        px="8"
      >
        <Box display="flex" flexDirection="column" alignItems="start" gap="8px">
          <Box display="flex" alignItems="center" gap="0.5rem">
            <Image src="/icon.png" objectFit="contain" />
            <Heading fontWeight={"400"}>TeamFlow</Heading>
          </Box>
          <Text fontSize="lg" color="gray.600" textAlign="center" maxW="24rem">
            Управляй своими задачами легко!
          </Text>
        </Box>

        <Box as="form" onSubmit={handleSubmit} maxW="20rem" w="full">
          <VStack spacing="1rem" align="stretch">
            <FormControl>
              <FormLabel color="black">Логин:</FormLabel>
              <InputGroup>
                <InputLeftElement>
                  <LoginIcon />
                </InputLeftElement>
                <Input
                  name="login"
                  value={formData.login}
                  onChange={handleChange}
                  placeholder="Введите логин"
                />
              </InputGroup>
            </FormControl>

            <FormControl>
              <FormLabel color="black">Пароль:</FormLabel>
              <InputGroup>
                <InputLeftElement>
                  <LockIcon />
                </InputLeftElement>
                <Input
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  type={passwordShow ? "password" : "text"}
                  placeholder="Введите пароль"
                />
                <InputRightElement>
                  {passwordShow ? (
                    <EyeIconOff onClick={PasswordVisible} />
                  ) : (
                    <EyeIconOn onClick={PasswordVisible} />
                  )}
                </InputRightElement>
              </InputGroup>
            </FormControl>

            <Flex align="center" gap="0.5rem">
              <Checkbox borderRadius="md" />
              <FormLabel m={0} fontSize="sm" color="gray.700">
                Запомнить меня
              </FormLabel>
              <Link
                as={RouterLink}
                to={"/resetpass"}
                textAlign={"end"}
                w={"11rem"}
                fontSize="sm"
                color="blue.500"
                cursor="pointer"
                _hover={{ textDecoration: "underline" }}
                alignSelf="flex-end"
              >
                Забыл пароль?
              </Link>
            </Flex>
            <Button
              type="submit"
              w="full"
              bg="#6155F5"
              color="white"
              size="lg"
              _hover={{ bg: "#5348d8" }}
              boxShadow="md"
            >
              Войти
            </Button>
          </VStack>
        </Box>
        <Link
          as={RouterLink}
          to={"/register"}
          w={"11rem"}
          fontSize="16px"
          color="#006AFF"
          cursor="pointer"
          _hover={{ textDecor: undefined }}
        >
          Создать аккаунт
        </Link>
        <Text>
          Ознакомится с <span style={{ color: "blue" }}>политикой сайта </span>
        </Text>
      </Box>

      <Box position="relative">
        <Image src="/bgl.png" h="100vh" w="full" objectFit="cover" />
        <Box
          position="absolute"
          top="0"
          left="0"
          w="full"
          h="full"
          bg="white"
          opacity="0.3"
        />
      </Box>
    </Grid>
  );
}
