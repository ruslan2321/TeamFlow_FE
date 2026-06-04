// src/components/CardTask/index.tsx
import {
  Avatar,
  Box,
  Flex,
  Text,
  Tag,
  TagLabel,
  useColorModeValue,
  Icon,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import type { Task } from "../../types/TaskType";
import { getTaskListKey } from "../../api/taskNormalize";

interface CardTaskProps {
  tasks?: Task[];
}

// 🎨 Конфигурация статусов — яркие сплошные цвета
const STATUS_CONFIG: Record<
  string,
  { bg: string; color: string; label: string; ring: string }
> = {
  "В разработке": {
    bg: "blue.500",
    color: "white",
    label: "В разработке",
    ring: "rgba(59, 130, 246, 0.3)",
  },
  "К разработке": {
    bg: "gray.500",
    color: "white",
    label: "К разработке",
    ring: "rgba(107, 114, 128, 0.3)",
  },
  "К тестированию": {
    bg: "green.500",
    color: "white",
    label: "К тестированию",
    ring: "rgba(34, 197, 94, 0.3)",
  },
  Готово: {
    bg: "purple.500",
    color: "white",
    label: "Готово",
    ring: "rgba(168, 85, 247, 0.3)",
  },
  Отложено: {
    bg: "orange.500",
    color: "white",
    label: "Отложено",
    ring: "rgba(249, 115, 22, 0.3)",
  },
};

const DEFAULT_STATUS = {
  bg: "gray.400",
  color: "white",
  label: "Без статуса",
  ring: "rgba(156, 163, 175, 0.3)",
};

export default function CardTask({ tasks }: CardTaskProps) {
  // 🎨 Цветовые токены
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const titleColor = useColorModeValue("gray.900", "white");
  const subtextColor = useColorModeValue("gray.600", "gray.400");
  const metaColor = useColorModeValue("gray.500", "gray.500");
  const hoverBorderColor = useColorModeValue("blue.400", "blue.500");
  const emptyBg = useColorModeValue("gray.50", "gray.800/50");

  // Тени
  const cardShadow = useColorModeValue(
    "0 2px 8px rgba(0,0,0,0.06)",
    "0 2px 8px rgba(0,0,0,0.3)",
  );
  const hoverShadow = useColorModeValue(
    "0 12px 24px rgba(59, 130, 246, 0.15)",
    "0 12px 24px rgba(59, 130, 246, 0.25)",
  );

  const navigate = useNavigate();

  if (!tasks?.length) {
    return (
      <Flex
        direction="column"
        align="center"
        justify="center"
        py={16}
        px={4}
        bg={emptyBg}
        borderRadius="2xl"
        border="2px dashed"
        borderColor={useColorModeValue("gray.300", "gray.600")}
      >
        <Icon
          as={AlertCircle}
          w={10}
          h={10}
          color={useColorModeValue("gray.400", "gray.500")}
          mb={3}
        />
        <Text fontSize="lg" fontWeight="semibold" color={titleColor}>
          Задач пока нет
        </Text>
        <Text fontSize="sm" color={subtextColor} mt={1} textAlign="center">
          Создайте первую задачу или измените фильтры
        </Text>
      </Flex>
    );
  }

  return (
    <Box
      display="grid"
      gridTemplateColumns={{
        base: "1fr",
        sm: "repeat(2, 1fr)",
        md: "repeat(3, 1fr)",
        lg: "repeat(4, 1fr)",
      }}
      gap={5}
      p={2}
    >
      {tasks.map((item, index) => {
        const status = STATUS_CONFIG[item.status] || DEFAULT_STATUS;
        const safeTaskName = String(item.name_task ?? "").trim();
        const taskKey = getTaskListKey(item, index);
        const canOpenTask = item.task_id > 0;
        return (
          <Box
            key={taskKey}
            bg={cardBg}
            borderRadius="2xl"
            border="2px solid"
            borderColor={borderColor}
            boxShadow={cardShadow}
            _hover={{
              boxShadow: hoverShadow,
              transform: "translateY(-4px)",
              borderColor: hoverBorderColor,
            }}
            transition="all 0.25s cubic-bezier(0.4, 0, 0.2, 1)"
            p={5}
            display="flex"
            flexDirection="column"
            h="full"
            minH="200px"
            cursor={canOpenTask ? "pointer" : "default"}
            onClick={() => {
              if (canOpenTask) navigate(`/task/${item.task_id}`);
            }}
            position="relative"
            overflow="hidden"
            animation={`fadeInUp 0.35s ease-out ${index * 0.05}s both`}
            _focusVisible={{
              outline: "2px solid",
              outlineColor: hoverBorderColor,
              outlineOffset: "2px",
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (!canOpenTask) return;
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                navigate(`/task/${item.task_id}`);
              }
            }}
          >
            {/* Цветная полоска сверху по статусу */}
            <Box
              position="absolute"
              top={0}
              left={0}
              right={0}
              height="3px"
              bg={status.bg}
              opacity={0.8}
            />

            <Box flex="1" pt={2}>
              {/* Заголовок задачи */}
              <Text
                fontSize="md"
                fontWeight="bold"
                color={titleColor}
                mb={2}
                noOfLines={2}
                lineHeight="short"
                title={item.title}
                transition="color 0.2s ease"
                _groupHover={{ color: hoverBorderColor }}
              >
                {item.title || "Без названия"}
              </Text>

              {/* Описание */}
              <Text
                fontSize="sm"
                color={subtextColor}
                noOfLines={3}
                lineHeight="shorter"
                title={item.description}
              >
                {item.description || "Нет описания"}
              </Text>
            </Box>

            {/* Футер: аватар + статус */}
            <Box mt={4} pt={3} borderTop="1px solid" borderColor={borderColor}>
              <Flex align="center" justify="space-between" gap={2}>
                {/* Исполнитель */}
                <Flex align="center" gap={2.5} minW={0}>
                  <Box
                    p="2px"
                    borderRadius="full"
                    bg={status.bg}
                    flexShrink={0}
                  >
                    <Avatar
                      size="xs"
                      name={safeTaskName || "Не назначено"}
                      bg={cardBg}
                      border="2px solid"
                      borderColor={cardBg}
                      fontSize="8px"
                    />
                  </Box>
                  <Text
                    fontSize="xs"
                    fontWeight="medium"
                    color={metaColor}
                    noOfLines={1}
                    title={item.name_task}
                  >
                    {item.name_task || "Не назначено"}
                  </Text>
                </Flex>

                {/* Статус с цветным свечением */}
                <Tag
                  size="sm"
                  bg={status.bg}
                  color={status.color}
                  borderRadius="full"
                  px={2.5}
                  py={1}
                  flexShrink={0}
                  boxShadow={`0 0 0 3px ${status.ring}`}
                  transition="all 0.2s ease"
                  _hover={{
                    transform: "scale(1.05)",
                    boxShadow: `0 0 0 5px ${status.ring}`,
                  }}
                >
                  <TagLabel
                    fontSize="9px"
                    fontWeight="700"
                    letterSpacing="wide"
                    textTransform="uppercase"
                  >
                    {status.label}
                  </TagLabel>
                </Tag>
              </Flex>
            </Box>

            {/* Декоративный индикатор при наведении */}
            <Box
              position="absolute"
              bottom={0}
              left={0}
              right={0}
              height="1px"
              bg={hoverBorderColor}
              opacity={0}
              _hover={{ opacity: 1 }}
              transition="opacity 0.2s ease"
            />
          </Box>
        );
      })}
    </Box>
  );
}

// 🎬 Анимации (можно вынести в глобальные стили)
const styles = `
  @keyframes fadeInUp {
    from { 
      opacity: 0; 
      transform: translateY(16px); 
    }
    to { 
      opacity: 1; 
      transform: translateY(0); 
    }
  }
`;

if (typeof document !== "undefined") {
  const styleEl = document.createElement("style");
  styleEl.textContent = styles;
  document.head.appendChild(styleEl);
}
