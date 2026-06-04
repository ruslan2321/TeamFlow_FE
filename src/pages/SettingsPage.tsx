import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Text,
  Heading,
  Card,
  CardBody,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  Switch,
  Select,
  SimpleGrid,
  Divider,
  Badge,
  Icon,
  useColorModeValue,
  useToast,
  VStack,
  HStack,
  FormLabel,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  FormControl,
  Container,
  Progress,
  FormHelperText,
} from "@chakra-ui/react";
import {
  EmailIcon,
  LockIcon,
  CheckIcon,
  SunIcon,
  BellIcon,
  ViewIcon,
  TimeIcon,
  DownloadIcon,
  InfoOutlineIcon,
  RepeatIcon,
} from "@chakra-ui/icons";

import AppPageLayout from "../components/layout/AppPageLayout";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
} from "../api/ProfileApi";

interface ProfileSettings {
  username: string;
  email: string;
  role: string;
  avatar?: string;
  aboutme?: string;
  location?: string;
  departament: string;
}

interface SiteSettings {
  theme: "light" | "dark" | "system";
  language: string;
  timezone: string;
  notifications: {
    email: boolean;
    push: boolean;
    weekly: boolean;
  };
  privacy: {
    profileVisible: boolean;
    showOnline: boolean;
  };
}

interface SecuritySettings {
  passwordLastChanged: string;
  twoFactorEnabled: boolean;
  sessions: Array<{
    device: string;
    location: string;
    active: boolean;
    lastActive: string;
  }>;
}

const SettingsCard: React.FC<{
  title: string;
  description?: string;
  children: React.ReactNode;
  icon?: any;
  mb?: number | string;
}> = ({ title, description, children, icon, mb = 6 }) => {
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.100", "gray.700");
  const hoverBorder = useColorModeValue("blue.200", "blue.700");

  return (
    <Card
      borderRadius="2xl"
      border="1px"
      borderColor={borderColor}
      bg={cardBg}
      mb={mb}
      boxShadow="sm"
      transition="all 0.3s ease"
      _hover={{
        boxShadow: "md",
        transform: "translateY(-2px)",
        borderColor: hoverBorder,
      }}
    >
      <CardBody p={8}>
        <Flex align="start" gap={5} mb={8}>
          {icon && (
            <Box
              p={3}
              borderRadius="xl"
              bgGradient="linear(to-br, blue.50, indigo.50)"
              _dark={{ bgGradient: "linear(to-br, blue.900, indigo.900)" }}
              color="blue.600"
              boxShadow="sm"
            >
              <Icon as={icon} boxSize={6} />
            </Box>
          )}
          <Box>
            <Heading
              size="md"
              fontWeight="bold"
              color={useColorModeValue("gray.800", "white")}
              letterSpacing="-0.02em"
            >
              {title}
            </Heading>
            {description && (
              <Text fontSize="sm" color="gray.500" mt={1.5} lineHeight="1.4">
                {description}
              </Text>
            )}
          </Box>
        </Flex>
        {children}
      </CardBody>
    </Card>
  );
};

const StyledInput: React.FC<any> = (props) => {
  const bg = useColorModeValue("gray.50", "gray.700/50");
  const border = useColorModeValue("gray.200", "gray.600");

  return (
    <Input
      borderRadius="xl"
      size="md"
      focusBorderColor="blue.500"
      errorBorderColor="red.300"
      _placeholder={{ opacity: 0.5, color: "gray.500" }}
      bg={bg}
      border="1px solid"
      borderColor={border}
      _hover={{
        borderColor: "blue.300",
        bg: useColorModeValue("white", "gray.700"),
      }}
      transition="all 0.2s"
      h="45px"
      {...props}
    />
  );
};

