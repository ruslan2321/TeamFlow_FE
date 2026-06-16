import {
  Box,
  Button,
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
import { useNavigate } from "react-router-dom";
import LockIcon from "../Icon/LockIocn";
import EyeIconOff from "../Icon/EyeIconOff";
import EyeIconOn from "../Icon/EyeIconOn";
import LoginIcon from "../Icon/LoginIcon";
import PeopleLoginIcon from "../Icon/PeopleLoginIcon";
import EmailIcon from "../Icon/EmailIcon";
import type { Profile } from "../types/ProfileType";
import { useSendEmailMutation } from "../api/AuthApi";
import { useAddUserMutation } from "../api/ProfileApi";
import { useAuthPageColors } from "../hooks/useAuthPageColors";
import AuthThemeToggle from "../components/ui/AuthThemeToggle";

export default function Register() {
  const colors = useAuthPageColors();
  const [add] = useAddUserMutation();
  const [sendemail, { isLoading }] = useSendEmailMutation();
  const toast = useToast();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState<Omit<Profile, "id">>({
    username: "",
    email: "",
    login: "",
    password: "",
  });

  const togglePasswordVisibility = () => setIsPasswordVisible((prev) => !prev);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await add(formData).unwrap();
      await sendemail({ email: formData.email }).unwrap();
      toast({
        title: "Аккаунт создан",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/");
    } catch {
      toast({
        title: "Ошибка регистрации",
        description: "Пожалуйста, проверьте данные и попробуйте снова",
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
      <AuthThemeToggle />
      {/* Оверлей загрузки */}
      {isLoading && (
        <Box
          position="fixed"
          inset={0}
          bg={colors.overlayBg}
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
        bg={colors.panelBg}
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
            <Heading
              fontWeight="400"
              fontSize={{ base: "2xl", md: "3xl" }}
              color={colors.headingColor}
            >
              TeamFlow
            </Heading>
          </Box>
          <Text
            fontSize="lg"
            color={colors.mutedTextColor}
            textAlign={{ base: "center", md: "left" }}
            maxW="24rem"
          >
            Управляй своими задачами легко!
          </Text>
          <Text
            fontSize={{ base: "xl", md: "22px" }}
            textAlign={{ base: "center", md: "start" }}
            fontWeight="600"
            color={colors.titleColor}
          >
            Создание аккаунта
          </Text>
          <Text
            fontSize="sm"
            color={colors.mutedTextColor}
            textAlign={{ base: "center", md: "start" }}
          >
            создайте аккаунт для доступа к TeamFlow
          </Text>
        </Box>

        {/* Форма */}
        <Box as="form" onSubmit={handleSubmit} w="full" maxW="sm">
          <VStack spacing={4} align="stretch">
            <FormControl>
              <FormLabel color={colors.secondaryLabelColor} fontSize="sm">
                Введите ваше ФИО:
              </FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <PeopleLoginIcon />
                </InputLeftElement>
                <Input
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  type="text"
                  placeholder="Введите ваше ФИО"
                  required
                  size="lg"
                  autoComplete="name"
                />
              </InputGroup>
            </FormControl>

            <FormControl>
              <FormLabel color={colors.secondaryLabelColor} fontSize="sm">
                Email:
              </FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <EmailIcon />
                </InputLeftElement>
                <Input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  type="email"
                  placeholder="Введите вашу почту"
                  required
                  size="lg"
                  autoComplete="email"
                />
              </InputGroup>
            </FormControl>

            <FormControl>
              <FormLabel color={colors.secondaryLabelColor} fontSize="sm">
                Логин:
              </FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <LoginIcon />
                </InputLeftElement>
                <Input
                  name="login"
                  type="text"
                  value={formData.login}
                  onChange={handleChange}
                  placeholder="Введите логин"
                  required
                  size="lg"
                  autoComplete="username"
                />
              </InputGroup>
            </FormControl>

            <FormControl>
              <FormLabel color={colors.secondaryLabelColor} fontSize="sm">
                Пароль:
              </FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <LockIcon />
                </InputLeftElement>
                <Input
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  type={isPasswordVisible ? "text" : "password"}
                  placeholder="Введите пароль"
                  required
                  size="lg"
                  autoComplete="new-password"
                />
                <InputRightElement>
                  <Button
                    variant="ghost"
                    p={0}
                    h="full"
                    minW="auto"
                    onClick={togglePasswordVisibility}
                    _hover={{ bg: "transparent" }}
                    aria-label={
                      isPasswordVisible ? "Скрыть пароль" : "Показать пароль"
                    }
                  >
                    {isPasswordVisible ? <EyeIconOff /> : <EyeIconOn />}
                  </Button>
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
              mt={2}
            >
              Зарегистрироваться
            </Button>
          </VStack>
        </Box>

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
        <Box position="absolute" inset={0} bg={colors.imageOverlayBg} opacity={0.3} />
      </Box>
    </Grid>
  );
}
