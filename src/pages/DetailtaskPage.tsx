// pages/DetailtaskPage.tsx
import React, { useEffect, useState, useRef, useMemo } from "react";
import {
  Box,
  Flex,
  Text,
  Tag,
  TagLabel,
  Button,
  IconButton,
  Tooltip,
  Stack,
  HStack,
  VStack,
  useColorModeValue,
  Icon,
  Heading,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Divider,
  Textarea,
  Badge,
  Input,
  useToast,
  Spinner,
  MenuDivider,
} from "@chakra-ui/react";
import {
  FiEdit2,
  FiTrash2,
  FiCheckCircle,
  FiClock,
  FiArrowLeft,
  FiChevronDown,
  FiSend,
  FiUser,
  FiCalendar,
  FiMessageSquare,
  FiX,
  FiSave,
  FiUserPlus,
} from "react-icons/fi";
import AppPageLayout from "../components/layout/AppPageLayout";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { formatDate } from "../utils/date";
import {
  useDeleteTaskMutation,
  useEditTaskMutation,
  useGetTasksQuery,
  useViewTaskQuery,
} from "../api/TaskApi";
import { findTaskInList, isPopulatedTask } from "../api/taskNormalize";
import { useGetTeamQuery } from "../api/ProfileApi";
import { getCurrentUserId } from "../utils/utils.user.id";
import { getStoredUser } from "../utils/auth.storage";
import {
  buildAvatarLookup,
  mergeStoredAvatarIntoUsers,
  resolveUserAvatarUrl,
} from "../utils/avatar.utils";
import UserAvatar from "../components/ui/UserAvatar";
import type { Task } from "../types/TaskType";
import type { Profile } from "../types/ProfileType";

const STATUS_OPTIONS = [
  {
    value: "К разработке",
    label: "К разработке",
    color: "gray",
    icon: FiArrowLeft,
  },
  {
    value: "В разработке",
    label: "В разработке",
    color: "blue",
    icon: FiClock,
  },
  {
    value: "К тестированию",
    label: "К тестированию",
    color: "orange",
    icon: FiCheckCircle,
  },
  { value: "Готово", label: "Готово", color: "green", icon: FiCheckCircle },
] as const;

const parseComments = (raw?: string) => {
  if (!raw?.trim()) return [];
  return raw
    .split("\n")
    .filter((line) => line.trim().startsWith("["))
    .map((line) => {
      const match = line.match(/^\[(.*?)\]\s*(?:\[(.*?)\]:\s*)?(.*)/s);
      if (!match) return null;
      return {
        date: match[1] || "",
        author: match[2] || "Пользователь",
        text: match[3]?.trim() || "",
      };
    })
    .filter(
      (c): c is { date: string; author: string; text: string } => c !== null,
    );
};

const toAssignee = (user: Profile): Task["assignedUser"] => ({
  id: user.id,
  username: user.username,
  email: user.email,
  avatar: user.avatar,
});

const CommentItem = React.memo(
  ({
    comment,
    avatarSrc,
    textColor,
    subtextColor,
    avatarBg,
    avatarColor,
    commentBg,
  }: {
    comment: { date: string; author: string; text: string };
    avatarSrc?: string;
    textColor: string;
    subtextColor: string;
    avatarBg: string;
    avatarColor: string;
    commentBg: string;
  }) => (
    <Flex gap={3} align="start">
      <UserAvatar
        size="sm"
        name={comment.author}
        avatar={avatarSrc}
        bg={avatarBg}
        color={avatarColor}
        fontSize="xs"
        mt={1}
      />
      <Box flex="1">
        <HStack spacing={2} mb={1}>
          <Text fontSize="sm" fontWeight="600" color={textColor}>
            {comment.author}
          </Text>
          <Text fontSize="xs" color={subtextColor}>
            {comment.date}
          </Text>
        </HStack>
        <Box
          bg={commentBg}
          px={3}
          py={2.5}
          borderRadius="xl"
          borderBottomLeftRadius="md"
        >
          <Text
            fontSize="sm"
            color={textColor}
            lineHeight="1.6"
            whiteSpace="pre-wrap"
          >
            {comment.text}
          </Text>
        </Box>
      </Box>
    </Flex>
  ),
);
CommentItem.displayName = "CommentItem";