const ToggleRow: React.FC<{
  label: string;
  description: string;
  isChecked: boolean;
  onChange: (val: boolean) => void;
  icon?: any;
}> = ({ label, description, isChecked, onChange, icon }) => {
  const bgHover = useColorModeValue("gray.50", "whiteAlpha.100");

  return (
    <Flex
      justify="space-between"
      align="center"
      p={4}
      borderRadius="xl"
      cursor="pointer"
      onClick={() => onChange(!isChecked)}
      _hover={{ bg: bgHover }}
      transition="background 0.2s"
    >
      <HStack spacing={4} align="start">
        {icon && (
          <Box
            mt={1}
            color={isChecked ? "blue.500" : "gray.400"}
            transition="color 0.2s"
          >
            <Icon as={icon} boxSize={5} />
          </Box>
        )}
        <Box>
          <Text
            fontWeight="semibold"
            fontSize="sm"
            color={useColorModeValue("gray.700", "gray.200")}
          >
            {label}
          </Text>
          <Text fontSize="xs" color="gray.500" mt={0.5} maxW="300px">
            {description}
          </Text>
        </Box>
      </HStack>
      <Switch
        size="md"
        isChecked={isChecked}
        onChange={(e) => {
          e.stopPropagation();
          onChange(e.target.checked);
        }}
        colorScheme="blue"
        onClick={(e) => e.stopPropagation()}
      />
    </Flex>
  );
};

