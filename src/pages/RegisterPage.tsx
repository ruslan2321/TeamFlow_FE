import {
  Alert,
  AlertIcon,
  Box,
  Button,
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
import { useSendEmailMutation } from "../api/AuthApi";
import { useAddUserMutation } from "../api/ProfileApi";
import { useAuthPageColors } from "../hooks/useAuthPageColors";
import AuthThemeToggle from "../components/ui/AuthThemeToggle";
import {
  hasFormErrors,
  mapRegisterApiErrors,
  validateRegister,
  type FormErrors,
  type RegisterField,
  type RegisterFormData,
} from "../utils/auth.validation";

export default function Register() {
  const colors = useAuthPageColors();
  const [add, { isLoading: isRegistering }] = useAddUserMutation();
  const [sendemail, { isLoading: isSendingEmail }] = useSendEmailMutation();
  const toast = useToast();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigate = useNavigate();
  const isLoading = isRegistering || isSendingEmail;

  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    email: "",
    login: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors<RegisterField>>({});
  const [touched, setTouched] = useState<
    Partial<Record<RegisterField, boolean>>
  >({});

  const togglePasswordVisibility = () => setIsPasswordVisible((prev) => !prev);

  const showError = (field: RegisterField) =>
    Boolean(touched[field] && errors[field]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const field = name as RegisterField;

    setFormData((prev) => ({ ...prev, [field]: value }));

    if (touched[field]) {
      const next = validateRegister({ ...formData, [field]: value });
      setErrors((prev) => ({
        ...prev,
        [field]: next[field],
        form: undefined,
      }));
    }
  };

  const handleBlur = (field: RegisterField) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const next = validateRegister(formData);
    setErrors((prev) => ({ ...prev, [field]: next[field] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateRegister(formData);
    setErrors(validationErrors);
    setTouched({
      name: true,
      email: true,
      login: true,
      password: true,
    });

    if (hasFormErrors(validationErrors)) return;

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      login: formData.login.trim(),
      password: formData.password,
    };

    try {
      await add(payload).unwrap();
      await sendemail({ email: payload.email }).unwrap();
      toast({
        title: "Аккаунт создан",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/");
    } catch (err) {
      const apiErrors = mapRegisterApiErrors(err);
      setErrors(apiErrors);
      toast({
        title: "Ошибка регистрации",
        description: apiErrors.form ?? "Проверьте данные формы",
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

        <Box as="form" onSubmit={handleSubmit} w="full" maxW="sm" noValidate>
          <VStack spacing={4} align="stretch">
            {errors.form && (
              <Alert status="error" borderRadius="md" fontSize="sm">
                <AlertIcon />
                {errors.form}
              </Alert>
            )}

            <FormControl isInvalid={showError("name")} isRequired>
              <FormLabel color={colors.secondaryLabelColor} fontSize="sm">
                Введите ваше ФИО:
              </FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <PeopleLoginIcon />
                </InputLeftElement>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={() => handleBlur("name")}
                  type="text"
                  placeholder="Введите ваше ФИО"
                  size="lg"
                  autoComplete="name"
                />
              </InputGroup>
              <FormErrorMessage>{errors.name}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={showError("email")} isRequired>
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
                  onBlur={() => handleBlur("email")}
                  type="email"
                  placeholder="Введите вашу почту"
                  size="lg"
                  autoComplete="email"
                />
              </InputGroup>
              <FormErrorMessage>{errors.email}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={showError("login")} isRequired>
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
                  onBlur={() => handleBlur("login")}
                  placeholder="Введите логин"
                  size="lg"
                  autoComplete="username"
                />
              </InputGroup>
              <FormErrorMessage>{errors.login}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={showError("password")} isRequired>
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
                  onBlur={() => handleBlur("password")}
                  type={isPasswordVisible ? "text" : "password"}
                  placeholder="Введите пароль"
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
                    type="button"
                    aria-label={
                      isPasswordVisible ? "Скрыть пароль" : "Показать пароль"
                    }
                  >
                    {isPasswordVisible ? <EyeIconOff /> : <EyeIconOn />}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{errors.password}</FormErrorMessage>
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
              isLoading={isLoading}
              loadingText="Регистрация..."
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
