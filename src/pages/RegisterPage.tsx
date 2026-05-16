import {
  Alert,
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
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { useToast } from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import LockIcon from "../Icon/LockIocn";
import EyeIconOff from "../Icon/EyeIconOff";
import EyeIconOn from "../Icon/EyeIconOn";
import LoginIcon from "../Icon/LoginIcon";
import PeopleLoginIcon from "../Icon/PeopleLoginIcon";
import EmailIcon from "../Icon/EmailIcon";
import type { Profile } from "../types/ProfileType";
import { useSendEmailMutation } from "../api/AuthApi";
import { useAddUserMutation } from "../api/ProfileApi";

export default function Register() {
  const [add] = useAddUserMutation();
  const [sendemail, { isLoading }] = useSendEmailMutation();
  const toast = useToast();
  const [passwordShow, setpasswordShow] = useState(true);
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Omit<Profile, "id">>({
    username: "",
    email: "",
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
      await add(formData).unwrap();
      await sendemail({
        email: formData.email,
      }).unwrap();
      toast({
        title: "Аккаунт создан",
        description: "",
        status: "success",
        duration: 3000,
        isClosable: false,
      });
      navigate("/");
    } catch {
      toast({
        title: "Произошла ошибка при создание аккаунта",
        description: "",
        status: "error",
        duration: 3000,
        isClosable: false,
      });
    }
  };

  return (
    <Grid gridTemplateColumns="50% 50%">
      {isLoading ? (
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
      ) : null}
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        gap="1.5rem"
        px="8"
      >
        <Box display="flex" flexDirection="column" alignItems="start" gap="8px">
          <Box display="flex" alignItems="start" gap="0.5rem">
            <Image src="/icon.png" objectFit="contain" />
            <Heading fontWeight={"400"}>TeamFlow</Heading>
          </Box>
          <Text fontSize="lg" color="gray.600" textAlign="center" maxW="24rem">
            Управляй своими задачами легко!
          </Text>
          <Text textAlign={"start"} w={"20rem"} fontSize={"22px"}>
            Создание аккаунта
          </Text>
          <Text
            textAlign={"start"}
            w={"20rem"}
            fontSize={"15px"}
            color={"#000000"}
            opacity={0.5}
          >
            создайте аккаунт для доступа к TeamFlow
          </Text>
        </Box>

        <Box as="form" onSubmit={handleSubmit} maxW="20rem" w="full">
          <VStack spacing="1rem" align="stretch">
            <FormControl>
              <FormLabel color="black" opacity={0.5}>
                Введите ваше ФИО:
              </FormLabel>
              <InputGroup>
                <InputLeftElement>
                  <PeopleLoginIcon />
                </InputLeftElement>
                <Input
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  type="text"
                  placeholder="Введите ваше ФИО"
                  required
                />
              </InputGroup>
            </FormControl>
            <FormControl>
              <FormLabel color="black" opacity={0.5}>
                Email:
              </FormLabel>
              <InputGroup>
                <InputLeftElement>
                  <EmailIcon />
                </InputLeftElement>
                <Input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  type="email"
                  placeholder="Введите вашу поту"
                  required
                />
              </InputGroup>
            </FormControl>
            <FormControl>
              <FormLabel color="black" opacity={0.5}>
                Логин:
              </FormLabel>
              <InputGroup>
                <InputLeftElement>
                  <LoginIcon />
                </InputLeftElement>
                <Input
                  name="login"
                  type="text"
                  value={formData.login}
                  onChange={handleChange}
                  placeholder="Введите логин"
                  required
                />
              </InputGroup>
            </FormControl>

            <FormControl>
              <FormLabel color="black" opacity={0.5}>
                Пароль:
              </FormLabel>
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
                  required
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
            <Button
              type="submit"
              w="full"
              bg="#6155F5"
              color="white"
              size="lg"
              _hover={{ bg: "#5348d8" }}
              boxShadow="md"
            >
              Зарегистрироваться
            </Button>
          </VStack>
        </Box>
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
