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
  const [passwordShow, setPasswordShow] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const [formData, setFormData] = useState({
    login: "",
    password: "",
  });

  const togglePasswordVisibility = () => setPasswordShow((prev) => !prev);

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
          position: "top",
          status: "success",
          duration: 3000,
          isClosable: true,
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
        isClosable: true,
      });
    }
  };

  return (
    <Grid
      gridTemplateColumns={{ base: "1fr", md: "1fr 1fr" }}
      minH="100vh"
      overflow="hidden"
    >
      {isLoading && (
        <Box
          position="fixed"
          inset={0}
          bg="rgba(255, 255, 255, 0.8)"
          zIndex={9999}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Spinner color="#0099FF" size="lg" />
        </Box>
      )}
      {/* Левая колонка: Форма */}
      <Box
        display="flex"
        flexDirection="column"
        justifyContent={{ base: "flex-start", md: "center" }}
        alignItems="center"
        gap={6}
        px={{ base: 4, md: 8 }}
        py={{ base: 8, md: 0 }}
        overflowY="auto"
        minH="100vh"
        bg="white"
      >
        {/* Заголовок */}
        <Box
          display="flex"
          flexDirection="column"
          alignItems={{ base: "center", md: "start" }}
          gap={2}
          w="full"
          maxW="sm"
        >
          <Box
            display="flex"
            alignItems="center"
            gap={2}
            justifyContent={{ base: "center", md: "flex-start" }}
          >
            <Image src="/icon.png" objectFit="contain" boxSize={8} />
            <Heading fontWeight="400" fontSize={{ base: "2xl", md: "3xl" }}>
              TeamFlow
            </Heading>
          </Box>
          <Text
            fontSize="lg"
            color="gray.600"
            textAlign={{ base: "center", md: "left" }}
            maxW="24rem"
          >
            Управляй своими задачами легко!
          </Text>
        </Box>

        {/* Форма */}
        <Box as="form" onSubmit={handleSubmit} w="full" maxW="sm">
          <VStack spacing={4} align="stretch">
            <FormControl>
              <FormLabel color="black">Логин:</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <LoginIcon />
                </InputLeftElement>
                <Input
                  name="login"
                  value={formData.login}
                  onChange={handleChange}
                  placeholder="Введите логин"
                  size="lg"
                />
              </InputGroup>
            </FormControl>

            <FormControl>
              <FormLabel color="black">Пароль:</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <LockIcon />
                </InputLeftElement>
                <Input
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  type={passwordShow ? "text" : "password"}
                  placeholder="Введите пароль"
                  size="lg"
                />
                <InputRightElement>
                  <Button
                    variant="ghost"
                    p={0}
                    h="full"
                    minW="auto"
                    onClick={togglePasswordVisibility}
                    _hover={{ bg: "transparent" }}
                  >
                    {passwordShow ? <EyeIconOff /> : <EyeIconOn />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>

            <Flex
              align="center"
              justifyContent="space-between"
              w="full"
              flexWrap="wrap"
              gap={2}
            >
              <Flex align="center" gap={2}>
                <Checkbox borderRadius="md" />
                <FormLabel m={0} fontSize="sm" color="gray.700">
                  Запомнить меня
                </FormLabel>
              </Flex>
              <Link
                as={RouterLink}
                to="/resetpass"
                fontSize="sm"
                color="blue.500"
                cursor="pointer"
                _hover={{ textDecoration: "underline" }}
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
          to="/register"
          fontSize="md"
          color="#006AFF"
          cursor="pointer"
          _hover={{ textDecoration: "underline" }}
        >
          Создать аккаунт
        </Link>

        <Text fontSize="sm" color="gray.500" textAlign="center" px={2}>
          Ознакомьтесь с{" "}
          <Text
            as="span"
            color="blue.500"
            cursor="pointer"
            _hover={{ textDecoration: "underline" }}
          >
            политикой сайта
          </Text>
        </Text>
      </Box>

      {/* Правая колонка: Изображение (скрыто на мобильных) */}
      <Box
        display={{ base: "none", md: "block" }}
        position="relative"
        h="100vh"
      >
        <Image src="/bgl.png" h="100vh" w="full" objectFit="cover" />
        <Box position="absolute" inset={0} bg="white" opacity={0.3} />
      </Box>
    </Grid>
  );
}
