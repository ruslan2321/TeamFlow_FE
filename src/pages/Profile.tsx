import React, { useRef, useState, useEffect } from "react";
import {
  Box,
  Flex,
  Text,
  Avatar,
  Badge,
  Grid,
  Divider,
  Icon,
  useColorModeValue,
  Progress,
  Skeleton,
  SimpleGrid,
  Input,
  IconButton,
  useToast,
  Textarea,
} from "@chakra-ui/react";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiBriefcase,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiEdit2,
  FiCheck,
  FiX,
  FiCamera,
} from "react-icons/fi";
import AppPageLayout from "../components/layout/AppPageLayout";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useUpdateAvatarMutation,
} from "../api/ProfileApi";
import { useGetMyTaskQuery } from "../api/TaskApi";
import CardTask from "../components/Task/CardTask";
import { getCurrentUserId } from "../utils/utils.user.id";
import { getStatusConfig } from "../utils/status.utils";

const API_ORIGIN = BASE_FILE_URL();

function BASE_FILE_URL() {
  const envBase =
    (import.meta as any)?.env?.VITE_SERVER_URL ||
    (import.meta as any)?.env?.VITE_API_ORIGIN;

  if (envBase) return envBase.replace(/\/$/, "");

  try {
    const url = new URL((import.meta as any)?.env?.VITE_BASE_API_URL || "");
    return `${url.protocol}//${url.host}`;
  } catch {
    return "http://localhost:3000";
  }
}

export interface ProfileData {
  id: number;
  login: string;
  username: string;
  email: string;
  phone?: string;
  avatar?: string;
  joinedAt?: string;
  status?: "В сети" | "Не в сети" | "online" | "offline" | "away" | "busy";
  location?: string;
  department?: string;
  aboutMe?: string;
  role?: string;
}

type ProfileFieldKey =
  | "email"
  | "phone"
  | "location"
  | "department"
  | "aboutMe"
  | "role";

type FieldProps = {
  label: string;
  value: string;
  fieldKey: ProfileFieldKey;
  isLoading?: boolean;
  isMultiline?: boolean;
  onSave?: (key: ProfileFieldKey, value: string) => void;
};

type InfoRowProps = {
  icon: React.ElementType;
  label: string;
  value: string;
  fieldKey: ProfileFieldKey;
  isLoading?: boolean;
  onSave?: (key: ProfileFieldKey, value: string) => void;
};

const InfoRow = ({
  icon,
  label,
  value,
  fieldKey,
  isLoading = false,
  onSave,
}: InfoRowProps) => {
  const textColor = useColorModeValue("gray.700", "gray.200");
  const subtextColor = useColorModeValue("gray.500", "gray.400");
  const bgHover = useColorModeValue("gray.50", "gray.700");
  const hoverBgBlue = useColorModeValue("blue.50", "blue.900");

  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value || "");

  useEffect(() => {
    setEditValue(value && value !== "—" ? value : "");
  }, [value]);

  const handleSave = () => {
    onSave?.(fieldKey, editValue.trim());
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value && value !== "—" ? value : "");
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <Flex align="center" gap={3} p={2}>
        <Skeleton borderRadius="md" w={4} h={4} />
        <Box flex="1">
          <Skeleton h={2} w={16} mb={1} />
          <Skeleton h={3} w={24} />
        </Box>
      </Flex>
    );
  }

  return (
    <Flex
      align="center"
      justify="space-between"
      gap={3}
      p={2}
      borderRadius="md"
      _hover={{ bg: bgHover }}
      transition="background 0.15s"
      position="relative"
    >
      <Flex align="center" gap={3} minW={0} flex="1">
        <Icon as={icon} color={subtextColor} boxSize={4} flexShrink={0} />
        <Box minW={0} flex="1">
          <Text
            fontSize="xs"
            color={subtextColor}
            fontWeight="500"
            mb={0.5}
            textTransform="uppercase"
          >
            {label}
          </Text>

          {isEditing ? (
            <Input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              size="sm"
              h={8}
              px={2}
              py={1}
              fontSize="sm"
              fontWeight="500"
              color={textColor}
              focusBorderColor="blue.500"
              borderRadius="md"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
                if (e.key === "Escape") handleCancel();
              }}
            />
          ) : (
            <Text fontSize="sm" fontWeight="500" color={textColor} isTruncated>
              {value || "—"}
            </Text>
          )}
        </Box>
      </Flex>

      <Flex gap={1} flexShrink={0}>
        {isEditing ? (
          <>
            <IconButton
              aria-label="Сохранить"
              icon={<FiCheck />}
              size="xs"
              variant="ghost"
              colorScheme="green"
              onClick={handleSave}
              borderRadius="md"
              w={7}
              h={7}
            />
            <IconButton
              aria-label="Отмена"
              icon={<FiX />}
              size="xs"
              variant="ghost"
              colorScheme="red"
              onClick={handleCancel}
              borderRadius="md"
              w={7}
              h={7}
            />
          </>
        ) : (
          <IconButton
            aria-label={`Редактировать ${label}`}
            icon={<FiEdit2 />}
            size="xs"
            variant="ghost"
            color={subtextColor}
            _hover={{
              color: "blue.500",
              bg: hoverBgBlue,
            }}
            onClick={() => setIsEditing(true)}
            borderRadius="md"
            w={7}
            h={7}
          />
        )}
      </Flex>
    </Flex>
  );
};

