import {
  Box,
  Flex,
  HStack,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { getStatusConfig } from "../../utils/status.utils";
import type { UserCardProps } from "../../types/TeamType";
import UserAvatar from "../ui/UserAvatar";

export const UserCard = ({
  member,
  isClickable = true,
  onClick,
}: UserCardProps) => {
  const userStatus = getStatusConfig(member.status);

  // 🎨 Цветовая палитра
  const bg = useColorModeValue("white", "gray.800");
  const bgGradient = useColorModeValue(
    "linear(to-br, white, blue.50/40, purple.50/30)",
    "linear(to-br, gray.800, blue.900/20, purple.900/15)",
  );
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const headingColor = useColorModeValue("gray.900", "white");
  const textColor = useColorModeValue("gray.600", "gray.400");
  const accentGradient = useColorModeValue(
    "linear(to-r, blue.400, cyan.400, purple.500)",
    "linear(to-r, blue.300, cyan.300, purple.400)",
  );
  const avatarRingGradient = useColorModeValue(
    "linear(to-r, blue.200, purple.200, pink.200)",
    "linear(to-r, blue.700, purple.700, pink.700)",
  );
  const hoverShadow = useColorModeValue(
    "0 12px 30px -8px rgba(99, 102, 241, 0.25)",
    "0 12px 30px -8px rgba(99, 102, 241, 0.15)",
  );
  const statusShadow = useColorModeValue(
    `0 0 0 3px ${userStatus.color}25`,
    `0 0 0 3px ${userStatus.color}40`,
  );

  return (
    <Box
      bg={bg}
      bgGradient={bgGradient}
      borderRadius="2xl"
      p={6}
      borderWidth="1px"
      borderColor={borderColor}
      boxShadow="sm"
      _hover={
        isClickable
          ? {
              boxShadow: hoverShadow,
              transform: "translateY(-4px)",
              borderColor: "blue.400",
            }
          : {}
      }
      transition="all 0.35s cubic-bezier(0.4, 0, 0.2, 1)"
      cursor={isClickable ? "pointer" : "default"}
      onClick={() => isClickable && onClick?.(member)}
      position="relative"
      overflow="hidden"
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={(e) => {
        if (isClickable && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick?.(member);
        }
      }}
    >
      {/* 🌈 Анимированная градиентная полоска сверху */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        height="3px"
        bgGradient={accentGradient}
        opacity={isClickable ? 0 : 1}
        _groupHover={{ opacity: 1 }}
        transition="opacity 0.3s ease"
      />

      <VStack align="stretch" gap={4} h="full">
        {/* 👤 Шапка: Аватар + Имя/Роль + Статус */}
        <HStack align="start" justify="space-between">
          <HStack spacing={3} flex={1} minW={0}>
            {/* Аватар с градиентной обводкой */}
            <Box
              position="relative"
              p="2px"
              borderRadius="full"
              bgGradient={avatarRingGradient}
              flexShrink={0}
            >
              <UserAvatar
                name={member.username}
                avatar={member.avatar}
                size="md"
                bg={bg}
                color={headingColor}
                fontWeight="semibold"
                _groupHover={{ transform: "scale(1.05)" }}
                transition="all 0.2s ease"
              />
              {member.status === "В сети" && (
                <Box
                  position="absolute"
                  bottom="1px"
                  right="1px"
                  w="10px"
                  h="10px"
                  borderRadius="full"
                  bg="green.400"
                  border="2px solid"
                  borderColor={bg}
                  boxShadow="0 0 0 3px rgba(34, 197, 94, 0.4)"
                  transition="all 0.2s ease"
                  _groupHover={{ boxShadow: `0 0 0 5px ${userStatus.color}50` }}
                />
              )}
            </Box>

            {/* Имя и роль */}
            <VStack align="start" spacing={1} flex={1} minW={0}>
              <Text
                fontWeight="bold"
                fontSize="md"
                color={headingColor}
                isTruncated
                transition="color 0.2s ease"
                _groupHover={{ color: "blue.500" }}
              >
                {member.username}
              </Text>
              {member.role && (
                <Text
                  fontSize="xs"
                  color={textColor}
                  isTruncated
                  fontWeight="medium"
                  letterSpacing="wide"
                  textTransform="uppercase"
                >
                  {member.role}
                </Text>
              )}
            </VStack>
          </HStack>

          {/* 🟢 Бейдж статуса с цветным свечением */}
          <Box
            px={2.5}
            py={1}
            borderRadius="full"
            bg={useColorModeValue(
              `${userStatus.color}15`,
              `${userStatus.color}30`,
            )}
            color={userStatus.color}
            border="1px solid"
            borderColor={useColorModeValue(
              `${userStatus.color}30`,
              `${userStatus.color}50`,
            )}
            boxShadow={statusShadow}
            transition="all 0.2s ease"
            _groupHover={{
              transform: "scale(1.08)",
              boxShadow: `0 0 12px ${userStatus.color}40`,
            }}
            flexShrink={0}
          >
            <Text fontSize="10px" fontWeight="600" letterSpacing="wide">
              {userStatus.label}
            </Text>
          </Box>
        </HStack>

        {/* 📧 Контакты с цветными акцентами */}
        {(member.contactInfo?.email || member.contactInfo?.phone) && (
          <VStack
            align="stretch"
            spacing={2}
            pt={3}
            borderTopWidth="1px"
            borderColor={borderColor}
          >
            {member.contactInfo.email && (
              <HStack
                spacing={2}
                p={2}
                borderRadius="md"
                borderLeft="3px solid"
                borderLeftColor="blue.400"
                transition="all 0.2s ease"
                _groupHover={{
                  bg: useColorModeValue("blue.50/60", "blue.900/15"),
                }}
              >
                <Text fontSize="xs" color={textColor} isTruncated>
                  {member.contactInfo.email}
                </Text>
              </HStack>
            )}
            {member.contactInfo.phone && (
              <HStack
                spacing={2}
                p={2}
                borderRadius="md"
                borderLeft="3px solid"
                borderLeftColor="green.400"
                transition="all 0.2s ease"
                _groupHover={{
                  bg: useColorModeValue("green.50/60", "green.900/15"),
                }}
              >
                <Text fontSize="xs" color={textColor} isTruncated>
                  {member.contactInfo.phone}
                </Text>
              </HStack>
            )}
          </VStack>
        )}

        {/* 🔻 Футер с градиентным CTA */}
        <Flex justify="space-between" align="center" pt={2}>
          <Text fontSize="xs" fontWeight="medium" color={textColor}>
            Участник команды
          </Text>
          {isClickable && (
            <HStack spacing={1}>
              <Text
                fontSize="xs"
                fontWeight="bold"
                bgGradient={accentGradient}
                bgClip="text"
                opacity={0}
                transform="translateX(-6px)"
                transition="all 0.25s ease"
                _groupHover={{ opacity: 1, transform: "translateX(0)" }}
              >
                Подробнее
              </Text>
              <Box
                as="span"
                fontSize="xs"
                color="purple.400"
                fontWeight="bold"
                opacity={0}
                transform="translateX(-4px)"
                transition="all 0.25s ease 0.05s"
                _groupHover={{ opacity: 1, transform: "translateX(0)" }}
              >
                →
              </Box>
            </HStack>
          )}
        </Flex>
      </VStack>
    </Box>
  );
};