const StatusMenu = React.memo(
  ({
    currentStatus,
    onStatusChange,
    isDisabled,
    hoverBg,
  }: {
    currentStatus: string;
    onStatusChange: (status: string) => void;
    isDisabled: boolean;
    accentColor: string;
    hoverBg: string;
  }) => {
    const statusConfig =
      STATUS_OPTIONS.find((s) => s.value === currentStatus) ||
      STATUS_OPTIONS[0];
    return (
      <Menu>
        <MenuButton
          as={Button}
          rightIcon={<FiChevronDown />}
          variant="outline"
          size={{ base: "md", md: "sm" }}
          colorScheme={statusConfig.color}
          borderColor={`${statusConfig.color}.300`}
          _hover={{ bg: hoverBg }}
          leftIcon={<Icon as={statusConfig.icon} boxSize={3.5} />}
          borderRadius="full"
          fontWeight="500"
          fontSize="sm"
          px={3}
          isDisabled={isDisabled}
          minH="44px"
        >
          {currentStatus}
        </MenuButton>
        <MenuList minW="180px" borderRadius="xl" p={1} boxShadow="lg">
          {STATUS_OPTIONS.map((option) => (
            <MenuItem
              key={option.value}
              icon={
                <Icon
                  as={option.icon}
                  color={`${option.color}.500`}
                  boxSize={4}
                />
              }
              onClick={() => onStatusChange(option.value)}
              color={
                currentStatus === option.value
                  ? `${option.color}.600`
                  : "inherit"
              }
              fontWeight={currentStatus === option.value ? "600" : "400"}
              borderRadius="lg"
              py={2}
              px={3}
              _hover={{ bg: hoverBg }}
              fontSize="sm"
              isDisabled={isDisabled}
              minH="44px"
            >
              {option.label}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    );
  },
);
StatusMenu.displayName = "StatusMenu";

export default function DetailtaskPage() {
  const { task_id: routeKey } = useParams();
  const location = useLocation();
  const TaskId = Number(routeKey);
  const hasNumericId = Number.isFinite(TaskId) && TaskId > 0;
  const currentUserId = getCurrentUserId();
  const navigate = useNavigate();
  const toast = useToast();

  const {
    data: taskFromApi,
    isLoading: isApiLoading,
    refetch,
  } = useViewTaskQuery(TaskId, { skip: !hasNumericId });
  const { data: tasks = [], isLoading: isListLoading } = useGetTasksQuery();
  const taskFromState = (location.state as { task?: Task } | null)?.task;
  const taskFromList = useMemo(
    () => findTaskInList(tasks, routeKey),
    [tasks, routeKey],
  );
  const task = useMemo(() => {
    const candidates = hasNumericId
      ? [taskFromApi, taskFromState, taskFromList]
      : [taskFromState, taskFromList, taskFromApi];

    return candidates.find(isPopulatedTask);
  }, [hasNumericId, taskFromApi, taskFromState, taskFromList]);
  const isLoading =
    !task &&
    ((hasNumericId && isApiLoading) || isListLoading);
  const [editTask, { isLoading: isUpdating }] = useEditTaskMutation();
  const [deleteTask, { isLoading: isDeleting }] = useDeleteTaskMutation();
  const { data: teamData, isLoading: isTeamLoading } = useGetTeamQuery(
    currentUserId!,
    { skip: !currentUserId },
  );
  const avatarLookup = useMemo(() => {
    const members = mergeStoredAvatarIntoUsers(
      teamData?.data ?? [],
      currentUserId,
      getStoredUser(),
    );
    return buildAvatarLookup(members);
  }, [teamData, currentUserId]);

  const [commentText, setCommentText] = useState("");
  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    CommentTask: "",
  });
  const [editMode, setEditMode] = useState<
    null | "title" | "description" | "all"
  >(null);
  const [currentStatus, setCurrentStatus] = useState<string>(
    task?.status || "К разработке",
  );
  const [localAssignee, setLocalAssignee] = useState(task?.assignedUser);

  const titleInputRef = useRef<HTMLInputElement>(null);
  const descInputRef = useRef<HTMLTextAreaElement>(null);

  const bgPage = useColorModeValue("gray.50", "gray.900");
  const bgCard = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.900", "white");
  const subtextColor = useColorModeValue("gray.500", "gray.400");
  const accentColor = "blue.500";
  const hoverBg = useColorModeValue("gray.50", "gray.700");
  const avatarBg = useColorModeValue("blue.100", "blue.900");
  const avatarColor = useColorModeValue("blue.700", "blue.200");
  const commentBg = useColorModeValue("gray.50", "gray.700");
  const menuHoverBg = useColorModeValue("gray.50", "gray.700");

  const currentUserName = useMemo(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("user") || "{}");
      if (stored?.username) return stored.username;
      if (stored?.name) return stored.name;
      if (stored?.login) return stored.login;
    } catch {}
    if (currentUserId) {
      const users = Array.isArray(teamData) ? teamData : teamData?.data;
      if (Array.isArray(users)) {
        const user = users.find(
          (u: any) => String(u?.id) === String(currentUserId),
        );
        if (user?.username) return user.username;
        if (user?.name) return user.name;
        if (user?.login) return user.login;
      }
    }
    return "Вы";
  }, [teamData, currentUserId]);

  const isAssignedToMe = localAssignee?.id === currentUserId;
  const parsedComments = useMemo(
    () => parseComments(task?.CommentTask),
    [task?.CommentTask],
  );

  useEffect(() => {
    if (task) {
      setCurrentStatus(task.status || "К разработке");

      let assignee = task.assignedUser;
      if (assignee && !assignee.avatar) {
        const member = teamData?.data?.find((user) => user.id === assignee!.id);
        if (member?.avatar) {
          assignee = { ...assignee, avatar: member.avatar };
        }
      }
      setLocalAssignee(assignee);

      setEditFormData({
        title: task.title || "",
        description: task.description || "",
        CommentTask: task.CommentTask || "",
      });
    }
  }, [task, teamData]);

  useEffect(() => {
    if (editMode === "title" && titleInputRef.current)
      titleInputRef.current.focus();
    if (editMode === "description" && descInputRef.current)
      descInputRef.current.focus();
  }, [editMode]);

  const handleDeleteTask = async () => {
    if (!window.confirm("Вы уверены, что хотите удалить эту задачу?")) return;
    try {
      await deleteTask(TaskId).unwrap();
      toast({
        title: "Задача удалена",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top-right",
      });
      navigate("/task");
    } catch {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить задачу",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  const handleSendComment = async () => {
    const text = commentText.trim();
    if (!text || !TaskId) return;
    try {
      await editTask({
        task_id: TaskId,
        dto: { CommentTask: `[${currentUserName}]: ${text}` },
      }).unwrap();
      setCommentText("");
      refetch();
      toast({
        title: "Комментарий добавлен",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top-right",
      });
    } catch {
      toast({
        title: "Ошибка",
        description: "Не удалось добавить комментарий",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!TaskId) return;
    const prevStatus = currentStatus;
    setCurrentStatus(newStatus);
    try {
      await editTask({ task_id: TaskId, dto: { status: newStatus } }).unwrap();
      refetch();
      toast({
        title: "Статус обновлён",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top-right",
      });
    } catch {
      setCurrentStatus(prevStatus);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить статус",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  const handleAssignToMe = async () => {
    if (!TaskId || !currentUserId) return;
    const currentUser = teamData?.data?.find(
      (u: Profile) => Number(u.id) === Number(currentUserId),
    );
    if (currentUser) setLocalAssignee(toAssignee(currentUser));
    try {
      await editTask({
        task_id: TaskId,
        dto: { userId: currentUserId },
      }).unwrap();
      refetch();
      toast({
        title: "Задача назначена на вас",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top-right",
      });
    } catch {
      setLocalAssignee(task?.assignedUser);
      toast({
        title: "Ошибка",
        description: "Не удалось назначить задачу",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  const handleAssignUser = async (userId: number | null) => {
    if (!TaskId) return;
    if (userId === null) {
      setLocalAssignee(undefined);
    } else {
      const selectedUser = teamData?.data?.find(
        (u: Profile) => Number(u.id) === Number(userId),
      );
      if (selectedUser) setLocalAssignee(toAssignee(selectedUser));
    }
    try {
      await editTask({
        task_id: TaskId,
        dto: { userId: userId ?? undefined },
      }).unwrap();
      refetch();
      toast({
        title: userId ? "Исполнитель обновлён" : "Назначение снято",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top-right",
      });
    } catch {
      setLocalAssignee(task?.assignedUser);
      toast({
        title: "Ошибка",
        description: "Не удалось изменить исполнителя",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  const handleEditStart = (field: "title" | "description" | "all") => {
    setEditMode(field);
    setEditFormData({
      title: task?.title || "",
      description: task?.description || "",
      CommentTask: task?.CommentTask || "",
    });
  };

  const handleEditCancel = () => {
    setEditMode(null);
    setEditFormData({
      title: task?.title || "",
      description: task?.description || "",
      CommentTask: task?.CommentTask || "",
    });
  };

  const handleEditSave = async () => {
    if (!TaskId) return;
    if (!editFormData.title.trim()) {
      toast({
        title: "Ошибка валидации",
        description: "Заголовок задачи не может быть пустым",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }
    try {
      const dto: Partial<Task> = {};
      if (editFormData.title !== task?.title) dto.title = editFormData.title;
      if (editFormData.description !== task?.description)
        dto.description = editFormData.description;
      if (editFormData.CommentTask !== task?.CommentTask)
        dto.CommentTask = editFormData.CommentTask;
      await editTask({ task_id: TaskId, dto }).unwrap();
      refetch();
      setEditMode(null);
      toast({
        title: "Изменения сохранены",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top-right",
      });
    } catch {
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить изменения",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent,
    field: "title" | "description",
  ) => {
    if (e.key === "Enter" && !e.shiftKey && field === "title") {
      e.preventDefault();
      handleEditSave();
    }
    if (e.key === "Escape") {
      e.preventDefault();
      handleEditCancel();
    }
  };

  if (isLoading) {
    return (
      <Flex h="100vh" bg={bgPage} justify="center" align="center">
        <Text color={subtextColor}>Загрузка...</Text>
      </Flex>
    );
  }

  if (!task) {
    return (
      <Flex h="100vh" bg={bgPage} direction="column" justify="center" align="center" gap={4}>
        <Text color={subtextColor}>Задача не найдена</Text>
        <Button variant="ghost" leftIcon={<FiArrowLeft />} onClick={() => navigate("/task")}>
          Назад к списку
        </Button>
      </Flex>
    );
  }

  return (
    <AppPageLayout bg={bgPage}>
      <Box flex="1" overflowY="auto" p={{ base: 4, md: 6, lg: 8 }}>
        <Box maxW="900px" mx="auto" w="full">
            <Flex
              justify="space-between"
              align="center"
              mb={6}
              pb={4}
              borderBottom="1px"
              borderColor={borderColor}
            >
              <Button
                variant="ghost"
                leftIcon={<FiArrowLeft />}
                onClick={() => navigate("/task")}
                color={subtextColor}
                _hover={{
                  color: textColor,
                  bg: useColorModeValue("gray.100", "gray.700"),
                }}
                borderRadius="lg"
                size={{ base: "md", md: "sm" }}
                minH="44px"
              >
                Назад
              </Button>
              <Tooltip label="Удалить задачу" hasArrow>
                <IconButton
                  aria-label="Delete"
                  icon={<FiTrash2 />}
                  variant="ghost"
                  borderRadius="lg"
                  size={{ base: "md", md: "sm" }}
                  colorScheme="red"
                  color={subtextColor}
                  _hover={{ bg: useColorModeValue("red.50", "red.900/20") }}
                  onClick={handleDeleteTask}
                  isLoading={isDeleting}
                  minH="44px"
                  minW="44px"
                />
              </Tooltip>
            </Flex>

            <Flex direction={{ base: "column", lg: "row" }} gap={6}>
              <Stack flex="2" w="full" spacing={6}>
                <Box
                  bg={bgCard}
                  borderRadius="2xl"
                  p={{ base: 4, md: 6 }}
                  border="1px solid"
                  borderColor={borderColor}
                  boxShadow="0 1px 3px rgba(0,0,0,0.04)"
                  position="relative"
                  role="group"
                >
                  {!editMode && (
                    <Box
                      position="absolute"
                      top={4}
                      right={4}
                      opacity={{ base: 1, md: 0 }}
                      _groupHover={{ opacity: 1 }}
                      transition="opacity 0.2s ease"
                      zIndex={2}
                    >
                      <Tooltip label="Редактировать задачу" hasArrow>
                        <IconButton
                          aria-label="Edit task"
                          icon={<FiEdit2 />}
                          variant="ghost"
                          borderRadius="lg"
                          size={{ base: "md", md: "sm" }}
                          color={subtextColor}
                          _hover={{
                            color: accentColor,
                            bg: useColorModeValue("blue.50", "blue.900/20"),
                          }}
                          onClick={() => handleEditStart("all")}
                          minH="44px"
                          minW="44px"
                        />
                      </Tooltip>
                    </Box>
                  )}

                  <Flex
                    align="center"
                    justify="space-between"
                    mb={5}
                    wrap="wrap"
                    gap={3}
                  >
                    <StatusMenu
                      currentStatus={currentStatus}
                      onStatusChange={handleStatusChange}
                      isDisabled={!!editMode}
                      accentColor={accentColor}
                      hoverBg={menuHoverBg}
                    />
                    <Badge
                      variant="subtle"
                      colorScheme="gray"
                      fontSize="xs"
                      px={2}
                      py={1}
                      borderRadius="md"
                    >
                      #{task?.task_id}
                    </Badge>
                  </Flex>

                  <Box mb={4} position="relative">
                    {editMode === "all" || editMode === "title" ? (
                      <Box>
                        <Input
                          ref={titleInputRef}
                          value={editFormData.title}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              title: e.target.value,
                            })
                          }
                          onKeyDown={(e) => handleKeyDown(e, "title")}
                          size={{ base: "lg", md: "md" }}
                          fontWeight="bold"
                          borderRadius="xl"
                          borderColor={borderColor}
                          _focus={{
                            borderColor: accentColor,
                            boxShadow: `0 0 0 3px ${useColorModeValue("rgba(59,130,246,0.15)", "rgba(59,130,246,0.3)")}`,
                          }}
                          placeholder="Заголовок задачи"
                          mb={2}
                          minH="48px"
                        />
                        <Text fontSize="xs" color={subtextColor}>
                          Нажмите Enter для сохранения, Esc для отмены
                        </Text>
                      </Box>
                    ) : (
                      <Heading
                        size={{ base: "md", md: "lg" }}
                        color={textColor}
                        lineHeight="1.3"
                        _hover={{ opacity: 0.9 }}
                        transition="opacity 0.2s"
                        cursor="pointer"
                        onClick={() => handleEditStart("title")}
                        wordBreak="break-word"
                      >
                        {task?.title}
                      </Heading>
                    )}
                  </Box>

                  <Box position="relative">
                    {editMode === "all" || editMode === "description" ? (
                      <Box>
                        <Textarea
                          ref={descInputRef}
                          value={editFormData.description}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              description: e.target.value,
                            })
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Escape") {
                              e.preventDefault();
                              handleEditCancel();
                            }
                          }}
                          size={{ base: "md", md: "sm" }}
                          resize="vertical"
                          borderRadius="xl"
                          borderColor={borderColor}
                          _focus={{
                            borderColor: accentColor,
                            boxShadow: `0 0 0 3px ${useColorModeValue("rgba(59,130,246,0.15)", "rgba(59,130,246,0.3)")}`,
                          }}
                          placeholder="Описание задачи..."
                          mb={3}
                          minH="100px"
                        />
                      </Box>
                    ) : (
                      <Box
                        color={subtextColor}
                        fontSize="md"
                        lineHeight="1.7"
                        whiteSpace="pre-wrap"
                        _hover={{
                          bg: hoverBg,
                          borderRadius: "lg",
                          p: 2,
                          ml: -2,
                          mr: -2,
                        }}
                        transition="all 0.2s"
                        onClick={() => handleEditStart("description")}
                        wordBreak="break-word"
                      >
                        {task?.description || (
                          <Text
                            as="em"
                            color={useColorModeValue("gray.400", "gray.500")}
                            _hover={{ color: accentColor }}
                          >
                            + Добавить описание (кликните для редактирования)
                          </Text>
                        )}
                      </Box>
                    )}
                  </Box>

                  {editMode && (
                    <Flex
                      justify="end"
                      gap={2}
                      mt={4}
                      pt={4}
                      borderTop="1px"
                      borderColor={borderColor}
                      flexDirection={{ base: "column-reverse", md: "row" }}
                    >
                      <Button
                        size={{ base: "lg", md: "sm" }}
                        variant="ghost"
                        leftIcon={<FiX />}
                        onClick={handleEditCancel}
                        isDisabled={isUpdating}
                        borderRadius="lg"
                        w={{ base: "full", md: "auto" }}
                        minH="44px"
                      >
                        Отмена
                      </Button>
                      <Button
                        size={{ base: "lg", md: "sm" }}
                        colorScheme="blue"
                        leftIcon={<FiSave />}
                        onClick={handleEditSave}
                        isLoading={isUpdating}
                        borderRadius="lg"
                        fontWeight="500"
                        w={{ base: "full", md: "auto" }}
                        minH="44px"
                      >
                        Сохранить
                      </Button>
                    </Flex>
                  )}
                </Box>

                <Box
                  bg={bgCard}
                  borderRadius="2xl"
                  p={{ base: 4, md: 6 }}
                  border="1px solid"
                  borderColor={borderColor}
                  boxShadow="0 1px 3px rgba(0,0,0,0.04)"
                >
                  <HStack mb={4} spacing={2}>
                    <Icon
                      as={FiMessageSquare}
                      color={accentColor}
                      boxSize={4}
                    />
                    <Text fontWeight="600" color={textColor} fontSize="md">
                      Комментарии
                    </Text>
                  </HStack>
                  <Divider mb={4} borderColor={borderColor} />
                  <VStack
                    align="stretch"
                    spacing={4}
                    mb={4}
                    maxH={{ base: "300px", md: "250px" }}
                    overflowY="auto"
                    pr={2}
                  >
                    {parsedComments.length > 0 ? (
                      parsedComments.map((c, i) => (
                        <CommentItem
                          key={i}
                          comment={c}
                          avatarSrc={resolveUserAvatarUrl(
                            { username: c.author },
                            avatarLookup,
                          )}
                          textColor={textColor}
                          subtextColor={subtextColor}
                          avatarBg={avatarBg}
                          avatarColor={avatarColor}
                          commentBg={commentBg}
                        />
                      ))
                    ) : (
                      <Text
                        fontSize="sm"
                        color={subtextColor}
                        textAlign="center"
                        py={4}
                      >
                        Комментариев пока нет
                      </Text>
                    )}
                  </VStack>
                  <Flex gap={3} align="end">
                    <Box flex="1">
                      <Textarea
                        placeholder="Напишите комментарий..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        size={{ base: "md", md: "sm" }}
                        resize="none"
                        rows={3}
                        bg={useColorModeValue("gray.50", "gray.700")}
                        borderColor={borderColor}
                        borderRadius="xl"
                        _focus={{
                          borderColor: accentColor,
                          boxShadow: `0 0 0 3px ${useColorModeValue("rgba(59,130,246,0.15)", "rgba(59,130,246,0.3)")}`,
                          bg: bgCard,
                        }}
                        transition="all 0.15s ease"
                        fontSize="sm"
                        isDisabled={!!editMode}
                        minH="80px"
                      />
                      <Flex justify="end" mt={2}>
                        <Button
                          size={{ base: "lg", md: "sm" }}
                          colorScheme="blue"
                          leftIcon={<FiSend />}
                          onClick={handleSendComment}
                          isLoading={isUpdating}
                          isDisabled={!commentText.trim() || !!editMode}
                          borderRadius="lg"
                          fontWeight="500"
                          _hover={{
                            transform: "translateY(-1px)",
                            boxShadow: "0 4px 12px rgba(59,130,246,0.25)",
                          }}
                          _active={{ transform: "translateY(0)" }}
                          transition="all 0.15s ease"
                          w={{ base: "full", md: "auto" }}
                          minH="44px"
                        >
                          Отправить
                        </Button>
                      </Flex>
                    </Box>
                  </Flex>
                </Box>
              </Stack>

              <Stack flex="1" w="full" spacing={6}>
                <Box
                  bg={bgCard}
                  borderRadius="2xl"
                  p={5}
                  border="1px solid"
                  borderColor={borderColor}
                  boxShadow="0 1px 3px rgba(0,0,0,0.04)"
                >
                  <Flex justify="space-between" align="center" mb={4}>
                    <Text
                      fontSize="sm"
                      fontWeight="600"
                      color={textColor}
                      textTransform="uppercase"
                      letterSpacing="wide"
                    >
                      Исполнитель
                    </Text>
                    {!isAssignedToMe && currentUserId && (
                      <Button
                        size="xs"
                        variant="ghost"
                        colorScheme="blue"
                        leftIcon={<FiUserPlus />}
                        onClick={handleAssignToMe}
                        isDisabled={isUpdating || !!editMode}
                        fontWeight="500"
                        _hover={{
                          bg: useColorModeValue("blue.50", "blue.900/20"),
                        }}
                      >
                        На меня
                      </Button>
                    )}
                    {isAssignedToMe && (
                      <Tag size="sm" colorScheme="green" borderRadius="full">
                        <TagLabel>Это вы</TagLabel>
                      </Tag>
                    )}
                  </Flex>

                  <Menu>
                    <MenuButton
                      as={Button}
                      w="full"
                      variant="outline"
                      borderColor={borderColor}
                      borderRadius="xl"
                      justifyContent="start"
                      rightIcon={<FiChevronDown />}
                      isDisabled={isTeamLoading || isUpdating || !!editMode}
                      _hover={{ borderColor: accentColor, bg: hoverBg }}
                      minH="44px"
                      size={{ base: "md", md: "sm" }}
                    >
                      <HStack spacing={3}>
                        {isTeamLoading ? (
                          <Spinner size="sm" color={accentColor} />
                        ) : localAssignee ? (
                          <>
                            <UserAvatar
                              size="sm"
                              user={localAssignee}
                              lookup={avatarLookup}
                              bg={avatarBg}
                              color={avatarColor}
                              fontSize="xs"
                            />
                            <Text
                              fontSize="sm"
                              fontWeight="500"
                              color={textColor}
                              isTruncated
                            >
                              {localAssignee.username}
                            </Text>
                          </>
                        ) : (
                          <>
                            <Icon
                              as={FiUser}
                              color={subtextColor}
                              boxSize={4}
                            />
                            <Text
                              fontSize="sm"
                              color={subtextColor}
                              fontStyle="italic"
                            >
                              —
                            </Text>
                          </>
                        )}
                      </HStack>
                    </MenuButton>
                    <MenuList
                      minW="200px"
                      borderRadius="xl"
                      p={1}
                      boxShadow="lg"
                      maxH="300px"
                      overflowY="auto"
                    >
                      <MenuItem
                        icon={<Icon as={FiX} color="gray.500" boxSize={4} />}
                        onClick={() => handleAssignUser(null)}
                        color={subtextColor}
                        borderRadius="lg"
                        py={2}
                        px={3}
                        _hover={{ bg: menuHoverBg }}
                        fontSize="sm"
                        minH="44px"
                      >
                        Снять назначение
                      </MenuItem>
                      <MenuDivider />
                      {teamData?.data?.map((user: Profile) => {
                        const isSelected = user.id === localAssignee?.id;
                        const isMe = user.id === currentUserId;
                        return (
                          <MenuItem
                            key={user.id}
                            icon={
                              <UserAvatar
                                size="xs"
                                user={user}
                                lookup={avatarLookup}
                                bg={avatarBg}
                                color={avatarColor}
                                fontSize="xx-small"
                              />
                            }
                            onClick={() => handleAssignUser(user.id)}
                            color={isSelected ? accentColor : textColor}
                            fontWeight={isSelected ? "600" : "400"}
                            borderRadius="lg"
                            py={2}
                            px={3}
                            _hover={{ bg: menuHoverBg }}
                            fontSize="sm"
                            isDisabled={isSelected}
                            minH="44px"
                          >
                            <Flex
                              justify="space-between"
                              w="full"
                              align="center"
                            >
                              <Text isTruncated>{user.username}</Text>
                              {isMe && (
                                <Tag
                                  size="xs"
                                  variant="subtle"
                                  colorScheme="blue"
                                  ml={2}
                                >
                                  вы
                                </Tag>
                              )}
                            </Flex>
                          </MenuItem>
                        );
                      })}
                    </MenuList>
                  </Menu>
                </Box>

                <Box
                  bg={bgCard}
                  borderRadius="2xl"
                  p={5}
                  border="1px solid"
                  borderColor={borderColor}
                  boxShadow="0 1px 3px rgba(0,0,0,0.04)"
                >
                  <Text
                    fontSize="sm"
                    fontWeight="600"
                    color={textColor}
                    mb={4}
                    textTransform="uppercase"
                    letterSpacing="wide"
                  >
                    Детали
                  </Text>
                  <VStack align="stretch" spacing={5}>
                    <Divider borderColor={borderColor} />
                    <Box>
                      <HStack spacing={2} mb={3}>
                        <Icon
                          as={FiCalendar}
                          color={subtextColor}
                          boxSize={3.5}
                        />
                        <Text
                          fontSize="xs"
                          color={subtextColor}
                          fontWeight="600"
                          textTransform="uppercase"
                        >
                          Сроки
                        </Text>
                      </HStack>
                      <VStack align="stretch" spacing={2}>
                        <Flex justify="space-between" fontSize="sm">
                          <Text color={subtextColor}>Создано:</Text>
                          <Text fontWeight="500" color={textColor}>
                            {task?.createAt
                              ? formatDate(task.createAt, "dd.MM.yyyy HH:mm")
                              : "—"}
                          </Text>
                        </Flex>
                      </VStack>
                    </Box>
                  </VStack>
                </Box>
              </Stack>
            </Flex>
        </Box>
      </Box>
    </AppPageLayout>
  );
}
