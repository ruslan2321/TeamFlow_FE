import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
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
import { useAuthPageColors } from "../hooks/useAuthPageColors";
import AuthThemeToggle from "../components/ui/AuthThemeToggle";
import {
  hasFormErrors,
  mapLoginApiErrors,
  validateLogin,
  type FormErrors,
  type LoginField,
} from "../utils/auth.validation";

export default function Login() {
  const colors = useAuthPageColors();
  const [loginMutation, { isLoading }] = useLoginMutation();
  const [passwordShow, setPasswordShow] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const [formData, setFormData] = useState({
    login: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors<LoginField>>({});
  const [touched, setTouched] = useState<Partial<Record<LoginField, boolean>>>(
    {},
  );

  const togglePasswordVisibility = () => setPasswordShow((prev) => !prev);

  const showError = (field: LoginField) =>
    Boolean(touched[field] && errors[field]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const field = name as LoginField;

    setFormData((prev) => ({ ...prev, [field]: value }));

    if (touched[field]) {
      const next = validateLogin({ ...formData, [field]: value });
      setErrors((prev) => ({
        ...prev,
        [field]: next[field],
        form: undefined,
      }));
    }
  };

  const handleBlur = (field: LoginField) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const next = validateLogin(formData);
    setErrors((prev) => ({ ...prev, [field]: next[field] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateLogin(formData);
    setErrors(validationErrors);
    setTouched({ login: true, password: true });

    if (hasFormErrors(validationErrors)) return;

    try {
      const res = await loginMutation({
        login: formData.login.trim(),
        password: formData.password,
      }).unwrap();

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
    } catch (err) {
      const apiErrors = mapLoginApiErrors(err);
      setErrors(apiErrors);
      toast({
        title: "Ошибка входа",
        position: "top",
        description: apiErrors.form ?? "Неверный логин или пароль",
        status: "error",
        duration: 4000,
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
        </Box>

        <Box as="form" onSubmit={handleSubmit} w="full" maxW="sm" noValidate>
          <VStack spacing={4} align="stretch">
            {errors.form && (
              <Alert status="error" borderRadius="md" fontSize="sm">
                <AlertIcon />
                {errors.form}
              </Alert>
            )}

            <FormControl isInvalid={showError("login")} isRequired>
              <FormLabel color={colors.labelColor}>Логин:</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <LoginIcon />
                </InputLeftElement>
                <Input
                  name="login"
                  value={formData.login}
                  onChange={handleChange}
                  onBlur={() => handleBlur("login")}
                  placeholder="Введите логин"
                  size="lg"
                  autoComplete="username"
                />
              </InputGroup>
              <FormErrorMessage>{errors.login}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={showError("password")} isRequired>
              <FormLabel color={colors.labelColor}>Пароль:</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <LockIcon />
                </InputLeftElement>
                <Input
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={() => handleBlur("password")}
                  type={passwordShow ? "text" : "password"}
                  placeholder="Введите пароль"
                  size="lg"
                  autoComplete="current-password"
                />
                <InputRightElement>
                  <Button
                    variant="ghost"
                    p={0}
                    h="full"
                    minW="auto"
                    onClick={togglePasswordVisibility}
                    _hover={{ bg: "transparent" }}
                    type="button"
                  >
                    {passwordShow ? <EyeIconOff /> : <EyeIconOn />}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{errors.password}</FormErrorMessage>
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
                <FormLabel m={0} fontSize="sm" color={colors.secondaryLabelColor}>
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
              isLoading={isLoading}
              loadingText="Вход..."
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