const EditableField = ({
  label,
  value,
  fieldKey,
  isMultiline = false,
  onSave,
  isLoading = false,
}: FieldProps) => {
  const textColor = useColorModeValue("gray.700", "gray.200");
  const subtextColor = useColorModeValue("gray.500", "gray.400");
  const hoverBgBlue = useColorModeValue("blue.50", "blue.900");

  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value || "");

  useEffect(() => {
    setEditValue(value || "");
  }, [value]);

  const handleSave = () => {
    onSave?.(fieldKey, editValue.trim());
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value || "");
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <Box>
        <Skeleton h={3} w={20} mb={1} />
        <Skeleton h={4} w={48} />
      </Box>
    );
  }

  return (
    <Box position="relative">
      <Flex align="center" gap={2} wrap="wrap">
        {isEditing ? (
          isMultiline ? (
            <Textarea
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              size="sm"
              fontSize="sm"
              fontWeight="500"
              color={textColor}
              focusBorderColor="blue.500"
              borderRadius="md"
              rows={3}
              autoFocus
              onKeyDown={(e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === "Enter") handleSave();
                if (e.key === "Escape") handleCancel();
              }}
              resize="vertical"
              maxH="120px"
            />
          ) : (
            <Input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              size="sm"
              h={8}
              px={2}
              fontSize="sm"
              fontWeight="500"
              color={textColor}
              focusBorderColor="blue.500"
              borderRadius="md"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
                if (e.key === "Escape") handleCancel();
              }}
            />
          )
        ) : (
          <Text
            fontSize="sm"
            fontWeight="500"
            color={label === "О себе" ? subtextColor : "blue.500"}
            lineHeight={isMultiline ? "1.6" : "1.2"}
          >
            {value || (label === "О себе" ? "Добавьте информацию о себе" : "—")}
          </Text>
        )}

        {!isEditing && (
          <IconButton
            aria-label={`Редактировать ${label}`}
            icon={<FiEdit2 />}
            size="xs"
            variant="ghost"
            color={subtextColor}
            _hover={{
              color: "blue.500",
              bg: hoverBgBlue,
            }}
            onClick={() => setIsEditing(true)}
            borderRadius="md"
            w={6}
            h={6}
            opacity={label === "О себе" ? 0.6 : 1}
            transition="opacity 0.15s"
          />
        )}

        {isEditing && (
          <Flex gap={1} ml={2}>
            <IconButton
              aria-label="Сохранить"
              icon={<FiCheck />}
              size="xs"
              variant="ghost"
              colorScheme="green"
              onClick={handleSave}
              borderRadius="md"
              w={6}
              h={6}
            />
            <IconButton
              aria-label="Отмена"
              icon={<FiX />}
              size="xs"
              variant="ghost"
              colorScheme="red"
              onClick={handleCancel}
              borderRadius="md"
              w={6}
              h={6}
            />
          </Flex>
        )}
      </Flex>
    </Box>
  );
};