export default function SettingsPage() {
  const [profile, setProfile] = useState<ProfileSettings>({
    username: "",
    email: "",
    role: "",
    departament: "",
    aboutme: "",
  });

  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    theme: "system",
    language: "ru",
    timezone: "Europe/Moscow",
    notifications: {
      email: true,
      push: true,
      weekly: false,
    },
    privacy: {
      profileVisible: true,
      showOnline: true,
    },
  });

  const [security, setSecurity] = useState<SecuritySettings>({
    passwordLastChanged: "",
    twoFactorEnabled: false,
    sessions: [],
  });

  const [isSavingLocal, setIsSavingLocal] = useState(false);
  const toast = useToast();

  const [updateProfile, { isLoading: isSaving }] = useUpdateProfileMutation();
  const { data: userProfile, isLoading: isProfileLoading } =
    useGetProfileQuery(1); // Замените 1 на реальный ID из auth store

  useEffect(() => {
    if (userProfile) {
      setProfile({
        username: userProfile.username || "",
        email: userProfile.email || "",
        role: userProfile.role || "",
        departament: userProfile.department || "",
        aboutme: userProfile.aboutMe|| "",
        location: userProfile.location || "",
      });
    }
  }, [userProfile]);

  const pageBg = useColorModeValue("#F8FAFC", "gray.900");
  const textColor = useColorModeValue("gray.800", "white");
  const subTextColor = useColorModeValue("gray.500", "gray.400");

  const handleSaveProfile = async () => {
    try {
      await updateProfile({
        username: profile.username,
        email: profile.email,
        role: profile.role,
        location: profile.location,
        department: profile.departament,
        aboutMe: profile.aboutme,
      }).unwrap();

      toast({
        title: "Профиль обновлён",
        description: "Изменения успешно сохранены",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    } catch (error: any) {
      const errorMessage =
        error.data?.message || "Не удалось сохранить изменения";

      toast({
        title: "Ошибка",
        description: errorMessage,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  const handleSaveSettings = async () => {
    setIsSavingLocal(true);
    await new Promise((res) => setTimeout(res, 800));
    setIsSavingLocal(false);
    toast({
      title: "Настройки сохранены",
      status: "success",
      duration: 3000,
    });
  };

  if (isProfileLoading) {
    return (
      <Flex h="100vh" justify="center" align="center" bg={pageBg}>
        <Progress size="xs" isIndeterminate w="200px" />
      </Flex>
    );
  }

  return (
    <AppPageLayout bg={pageBg}>
      <Flex
        flex="1"
        direction="column"
        overflowY="auto"
        minH={0}
        fontFamily="'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
        css={{
          "&::-webkit-scrollbar": { width: "6px" },
          "&::-webkit-scrollbar-track": { background: "transparent" },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: useColorModeValue("gray.200", "gray.700"),
            borderRadius: "10px",
          },
        }}
      >
        <Container maxW="container.xl" py={{ base: 6, xl: 12 }}>
          <Box mb={10}>
            <Heading
              size="xl"
              fontWeight="800"
              color={textColor}
              letterSpacing="-0.03em"
              mb={2}
            >
              Настройки
            </Heading>
            <Text color={subTextColor} fontSize="md">
              Управляйте своим профилем, безопасностью и предпочтениями
              приложения.
            </Text>
          </Box>

          <Tabs variant="unstyled" isLazy>
            <TabList
              mb={10}
              p={1}
              bg={useColorModeValue("gray.100", "gray.800")}
              borderRadius="xl"
              display="inline-flex"
              w="auto"
            >
              <Tab
                _selected={{
                  bg: useColorModeValue("white", "gray.700"),
                  color: "blue.600",
                  shadow: "sm",
                }}
                py={2.5}
                px={6}
                borderRadius="lg"
                fontWeight="600"
                fontSize="sm"
                color={subTextColor}
                transition="all 0.2s"
              >
                Профиль
              </Tab>
              <Tab
                _selected={{
                  bg: useColorModeValue("white", "gray.700"),
                  color: "blue.600",
                  shadow: "sm",
                }}
                py={2.5}
                px={6}
                borderRadius="lg"
                fontWeight="600"
                fontSize="sm"
                color={subTextColor}
                transition="all 0.2s"
              >
                Приложение
              </Tab>
              <Tab
                _selected={{
                  bg: useColorModeValue("white", "gray.700"),
                  color: "blue.600",
                  shadow: "sm",
                }}
                py={2.5}
                px={6}
                borderRadius="lg"
                fontWeight="600"
                fontSize="sm"
                color={subTextColor}
                transition="all 0.2s"
              >
                Безопасность
              </Tab>
            </TabList>

            <TabPanels>
              <TabPanel px={0} pt={2}>
                <SimpleGrid columns={{ base: 1, xl: 3 }} spacing={8}>
                  <Box gridColumn={{ xl: "span 2" }}>
                    <SettingsCard
                      title="Личная информация"
                      description="Эти данные будут видны другим пользователям"
                    >
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                        <FormControl>
                          <FormLabel fontSize="sm" fontWeight="medium" mb={2}>
                            Имя пользователя
                          </FormLabel>
                          <InputGroup>
                            <InputLeftElement pointerEvents="none">
                              <Icon
                                as={ViewIcon}
                                color="gray.400"
                                boxSize={4}
                              />
                            </InputLeftElement>
                            <StyledInput
                              value={profile.username}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                setProfile({
                                  ...profile,
                                  username: e.target.value,
                                })
                              }
                              pl={10}
                            />
                          </InputGroup>
                        </FormControl>

                        <FormControl>
                          <FormLabel fontSize="sm" fontWeight="medium" mb={2}>
                            Роль / Должность
                          </FormLabel>
                          <StyledInput
                            value={profile.role}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              setProfile({ ...profile, role: e.target.value })
                            }
                          />
                        </FormControl>
                      </SimpleGrid>

                      <FormControl mt={6}>
                        <FormLabel fontSize="sm" fontWeight="medium" mb={2}>
                          Email адрес
                        </FormLabel>
                        <InputGroup>
                          <InputLeftElement pointerEvents="none">
                            <EmailIcon color="gray.400" />
                          </InputLeftElement>
                          <StyledInput
                            value={profile.email}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              setProfile({ ...profile, email: e.target.value })
                            }
                            pl={10}
                          />
                        </InputGroup>
                        <FormHelperText fontSize="xs" color="gray.500" mt={2}>
                          Мы никогда не поделимся вашим email.
                        </FormHelperText>
                      </FormControl>

                      <FormControl mt={6}>
                        <FormLabel fontSize="sm" fontWeight="medium" mb={2}>
                          О себе
                        </FormLabel>
                        <StyledInput
                          value={profile.aboutme}
                          onChange={(e: any) =>
                            setProfile({ ...profile, aboutme: e.target.value })
                          }
                          placeholder="Пару слов о вас..."
                        />
                      </FormControl>

                      <SimpleGrid
                        columns={{ base: 1, md: 2 }}
                        spacing={6}
                        mt={6}
                      >
                        <FormControl>
                          <FormLabel fontSize="sm" fontWeight="medium" mb={2}>
                            Локация
                          </FormLabel>
                          <StyledInput
                            value={profile.location}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              setProfile({
                                ...profile,
                                location: e.target.value,
                              })
                            }
                          />
                        </FormControl>
                      </SimpleGrid>

                      <Flex
                        justify="flex-end"
                        gap={4}
                        mt={10}
                        pt={6}
                        borderTop="1px"
                        borderColor="gray.100"
                      >
                        <Button
                          variant="ghost"
                          borderRadius="xl"
                          _hover={{ bg: "gray.100" }}
                        >
                          Отмена
                        </Button>
                        <Button
                          colorScheme="blue"
                          borderRadius="xl"
                          px={8}
                          onClick={handleSaveProfile}
                          isLoading={isSaving}
                          boxShadow="lg"
                          _hover={{
                            transform: "translateY(-1px)",
                            boxShadow: "xl",
                          }}
                          transition="all 0.2s"
                        >
                          Сохранить изменения
                        </Button>
                      </Flex>
                    </SettingsCard>
                  </Box>
                </SimpleGrid>
              </TabPanel>

              <TabPanel px={0} pt={2}>
                <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
                  <SettingsCard title="Внешний вид" icon={SunIcon}>
                    <VStack align="stretch" spacing={6}>
                      <Box>
                        <FormLabel fontSize="sm" fontWeight="medium" mb={2}>
                          Тема оформления
                        </FormLabel>
                        <Select
                          value={siteSettings.theme}
                          onChange={(e) =>
                            setSiteSettings({
                              ...siteSettings,
                              theme: e.target.value as any,
                            })
                          }
                          borderRadius="xl"
                          bg={useColorModeValue("gray.50", "gray.700")}
                          border="1px solid"
                          borderColor="gray.200"
                          h="45px"
                        >
                          <option value="system">Системная</option>
                          <option value="light">Светлая</option>
                          <option value="dark">Тёмная</option>
                        </Select>
                      </Box>

                      <Box>
                        <FormLabel fontSize="sm" fontWeight="medium" mb={2}>
                          Язык интерфейса
                        </FormLabel>
                        <Select
                          value={siteSettings.language}
                          onChange={(e) =>
                            setSiteSettings({
                              ...siteSettings,
                              language: e.target.value,
                            })
                          }
                          borderRadius="xl"
                          bg={useColorModeValue("gray.50", "gray.700")}
                          h="45px"
                        >
                          <option value="ru">Русский</option>
                          <option value="en">English</option>
                        </Select>
                      </Box>

                      <Box>
                        <FormLabel fontSize="sm" fontWeight="medium" mb={2}>
                          Часовой пояс
                        </FormLabel>
                        <Select
                          value={siteSettings.timezone}
                          onChange={(e) =>
                            setSiteSettings({
                              ...siteSettings,
                              timezone: e.target.value,
                            })
                          }
                          borderRadius="xl"
                          bg={useColorModeValue("gray.50", "gray.700")}
                          h="45px"
                        >
                          <option value="Europe/Moscow">Москва (UTC+3)</option>
                          <option value="Europe/Kazan">Казань (UTC+3)</option>
                          <option value="Asia/Yekaterinburg">
                            Екатеринбург (UTC+5)
                          </option>
                        </Select>
                      </Box>
                    </VStack>
                  </SettingsCard>

                  <SettingsCard title="Уведомления" icon={BellIcon}>
                    <VStack align="stretch" spacing={2}>
                      <ToggleRow
                        label="Email-рассылка"
                        description="Получать дайджест задач на почту"
                        isChecked={siteSettings.notifications.email}
                        onChange={(val) =>
                          setSiteSettings({
                            ...siteSettings,
                            notifications: {
                              ...siteSettings.notifications,
                              email: val,
                            },
                          })
                        }
                        icon={EmailIcon}
                      />
                      <ToggleRow
                        label="Push-уведомления"
                        description="Мгновенные оповещения в браузере"
                        isChecked={siteSettings.notifications.push}
                        onChange={(val) =>
                          setSiteSettings({
                            ...siteSettings,
                            notifications: {
                              ...siteSettings.notifications,
                              push: val,
                            },
                          })
                        }
                        icon={InfoOutlineIcon}
                      />
                      <ToggleRow
                        label="Еженедельный отчёт"
                        description="Статистика продуктивности каждый ПН"
                        isChecked={siteSettings.notifications.weekly}
                        onChange={(val) =>
                          setSiteSettings({
                            ...siteSettings,
                            notifications: {
                              ...siteSettings.notifications,
                              weekly: val,
                            },
                          })
                        }
                        icon={TimeIcon}
                      />
                    </VStack>
                  </SettingsCard>

                  <SettingsCard title="Приватность" icon={LockIcon}>
                    <VStack align="stretch" spacing={2}>
                      <ToggleRow
                        label="Публичный профиль"
                        description="Ваш профиль виден всем пользователям"
                        isChecked={siteSettings.privacy.profileVisible}
                        onChange={(val) =>
                          setSiteSettings({
                            ...siteSettings,
                            privacy: {
                              ...siteSettings.privacy,
                              profileVisible: val,
                            },
                          })
                        }
                        icon={ViewIcon}
                      />
                      <ToggleRow
                        label="Статус онлайн"
                        description="Показывать, когда вы активны"
                        isChecked={siteSettings.privacy.showOnline}
                        onChange={(val) =>
                          setSiteSettings({
                            ...siteSettings,
                            privacy: {
                              ...siteSettings.privacy,
                              showOnline: val,
                            },
                          })
                        }
                        icon={SunIcon}
                      />
                    </VStack>
                  </SettingsCard>

                  <SettingsCard title="Данные" icon={DownloadIcon}>
                    <VStack align="stretch" spacing={3}>
                      <Button
                        variant="outline"
                        borderRadius="xl"
                        justifyContent="space-between"
                        leftIcon={<DownloadIcon />}
                        _hover={{ bg: "blue.50", borderColor: "blue.200" }}
                        h="45px"
                      >
                        Экспорт данных
                      </Button>
                      <Button
                        variant="outline"
                        borderRadius="xl"
                        justifyContent="space-between"
                        leftIcon={<RepeatIcon />}
                        colorScheme="red"
                        _hover={{ bg: "red.50", borderColor: "red.200" }}
                        h="45px"
                      >
                        Удалить аккаунт
                      </Button>
                    </VStack>
                  </SettingsCard>
                </SimpleGrid>

                <Flex justify="flex-end" mt={8}>
                  <Button
                    colorScheme="blue"
                    size="lg"
                    borderRadius="xl"
                    onClick={handleSaveSettings}
                    isLoading={isSavingLocal}
                    px={8}
                    boxShadow="lg"
                    _hover={{ transform: "translateY(-1px)" }}
                    transition="all 0.2s"
                  >
                    Сохранить все настройки
                  </Button>
                </Flex>
              </TabPanel>

              <TabPanel px={0} pt={2}>
                <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
                  <SettingsCard title="Смена пароля" icon={LockIcon}>
                    <VStack spacing={6} align="stretch">
                      <Box
                        p={4}
                        bg={useColorModeValue("blue.50", "blue.900/30")}
                        borderRadius="xl"
                        border="1px solid"
                        borderColor={useColorModeValue("blue.100", "blue.800")}
                      >
                        <HStack spacing={3}>
                          <InfoOutlineIcon color="blue.500" />
                          <Text
                            fontSize="sm"
                            color={useColorModeValue("blue.700", "blue.200")}
                            fontWeight="medium"
                          >
                            Последний раз пароль менялся:{" "}
                            {security.passwordLastChanged || "Неизвестно"}
                          </Text>
                        </HStack>
                      </Box>

                      <FormControl>
                        <FormLabel fontSize="sm" fontWeight="medium" mb={2}>
                          Текущий пароль
                        </FormLabel>
                        <InputGroup>
                          <InputLeftElement pointerEvents="none">
                            <LockIcon color="gray.400" />
                          </InputLeftElement>
                          <StyledInput
                            type="password"
                            placeholder="••••••••"
                            pl={10}
                          />
                        </InputGroup>
                      </FormControl>

                      <FormControl>
                        <FormLabel fontSize="sm" fontWeight="medium" mb={2}>
                          Новый пароль
                        </FormLabel>
                        <InputGroup>
                          <InputLeftElement pointerEvents="none">
                            <LockIcon color="gray.400" />
                          </InputLeftElement>
                          <StyledInput
                            type="password"
                            placeholder="••••••••"
                            pl={10}
                          />
                        </InputGroup>
                        <Progress
                          value={0}
                          size="xs"
                          colorScheme="green"
                          mt={2}
                          borderRadius="full"
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel fontSize="sm" fontWeight="medium" mb={2}>
                          Подтвердите пароль
                        </FormLabel>
                        <InputGroup>
                          <InputLeftElement pointerEvents="none">
                            <LockIcon color="gray.400" />
                          </InputLeftElement>
                          <StyledInput
                            type="password"
                            placeholder="••••••••"
                            pl={10}
                          />
                        </InputGroup>
                      </FormControl>

                      <Button
                        colorScheme="blue"
                        borderRadius="xl"
                        mt={2}
                        h="45px"
                      >
                        Обновить пароль
                      </Button>
                    </VStack>
                  </SettingsCard>

                  <SettingsCard
                    title="Двухфакторная аутентификация"
                    icon={CheckIcon}
                  >
                    <Flex direction="column" h="full" justify="space-between">
                      <Box>
                        <Text fontSize="sm" color="gray.600" mb={6}>
                          Добавьте дополнительный уровень безопасности вашему
                          аккаунту. При входе потребуется код из
                          приложения-аутентификатора.
                        </Text>

                        <Flex
                          align="center"
                          justify="space-between"
                          p={5}
                          bg={useColorModeValue("gray.50", "gray.700/50")}
                          borderRadius="xl"
                          border="1px solid"
                          borderColor={useColorModeValue(
                            "gray.100",
                            "gray.600",
                          )}
                        >
                          <HStack>
                            <Box
                              p={2.5}
                              bg="white"
                              borderRadius="lg"
                              boxShadow="sm"
                            >
                              <Icon
                                as={LockIcon}
                                color="green.500"
                                boxSize={5}
                              />
                            </Box>
                            <Text fontWeight="semibold">2FA Защита</Text>
                          </HStack>
                          <Switch
                            size="lg"
                            isChecked={security.twoFactorEnabled}
                            onChange={(e) =>
                              setSecurity({
                                ...security,
                                twoFactorEnabled: e.target.checked,
                              })
                            }
                            colorScheme="green"
                          />
                        </Flex>
                      </Box>

                      {security.twoFactorEnabled && (
                        <Box
                          mt={6}
                          p={4}
                          bg="green.50"
                          borderRadius="xl"
                          border="1px solid"
                          borderColor="green.200"
                        >
                          <HStack spacing={3}>
                            <CheckIcon color="green.600" boxSize={5} />
                            <Box>
                              <Text
                                fontSize="sm"
                                color="green.800"
                                fontWeight="bold"
                              >
                                Активировано
                              </Text>
                              <Text fontSize="xs" color="green.600">
                                Ваш аккаунт под надежной защитой
                              </Text>
                            </Box>
                          </HStack>
                        </Box>
                      )}
                    </Flex>
                  </SettingsCard>

                  <SettingsCard title="Активные сессии" icon={ViewIcon}>
                    <VStack align="stretch" spacing={0} divider={<Divider />}>
                      {security.sessions.length > 0 ? (
                        security.sessions.map((session, idx) => (
                          <Flex
                            key={idx}
                            justify="space-between"
                            align="center"
                            py={5}
                            _hover={{
                              bg: useColorModeValue("gray.50", "whiteAlpha.50"),
                            }}
                            borderRadius="lg"
                            px={2}
                            transition="background 0.2s"
                          >
                            <HStack spacing={5}>
                              <Box
                                p={3}
                                borderRadius="xl"
                                bg={useColorModeValue("gray.100", "gray.700")}
                              >
                                <Icon
                                  as={
                                    session.device.includes("iPhone")
                                      ? SunIcon
                                      : ViewIcon
                                  }
                                  color="gray.600"
                                  boxSize={5}
                                />
                              </Box>
                              <Box>
                                <Text
                                  fontWeight="bold"
                                  fontSize="sm"
                                  color={textColor}
                                >
                                  {session.device}
                                </Text>
                                <HStack spacing={2} mt={1}>
                                  <Text fontSize="xs" color="gray.500">
                                    {session.location}
                                  </Text>
                                  <Text fontSize="xs" color="gray.400">
                                    •
                                  </Text>
                                  <Text fontSize="xs" color="gray.500">
                                    {session.lastActive}
                                  </Text>
                                </HStack>
                              </Box>
                            </HStack>

                            {session.active ? (
                              <Badge
                                colorScheme="green"
                                px={3}
                                py={1.5}
                                borderRadius="full"
                                fontSize="xs"
                              >
                                Активная сессия
                              </Badge>
                            ) : (
                              <Button
                                size="sm"
                                variant="ghost"
                                colorScheme="red"
                                fontSize="xs"
                                borderRadius="lg"
                              >
                                Завершить
                              </Button>
                            )}
                          </Flex>
                        ))
                      ) : (
                        <Text color="gray.500" textAlign="center" py={4}>
                          Нет активных сессий
                        </Text>
                      )}
                    </VStack>
                    <Button
                      variant="link"
                      color="red.500"
                      size="sm"
                      mt={6}
                      fontWeight="normal"
                      _hover={{ textDecoration: "underline" }}
                    >
                      Завершить все другие сессии
                    </Button>
                  </SettingsCard>
                </SimpleGrid>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Container>
      </Flex>
    </AppPageLayout>
  );
}
