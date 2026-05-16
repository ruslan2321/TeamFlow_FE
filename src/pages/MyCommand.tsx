// src/pages/MyCommand.tsx
import {
  Avatar,
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  useColorModeValue,
  useToast,
  Spinner,
  Badge,
  Icon,
} from "@chakra-ui/react";
import { Search, Users, UserPlus, Check, AlertCircle } from "lucide-react";
import SideBar from "../components/SideBar";
import { useEffect, useRef, useState } from "react";
import {
  useAddToTeamMutation,
  useGetTeamQuery,
  useSearchUsersQuery,
} from "../api/ProfileApi";
import type { Profile } from "../types/ProfileType";
import {
  UserCard,
  type TeamMember,
} from "../components/MyCommandUser/UserCard";

const getCurrentUserId = (): number | null => {
  try {
    const raw = localStorage.getItem("user");
    if (raw) {
      const parsed = JSON.parse(raw);
      return parsed?.id || parsed?.userId || null;
    }
    const direct = localStorage.getItem("id");
    return direct ? Number(direct) || null : null;
  } catch {
    return null;
  }
};

export const MyCommand = () => {
  const toast = useToast();
  const [addToTeam, { isLoading: isAdding }] = useAddToTeamMutation();

  const currentUserId = getCurrentUserId();

  const {
    data: teamData,
    isLoading: isTeamLoading,
    isError: isTeamError,
    refetch,
  } = useGetTeamQuery(currentUserId!, {
    skip: !currentUserId,
  });

  const teamMembers: TeamMember[] =
    teamData?.data?.map((user: Profile) => ({
      id: user.id,
      username: user.username,
      role: (user as any).role,
      avatar: (user as any).avatar,
      status: (user as any).status || "offline",
      contactInfo: {
        email: user.email,
        phone: (user as any).phone || "",
        fax: (user as any).fax || "",
      },
    })) || [];

  const teamMemberIds = new Set(teamMembers.map((m) => m.id));

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: searchData, isLoading: isSearchLoading } = useSearchUsersQuery(
    { q: debouncedQuery, page: 1, limit: 20 },
    { skip: !debouncedQuery.trim() || !currentUserId },
  );

  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setSearchQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAddToTeam = async (member: Profile) => {
    if (!currentUserId) {
      toast({
        title: "Ошибка авторизации",
        status: "error",
        duration: 3000,
        position: "top-right",
        isClosable: true,
      });
      return;
    }

    try {
      const response = await addToTeam({
        ownerId: currentUserId,
        memberId: member.id,
      }).unwrap();

      toast({
        title: response.message,
        status: response.success ? "success" : "info",
        duration: 3000,
        isClosable: true,
        position: "top-right",
        variant: "subtle",
      });

      if (response.success) {
        setSearchQuery("");
        setDebouncedQuery("");
      }
    } catch (error: any) {
      toast({
        title: error?.data?.message || "Ошибка при добавлении",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  const searchResults = searchData?.data as Profile[] | undefined;
  const isDropdownOpen = searchQuery.trim().length > 0;
  const isProcessing = isAdding;

  // 🎨 Цветовые токены (только сплошные цвета)
  const pageBg = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const headingColor = useColorModeValue("gray.900", "white");
  const textColor = useColorModeValue("gray.600", "gray.400");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const accentColor = "blue.500";
  const accentHover = "blue.600";
  const purpleAccent = "purple.500";
  const pinkAccent = "pink.500";
  const greenAccent = "green.500";

  // Тени
  const cardShadow = useColorModeValue(
    "0 2px 8px rgba(0,0,0,0.08)",
    "0 2px 8px rgba(0,0,0,0.3)",
  );
  const hoverShadow = useColorModeValue(
    "0 12px 24px rgba(59, 130, 246, 0.15)",
    "0 12px 24px rgba(59, 130, 246, 0.25)",
  );

  if (!currentUserId) {
    return (
      <Flex
        justify="center"
        align="center"
        h="100vh"
        bg={pageBg}
        position="relative"
      >
        {/* Цветные декоративные круги */}
        <Box
          position="absolute"
          w="200px"
          h="200px"
          borderRadius="full"
          bg="blue.400"
          opacity={0.1}
          filter="blur(40px)"
          top="20%"
          left="10%"
          animation="pulse 4s ease-in-out infinite"
        />
        <Box
          position="absolute"
          w="180px"
          h="180px"
          borderRadius="full"
          bg="purple.400"
          opacity={0.1}
          filter="blur(35px)"
          bottom="20%"
          right="15%"
          animation="pulse 5s ease-in-out infinite reverse"
        />
        <Text fontSize="lg" color={textColor} zIndex={1}>
          Пожалуйста, авторизуйтесь
        </Text>
      </Flex>
    );
  }

  return (
    <Flex bg={pageBg} minH="100vh" overflow={'hidden'} position="relative">
      {/* Декоративные цветные пятна на фоне */}
      <Box
        position="absolute"
        overflow={"hidden"}
        w="300px"
        h="300px"
        borderRadius="full"
        bg="blue.400"
        opacity={0.08}
        filter="blur(60px)"
        top="-50px"
        right="-50px"
        pointerEvents="none"
        animation="float 20s ease-in-out infinite"
      />
      <Box
        position="absolute"
        w="250px"
        h="250px"
        borderRadius="full"
        bg="purple.400"
        opacity={0.08}
        filter="blur(50px)"
        bottom="-40px"
        left="-30px"
        pointerEvents="none"
        animation="float 25s ease-in-out infinite reverse"
      />

      {/* Сайдбар */}
      <Box
        w={{ base: "full", md: "64" }}
        flexShrink={0}
        zIndex={10}
        bg={cardBg}
        borderRightWidth="1px"
        borderColor={borderColor}
      >
        <SideBar />
      </Box>

      <Flex
        flexDirection="column"
        flex={1}
        p={{ base: 4, md: 8 }}
        overflowY="auto"
        zIndex={1}
      >
        {/* Заголовок с цветными акцентами */}
        <Flex align="center" gap={3} mb={8}>
          <Box
            p={2}
            borderRadius="xl"
            bg={accentColor}
            boxShadow={`0 4px 14px rgba(59, 130, 246, 0.4)`}
          >
            <Icon as={Users} color="white" w={5} h={5} />
          </Box>
          <Text
            fontSize={{ base: "xl", md: "2xl" }}
            fontWeight="bold"
            color={headingColor}
          >
            Моя команда
          </Text>
          {teamMembers.length > 0 && (
            <Badge
              bg={purpleAccent}
              color="white"
              px={2}
              py={1}
              borderRadius="full"
              fontSize="xs"
              fontWeight="medium"
            >
              {teamMembers.length}
            </Badge>
          )}
        </Flex>

        {/* 🔍 Поиск с цветными акцентами */}
        <Flex
          flexDirection="column"
          gap={2}
          ref={wrapperRef}
          position="relative"
          mb={8}
        >
          <InputGroup>
            <InputLeftElement pointerEvents="none" h="full">
              <Icon
                as={Search}
                color={useColorModeValue("gray.400", "gray.500")}
                w={4}
                h={4}
              />
            </InputLeftElement>
            <Input
              placeholder="Поиск сотрудника..."
              bg={cardBg}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              focusBorderColor={accentColor}
              borderRadius="xl"
              h={12}
              pl={10}
              _placeholder={{
                color: useColorModeValue("gray.400", "gray.500"),
              }}
              boxShadow={cardShadow}
              transition="all 0.2s ease"
              _hover={{ boxShadow: hoverShadow, borderColor: accentColor }}
              _focus={{
                boxShadow: `0 0 0 3px rgba(59, 130, 246, 0.2)`,
                borderColor: accentColor,
              }}
            />
          </InputGroup>

          {/* 📋 Выпадающие результаты поиска */}
          {isDropdownOpen && (
            <Box
              bg={cardBg}
              p={4}
              borderRadius="2xl"
              boxShadow="0 12px 40px rgba(0,0,0,0.12)"
              position="absolute"
              top="100%"
              left={0}
              right={0}
              zIndex={20}
              mt={2}
              maxH="420px"
              overflowY="auto"
              border="1px solid"
              borderColor={borderColor}
              borderTopWidth="4px"
              borderTopColor={accentColor}
              animation="slideDown 0.2s ease-out"
            >
              <Flex justify="space-between" align="center" mb={3}>
                <Text fontSize="sm" color={textColor}>
                  Найдено:{" "}
                  <Text as="span" fontWeight="bold" color={accentColor}>
                    {searchResults?.length || 0}
                  </Text>
                </Text>
                {debouncedQuery && (
                  <Badge bg="cyan.100" color="cyan.700" fontSize="xs">
                    «{debouncedQuery}»
                  </Badge>
                )}
              </Flex>

              {isSearchLoading ? (
                <Flex justify="center" py={6}>
                  <Spinner size="md" color={accentColor} thickness="2px" />
                </Flex>
              ) : searchResults?.length ? (
                <Flex flexDirection="column" gap={2}>
                  {searchResults.map((item) => {
                    const isAlreadyInTeam = teamMemberIds.has(item.id);
                    return (
                      <Flex
                        key={item.id}
                        alignItems="center"
                        gap={3}
                        p={3}
                        borderRadius="xl"
                        border="2px solid transparent"
                        bg={useColorModeValue("gray.50", "gray.750")}
                        _hover={
                          !isAlreadyInTeam
                            ? {
                                borderColor: accentColor,
                                bg: useColorModeValue("blue.50", "blue.900/20"),
                                transform: "translateX(4px)",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                              }
                            : undefined
                        }
                        justifyContent="space-between"
                        transition="all 0.2s ease"
                        cursor={isAlreadyInTeam ? "default" : "pointer"}
                      >
                        <Flex gap={3} alignItems="center" flex={1} minW={0}>
                          {/* Цветная рамка аватара */}
                          <Box p="2px" borderRadius="full" bg={accentColor}>
                            <Avatar
                              src={(item as any).avatar}
                              name={item.username}
                              size="sm"
                              bg={cardBg}
                              border="2px solid"
                              borderColor={cardBg}
                            />
                          </Box>
                          <Flex flexDirection="column" minW={0}>
                            <Text
                              fontWeight="semibold"
                              color={headingColor}
                              isTruncated
                            >
                              {item.username}
                            </Text>
                            {(item as any).role && (
                              <Text fontSize="xs" color={textColor} isTruncated>
                                {(item as any).role}
                              </Text>
                            )}
                          </Flex>
                        </Flex>
                        <Button
                          size="sm"
                          colorScheme={isAlreadyInTeam ? "gray" : "green"}
                          variant={isAlreadyInTeam ? "outline" : "solid"}
                          isDisabled={isAlreadyInTeam || isProcessing}
                          isLoading={isAdding}
                          loadingText="Добавляю..."
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToTeam(item);
                          }}
                          leftIcon={
                            isAlreadyInTeam ? (
                              <Icon as={Check} w={3} h={3} />
                            ) : (
                              <Icon as={UserPlus} w={3} h={3} />
                            )
                          }
                          borderRadius="full"
                          px={4}
                          _hover={
                            !isAlreadyInTeam
                              ? {
                                  transform: "scale(1.03)",
                                  boxShadow:
                                    "0 4px 14px rgba(34, 197, 94, 0.3)",
                                }
                              : undefined
                          }
                          transition="all 0.2s ease"
                        >
                          {isAlreadyInTeam ? "В команде" : "Добавить"}
                        </Button>
                      </Flex>
                    );
                  })}
                </Flex>
              ) : (
                <Flex flexDirection="column" align="center" py={6} gap={2}>
                  <Icon
                    as={Search}
                    w={8}
                    h={8}
                    color={useColorModeValue("gray.300", "gray.600")}
                    mb={1}
                  />
                  <Text color={textColor} textAlign="center">
                    Сотрудники не найдены
                  </Text>
                  <Text
                    fontSize="xs"
                    color={useColorModeValue("gray.400", "gray.500")}
                  >
                    Попробуйте изменить запрос
                  </Text>
                </Flex>
              )}
            </Box>
          )}
        </Flex>

        {/* 👥 Сетка команды */}
        <Box>
          <Flex align="center" gap={2} mb={4}>
            <Text fontSize="lg" fontWeight="semibold" color={headingColor}>
              Участники
            </Text>
            {teamMembers.length > 0 && (
              <Badge
                bg={accentColor}
                color="white"
                borderRadius="full"
                fontSize="xs"
              >
                {teamMembers.length}
              </Badge>
            )}
          </Flex>

          <Flex wrap="wrap" gap={5}>
            {isTeamLoading ? (
              <Flex justify="center" w="full" py={12}>
                <Spinner size="lg" color={accentColor} thickness="3px" />
              </Flex>
            ) : isTeamError ? (
              <Flex
                justify="center"
                w="full"
                py={12}
                flexDirection="column"
                align="center"
                gap={4}
              >
                <Flex
                  align="center"
                  gap={2}
                  p={3}
                  borderRadius="xl"
                  bg={useColorModeValue("red.50", "red.900/20")}
                  border="1px solid"
                  borderColor={useColorModeValue("red.200", "red.800")}
                >
                  <Icon as={AlertCircle} w={4} h={4} color="red.500" />
                  <Text
                    color={useColorModeValue("red.600", "red.400")}
                    fontWeight="medium"
                  >
                    Не удалось загрузить команду
                  </Text>
                </Flex>
                <Button
                  variant="outline"
                  colorScheme="blue"
                  onClick={() => refetch()}
                  borderRadius="full"
                  _hover={{
                    bg: useColorModeValue("blue.50", "blue.900/20"),
                    borderColor: accentHover,
                  }}
                >
                  Попробовать снова
                </Button>
              </Flex>
            ) : teamMembers.length > 0 ? (
              teamMembers.map((member, index) => (
                <Box
                  key={member.id}
                  flex="1 1 280px"
                  maxW="360px"
                  animation={`fadeInUp 0.4s ease-out ${index * 0.05}s both`}
                >
                  <UserCard member={member} isClickable={false} />
                </Box>
              ))
            ) : (
              <Flex
                flexDirection="column"
                align="center"
                justify="center"
                w="full"
                py={16}
                gap={4}
                textAlign="center"
              >
                <Box
                  p={4}
                  borderRadius="2xl"
                  bg={useColorModeValue("blue.50", "blue.900/20")}
                  border="2px dashed"
                  borderColor={useColorModeValue("blue.200", "blue.700")}
                >
                  <Icon as={Users} w={10} h={10} color={accentColor} mb={2} />
                  <Text fontWeight="semibold" color={headingColor} mb={1}>
                    В вашей команде пока нет участников
                  </Text>
                  <Text fontSize="sm" color={textColor}>
                    Начните с поиска и добавления коллег
                  </Text>
                </Box>
              </Flex>
            )}
          </Flex>
        </Box>
      </Flex>

      {/* 🎬 CSS-анимации */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-15px) translateX(8px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.05; transform: scale(1.05); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </Flex>
  );
};