const StatCard = ({
  label,
  value,
  color,
  icon,
  isLoading = false,
}: {
  label: string;
  value: number;
  color: string;
  icon: React.ElementType;
  isLoading?: boolean;
}) => {
  const textColor = useColorModeValue("gray.900", "white");
  const subtextColor = useColorModeValue("gray.500", "gray.400");
  const bgCard = useColorModeValue("gray.50", "gray.700");

  if (isLoading) {
    return (
      <Box p={4} borderRadius="lg" bg={bgCard}>
        <Skeleton h={4} w={12} mb={2} mx="auto" />
        <Skeleton h={6} w={8} mx="auto" />
      </Box>
    );
  }

  return (
    <Box p={4} borderRadius="lg" bg={bgCard} textAlign="center">
      <Flex justify="center" mb={2}>
        <Icon as={icon} color={`${color}.500`} boxSize={5} />
      </Flex>
      <Text
        fontSize="xs"
        color={subtextColor}
        fontWeight="600"
        textTransform="uppercase"
        mb={1}
      >
        {label}
      </Text>
      <Text fontSize="2xl" fontWeight="bold" color={textColor}>
        {value}
      </Text>
    </Box>
  );
};

export default function ProfilePage() {
  const fileinputRef = useRef<HTMLInputElement>(null);
  const userId = getCurrentUserId();
  const toast = useToast();

  const {
    data: profile,
    isLoading: profileLoading,
    refetch,
  } = useGetProfileQuery(userId ?? 0, {
    skip: !userId,
  });

  const { data: myTasks = [], isLoading: tasksLoading } = useGetMyTaskQuery(
    userId ?? 0,
    { skip: !userId },
  );

  const [updateProfile] = useUpdateProfileMutation();
  const [updateAvatar, { isLoading: isAvatarUploading }] =
    useUpdateAvatarMutation();

  const bgPage = useColorModeValue("gray.50", "gray.900");
  const bgCard = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const headingColor = useColorModeValue("gray.900", "white");
  const subtextColor = useColorModeValue("gray.500", "gray.400");
  const emptyIconColor = useColorModeValue("gray.300", "gray.600");
  const progressBg = useColorModeValue("gray.100", "gray.700");
  const cameraBg = useColorModeValue("white", "gray.700");

  const userStatus = getStatusConfig((profile as any)?.status);

  const totalTasks = myTasks.length;
  const inProgress = myTasks.filter(
    (t: any) => t.status === "В разработке",
  ).length;
  const testing = myTasks.filter(
    (t: any) => t.status === "К тестированию",
  ).length;
  const done = myTasks.filter((t: any) => t.status === "Готово").length;
  const backlog = myTasks.filter(
    (t: any) => t.status === "К разработке",
  ).length;

  const handleClickImage = () => fileinputRef.current?.click();

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Неверный формат",
        description: "Разрешены только JPG, PNG и WEBP",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Файл слишком большой",
        description: "Максимальный размер файла — 5 МБ",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      await updateAvatar(file).unwrap();

      toast({
        title: "Аватар обновлен",
        description: "Изображение профиля успешно сохранено",
        status: "success",
        duration: 2000,
        isClosable: true,
      });

      refetch();
    } catch (err: any) {
      toast({
        title: "Ошибка загрузки",
        description:
          err?.data?.message || err?.error || "Не удалось обновить аватар",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      if (fileinputRef.current) {
        fileinputRef.current.value = "";
      }
    }
  };

  const handleFieldSave = async (
    fieldKey: ProfileFieldKey,
    newValue: string,
  ) => {
    try {
      await updateProfile({ [fieldKey]: newValue }).unwrap();

      const fieldLabels: Record<ProfileFieldKey, string> = {
        email: "Email",
        phone: "Телефон",
        location: "Локация",
        department: "Отдел",
        aboutMe: "Информация о себе",
        role: "Роль",
      };

      toast({
        title: "Поле обновлено",
        description: `${fieldLabels[fieldKey]} сохранено`,
        status: "success",
        duration: 2000,
        isClosable: true,
      });

      refetch();
    } catch (err: any) {
      toast({
        title: "Ошибка",
        description: err?.data?.message || err?.error || "Не удалось сохранить",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const avatarSrc = (profile as any)?.avatar
    ? `${API_ORIGIN}/uploads/avatars/${(profile as any).avatar}`
    : undefined;

  return (
    <AppPageLayout bg={bgPage}>
      <Box flex="1" overflowY="auto" p={{ base: 4, md: 6, lg: 8 }}>
        <Box maxW="1100px" mx="auto" w="full">
          <Flex
            align="center"
            justify="space-between"
            mb={6}
            gap={3}
            flexWrap="wrap"
          >
            <Text
              fontSize={{ base: "xl", md: "2xl" }}
              fontWeight="bold"
              color={headingColor}
            >
              Профиль
            </Text>
            <Badge
              variant="subtle"
              colorScheme="blue"
              fontSize="sm"
              px={3}
              py={1}
              borderRadius="md"
            >
              {userStatus?.label || "Не в сети"}
            </Badge>
          </Flex>

          <Box
            bg={bgCard}
            p={6}
            borderRadius="xl"
            border="1px solid"
            borderColor={borderColor}
            mb={6}
          >
            <Flex
              direction={{ base: "column", md: "row" }}
              align="center"
              gap={6}
            >
              <Box
                position="relative"
                onClick={handleClickImage}
                cursor="pointer"
                role="button"
                title="Изменить аватар"
              >
                <input
                  type="file"
                  ref={fileinputRef}
                  style={{ display: "none" }}
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleAvatarChange}
                />

                <Avatar
                  size="2xl"
                  name={(profile as any)?.username || "User"}
                  src={avatarSrc}
                  border="4px solid"
                  borderColor={bgCard}
                  opacity={isAvatarUploading ? 0.6 : 1}
                />

                <Flex
                  position="absolute"
                  top="2"
                  right="2"
                  w="8"
                  h="8"
                  borderRadius="full"
                  align="center"
                  justify="center"
                  bg={cameraBg}
                  border="1px solid"
                  borderColor={borderColor}
                  boxShadow="sm"
                >
                  <Icon as={FiCamera} boxSize={4} color="blue.500" />
                </Flex>

                <Badge
                  position="absolute"
                  bottom="2"
                  right="2"
                  bg={userStatus?.color || "gray.500"}
                  color="white"
                  borderRadius="full"
                  px={2}
                  py={0.5}
                  fontSize="xs"
                  fontWeight="600"
                  border="2px solid"
                  borderColor={bgCard}
                >
                  {userStatus?.label || "Не в сети"}
                </Badge>
              </Box>

              <Box flex="1" textAlign={{ base: "center", md: "left" }}>
                {profileLoading ? (
                  <>
                    <Skeleton h={6} w={48} mb={2} />
                    <Skeleton h={4} w={32} mb={2} />
                    <Skeleton h={4} w={64} />
                  </>
                ) : (
                  <>
                    <Text fontSize="xl" fontWeight="bold" color={headingColor}>
                      {(profile as any)?.username || "Пользователь"}
                    </Text>
                    <Box mt={1}>
                      <EditableField
                        label="Роль"
                        value={(profile as any)?.role || ""}
                        fieldKey="role"
                        onSave={handleFieldSave}
                        isLoading={profileLoading}
                      />
                    </Box>
                    <Box mt={3} maxW="480px">
                      <EditableField
                        label="О себе"
                        value={(profile as any)?.aboutMe || ""}
                        fieldKey="aboutMe"
                        isMultiline
                        onSave={handleFieldSave}
                        isLoading={profileLoading}
                      />
                    </Box>
                  </>
                )}
              </Box>
            </Flex>
          </Box>

          <Grid
            templateColumns={{ base: "1fr", lg: "1.3fr 0.7fr" }}
            gap={6}
            mb={6}
          >
            <Box
              bg={bgCard}
              p={5}
              borderRadius="xl"
              border="1px solid"
              borderColor={borderColor}
            >
              <Text
                fontSize="sm"
                fontWeight="600"
                color={headingColor}
                mb={3}
                textTransform="uppercase"
              >
                Контакты
              </Text>
              <Divider mb={3} borderColor={borderColor} />
              <Grid templateColumns={{ base: "1fr", sm: "1fr 1fr" }} gap={1}>
                <InfoRow
                  icon={FiMail}
                  label="Email"
                  value={(profile as any)?.email || ""}
                  fieldKey="email"
                  isLoading={profileLoading}
                  onSave={handleFieldSave}
                />
                <InfoRow
                  icon={FiPhone}
                  label="Телефон"
                  value={(profile as any)?.phone || ""}
                  fieldKey="phone"
                  isLoading={profileLoading}
                  onSave={handleFieldSave}
                />
                <InfoRow
                  icon={FiMapPin}
                  label="Локация"
                  value={(profile as any)?.location || ""}
                  fieldKey="location"
                  isLoading={profileLoading}
                  onSave={handleFieldSave}
                />
                <InfoRow
                  icon={FiBriefcase}
                  label="Отдел"
                  value={(profile as any)?.department || ""}
                  fieldKey="department"
                  isLoading={profileLoading}
                  onSave={handleFieldSave}
                />
                <Flex align="center" gap={3} p={2} borderRadius="md" minW={0}>
                  <Icon
                    as={FiCalendar}
                    color={subtextColor}
                    boxSize={4}
                    flexShrink={0}
                  />
                  <Box minW={0}>
                    <Text
                      fontSize="xs"
                      color={subtextColor}
                      fontWeight="500"
                      mb={0.5}
                      textTransform="uppercase"
                    >
                      В команде с
                    </Text>
                    {profileLoading ? (
                      <Skeleton h={3} w={24} />
                    ) : (
                      <Text
                        fontSize="sm"
                        fontWeight="500"
                        color={headingColor}
                        isTruncated
                      >
                        {(profile as any)?.joinedAt || "—"}
                      </Text>
                    )}
                  </Box>
                </Flex>
              </Grid>
            </Box>

            <Box
              bg={bgCard}
              p={5}
              borderRadius="xl"
              border="1px solid"
              borderColor={borderColor}
            >
              <Text
                fontSize="sm"
                fontWeight="600"
                color={headingColor}
                mb={3}
                textTransform="uppercase"
              >
                Задачи
              </Text>

              {totalTasks > 0 && (
                <Box mb={4}>
                  <Flex
                    justify="space-between"
                    fontSize="xs"
                    color={subtextColor}
                    mb={1}
                  >
                    <Text>Выполнено</Text>
                    <Text fontWeight="500">
                      {Math.round((done / totalTasks) * 100)}%
                    </Text>
                  </Flex>
                  <Progress
                    value={(done / totalTasks) * 100}
                    size="sm"
                    colorScheme="green"
                    borderRadius="md"
                    bg={progressBg}
                  />
                </Box>
              )}

              <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={3}>
                <StatCard
                  label="В работе"
                  value={inProgress}
                  color="blue"
                  icon={FiClock}
                  isLoading={tasksLoading}
                />
                <StatCard
                  label="На тесте"
                  value={testing}
                  color="orange"
                  icon={FiAlertCircle}
                  isLoading={tasksLoading}
                />
                <StatCard
                  label="Готово"
                  value={done}
                  color="green"
                  icon={FiCheckCircle}
                  isLoading={tasksLoading}
                />
                <StatCard
                  label="В бэклоге"
                  value={backlog}
                  color="gray"
                  icon={FiBriefcase}
                  isLoading={tasksLoading}
                />
              </SimpleGrid>
            </Box>
          </Grid>

          <Box
            bg={bgCard}
            p={5}
            borderRadius="xl"
            border="1px solid"
            borderColor={borderColor}
          >
            <Flex align="center" justify="space-between" mb={4}>
              <Text
                fontSize="sm"
                fontWeight="600"
                color={headingColor}
                textTransform="uppercase"
              >
                Мои задачи
              </Text>
              {totalTasks > 0 && (
                <Badge
                  variant="subtle"
                  colorScheme="blue"
                  fontSize="xs"
                  px={2}
                  py={0.5}
                  borderRadius="md"
                >
                  {totalTasks}
                </Badge>
              )}
            </Flex>

            {tasksLoading ? (
              <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={4}>
                {[1, 2, 3].map((i) => (
                  <Box
                    key={i}
                    p={4}
                    borderRadius="lg"
                    border="1px solid"
                    borderColor={borderColor}
                  >
                    <Skeleton h={4} w="75%" mb={3} />
                    <Skeleton h={3} w="full" mb={2} />
                    <Skeleton h={3} w="67%" />
                  </Box>
                ))}
              </SimpleGrid>
            ) : totalTasks > 0 ? (
              <CardTask tasks={myTasks} />
            ) : (
              <Flex
                direction="column"
                align="center"
                justify="center"
                py={10}
                color={subtextColor}
                textAlign="center"
              >
                <Icon
                  as={FiCheckCircle}
                  boxSize={8}
                  color={emptyIconColor}
                  mb={2}
                />
                <Text fontWeight="500" color={headingColor} mb={1}>
                  Задач пока нет
                </Text>
                <Text fontSize="sm">
                  Создайте первую задачу или дождитесь назначения
                </Text>
              </Flex>
            )}
          </Box>
        </Box>
      </Box>
    </AppPageLayout>
  );
}
