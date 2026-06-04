import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Grid,
  Heading,
  HStack,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  PinInput,
  PinInputField,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import EmailIcon from "../Icon/EmailIcon";
import LockIcon from "../Icon/LockIocn";
import EyeIconOff from "../Icon/EyeIconOff";
import EyeIconOn from "../Icon/EyeIconOn";
import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useSendCodeMutation } from "../api/AuthApi";
import { useVeryfcodeMutation } from "../api/ProfileApi";

export default function PasswordResetPage() {
  const [sendcode, { isLoading }] = useSendCodeMutation();
  const [veryfcode] = useVeryfcodeMutation();
  const toast = useToast();
  const navigation = useNavigate();
  const [passwordShow, setpasswordShow] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    code: "",
    password: "",
  });
  const PasswordVisible = () => {
    setpasswordShow((prev) => !prev);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const SendCodeEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await sendcode({
        email: formData.email,
      }).unwrap();
      toast({
        title: "Код отправлен на почту",
        description: "",
        status: "success",
        duration: 3000,
        isClosable: false,
      });
    } catch {
      toast({
        title: "Ошибка отправки",
        status: "error",
        duration: 3000,
        isClosable: false,
      });
    }
  };
    const ResetPassword = async (e: React.FormEvent) => {
      e.preventDefault();

      try {
        await veryfcode({ email: formData.email, code: formData.code }).unwrap();
        toast({
          title: "Пароль изменен",
          description: "",
          status: "success",
          duration: 3000,
          isClosable: false,
        });
        navigation("/");
      } catch {
        toast({
          title: "Ошибка при изменение пароля",
          description: "",
          status: "error",
          duration: 3000,
          isClosable: false,
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
          <Text
            fontSize={{ base: "xl", md: "22px" }}
            fontWeight="600"
            textAlign={{ base: "center", md: "start" }}
          >
            Сброс пароля
          </Text>
          <Text
            fontSize="sm"
            color="gray.600"
            textAlign={{ base: "center", md: "start" }}
          >
            для сброса пароля введите вашу почту
          </Text>
        </Box>

        <Box as="form" w="full" maxW="sm">
          <VStack spacing="1rem" align="stretch">
            <FormControl>
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
              <InputGroup>
                <InputLeftElement>
                  <LockIcon />
                </InputLeftElement>
                <Input
                  name="password"
                  type={passwordShow ? "password" : "text"}
                  placeholder="Введите новый пароль"
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
            <FormControl>
              <FormLabel color="black" opacity={0.5}>
                Введите код:
              </FormLabel>
              <HStack spacing={2}>
                <PinInput otp size={"lg"} type="number" onChange={(value) => setFormData({...formData, code:value})} >
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                </PinInput>
              </HStack>
            </FormControl>
            <Button
              onClick={SendCodeEmail}
              w="full"
              bg="#6155F5"
              color="white"
              size="lg"
              _hover={{ bg: "#5348d8" }}
              boxShadow="md"
            >
              Оптравить код
            </Button>
            <Button
              onClick={ResetPassword}
              w="full"
              bg="#6155F5"
              color="white"
              size="lg"
              _hover={{ bg: "#5348d8" }}
              boxShadow="md"
            >
              Сбросить пароль
            </Button>
          </VStack>
        </Box>
        <Text>
          Ознакомится с <span style={{ color: "blue" }}>политикой сайта </span>
        </Text>
      </Box>

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
