import React, { useMemo } from "react";
import {
  Flex,
  Box,
  Text,
  Heading,
  SimpleGrid,
  Card,
  CardBody,
  Tag,
  Icon,
  useColorModeValue,
  HStack,
  VStack,
  Badge,
  Spinner,
} from "@chakra-ui/react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  TimeIcon,
  WarningIcon,
  CheckCircleIcon,
  SettingsIcon,
  RepeatIcon,
} from "@chakra-ui/icons";

import AppPageLayout from "../components/layout/AppPageLayout";
import TeamAnalytics from "../components/TeamAnalitycs";
import type { TaskAnalitycs } from "../types/TeamType";
import { useGetMyTaskQuery } from "../api/TaskApi";
import { getCurrentUserId } from "../utils/utils.user.id";
import { useGetTeamQuery } from "../api/ProfileApi";
import type { Profile } from "../types/ProfileType";
import type { Task } from "../types/TaskType";

interface KPICardProps {
  label: string;
  value: string | number;
  trend?: string;
  subValue?: string;
  color: string;
  icon: React.ElementType;
  isDown?: boolean;
}

const KPICard = ({
  label,
  value,
  trend,
  subValue,
  color,
  icon,
  isDown,
}: KPICardProps) => {
  const accentColor = useColorModeValue(`${color}.500`, `${color}.400`);
  const bgLight = useColorModeValue(`${color}.50`, `${color}.900/30`);
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.100", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");
  const subtextColor = useColorModeValue("gray.500", "gray.400");
  const trendBg = useColorModeValue("gray.50", "gray.700");

  return (
    <Card
      borderRadius="2xl"
      boxShadow="0 4px 20px rgba(0,0,0,0.04)"
      border="1px"
      borderColor={borderColor}
      bg={cardBg}
      position="relative"
      overflow="hidden"
      _hover={{
        transform: "translateY(-3px)",
        boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
      }}
      transition="all 0.25s ease"
    >
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        h="3px"
        bg={accentColor}
      />
      <CardBody p={6}>
        <Flex justify="space-between" align="start" mb={4}>
          <Text fontSize="sm" color={subtextColor} fontWeight="medium">
            {label}
          </Text>
          <Box p={2.5} borderRadius="xl" bg={bgLight}>
            <Icon as={icon} boxSize={4} color={accentColor} />
          </Box>
        </Flex>
        <Flex justify="space-between" align="end">
          <Text
            fontSize="3xl"
            fontWeight="bold"
            color={textColor}
            lineHeight="1"
          >
            {value}
          </Text>
          {trend && (
            <Tag
              size="sm"
              bg={trendBg}
              color={isDown ? "red.400" : "green.400"}
              borderRadius="full"
              px={2.5}
              fontWeight="semibold"
              gap={1}
            >
              {isDown ? (
                <ArrowDownIcon boxSize={3} />
              ) : (
                <ArrowUpIcon boxSize={3} />
              )}
              {trend}
            </Tag>
          )}
        </Flex>
        {subValue && (
          <Text fontSize="xs" color={subtextColor} mt={2}>
            {subValue}
          </Text>
        )}
      </CardBody>
    </Card>
  );
};

const CustomAreaTooltip = ({ active, payload }: any) => {
  const tooltipBg = useColorModeValue("white", "gray.800");
  const tooltipBorder = useColorModeValue("gray.100", "gray.700");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const subtextColor = useColorModeValue("gray.500", "gray.400");

  if (active && payload?.length) {
    return (
      <Box
        bg={tooltipBg}
        p={3.5}
        borderRadius="xl"
        boxShadow="0 10px 30px rgba(0,0,0,0.12)"
        border="1px"
        borderColor={tooltipBorder}
        minW="180px"
      >
        <Text fontSize="xs" color={subtextColor} fontWeight="medium" mb={2}>
          {payload[0].payload.name}
        </Text>
        <VStack align="start" spacing={1.5}>
          {payload.map((entry: any, index: number) => (
            <Flex key={index} align="center" gap={2}>
              <Box w="2.5" h="2.5" borderRadius="md" bg={entry.stroke} />
              <Text fontSize="sm" fontWeight="medium" color={textColor}>
                {entry.name}: {entry.value}
              </Text>
            </Flex>
          ))}
        </VStack>
      </Box>
    );
  }
  return null;
};

const CustomDonutTooltip = ({ active, payload }: any) => {
  const tooltipBg = useColorModeValue("white", "gray.800");
  const tooltipBorder = useColorModeValue("gray.100", "gray.700");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const subtextColor = useColorModeValue("gray.500", "gray.400");

  if (active && payload?.length) {
    const data = payload[0].payload;
    return (
      <Box
        bg={tooltipBg}
        p={3.5}
        borderRadius="xl"
        boxShadow="0 10px 30px rgba(0,0,0,0.12)"
        border="1px"
        borderColor={tooltipBorder}
        minW="150px"
      >
        <Flex align="center" gap={2.5} mb={1.5}>
          <Box w="3" h="3" borderRadius="md" bg={data.color} boxShadow="sm" />
          <Text fontSize="sm" fontWeight="semibold" color={textColor}>
            {data.name}
          </Text>
        </Flex>
        <Text fontSize="xl" fontWeight="bold" color={textColor}>
          {data.value}%
        </Text>
        <Text fontSize="xs" color={subtextColor}>
          от общего объёма
        </Text>
      </Box>
    );
  }
  return null;
};

export default function AnalyticsPage() {
  const bgGradient = useColorModeValue(
    "linear-gradient(135deg, #F8FAFC 0%, #EDF2F7 100%)",
    "gray.900",
  );
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.100", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");
  const subtextColor = useColorModeValue("gray.500", "gray.400");
  const gridColor = useColorModeValue("#F1F5F9", "#374151");
  const axisColor = useColorModeValue("#94A3B8", "#6B7280");

  const currentUserId = getCurrentUserId();
    const {data:tasks = [], isLoading: isTasksLoading } = useGetMyTaskQuery(currentUserId!, {skip: !currentUserId});
  const {
    data: teamData,
    isLoading: isTeamLoading,
    isError: isTeamError,
  } = useGetTeamQuery(currentUserId!, {
    skip: !currentUserId,
  });

  const totaltask = useMemo(() => {
    const safeTasks = tasks as Task[];
    return {
      total: safeTasks?.length ?? 0,
      inProgress:
        safeTasks?.filter((t) => t.status === "В разработке")?.length ?? 0,
      testing:
        safeTasks?.filter((t) => t.status === "К тестированию")?.length ?? 0,
      done: safeTasks?.filter((t) => t.status === "Готово")?.length ?? 0,
      development:
        safeTasks?.filter((t) => t.status === "К разработке")?.length ?? 0,
    };
  }, [tasks]);

  const pieData = useMemo(() => {
    const total = totaltask.total || 1;
    return [
      {
        name: "В работе",
        value: Math.round((totaltask.inProgress / total) * 100),
        color: "#3B82F6",
      },
      {
        name: "Тестирование",
        value: Math.round((totaltask.testing / total) * 100),
        color: "#F59E0B",
      },
      {
        name: "Готово",
        value: Math.round((totaltask.done / total) * 100),
        color: "#10B981",
      },
      {
        name: "Планирование",
        value: Math.round((totaltask.development / total) * 100),
        color: "#8B5CF6",
      },
    ].filter((item) => item.value > 0);
  }, [totaltask]);

  const areaData = useMemo(() => {
    return ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map((day) => ({
      name: day,
      completed: totaltask.done,
      inProgress: totaltask.inProgress,
      testing: totaltask.testing,
    }));
  }, [totaltask]);

  const teamMembers: TaskAnalitycs[] = useMemo(() => {
    if (!teamData?.data) return [];
    return teamData.data.map((user: Profile): TaskAnalitycs => {
      const extendedUser = user as Profile & {
        role?: string;
        status?: string;
        tasksCount?: number;
        completedTasks?: number;
        activeTasks?: number;
        pendingTasks?: number;
        efficiency?: number;
        workload?: number;
      };
      return {
        id: user.id,
        username: user.username,
        role: extendedUser.role ?? "Сотрудник",
        tasks: {
          total: extendedUser.tasksCount ?? 0,
          done: extendedUser.completedTasks ?? 0,
          inProgress: extendedUser.activeTasks ?? 0,
          todo: extendedUser.pendingTasks ?? 0,
        },
        efficiency: extendedUser.efficiency ?? 0,
        workload: extendedUser.workload ?? 0,
      };
    });
  }, [teamData]);

  const totalDone = pieData.find((d) => d.name === "Готово")?.value || 0;

  if (isTasksLoading || isTeamLoading) {
    return (
      <Flex justify="center" align="center" h="100vh" bg={bgGradient}>
        <Spinner size="xl" color="blue.500" />
      </Flex>
    );
  }

  if (isTeamError) {
    return (
      <Flex justify="center" align="center" h="100vh" bg={bgGradient}>
        <Text color="red.400">Ошибка загрузки данных команды</Text>
      </Flex>
    );
  }

  return (
    <AppPageLayout bg={bgGradient}>
      <Flex
        flex="1"
        direction="column"
        overflowY="auto"
        p={{ base: 4, md: 6, lg: 8, xl: 10 }}
        fontFamily="'Inter', -apple-system, sans-serif"
        minH={0}
      >
        <Flex
          justify="space-between"
          align={{ base: "start", md: "center" }}
          direction={{ base: "column", md: "row" }}
          gap={4}
          mb={8}
        >
          <Box>
            <Heading
              size="xl"
              fontWeight="bold"
              color={textColor}
              letterSpacing="-0.5px"
            >
              Обзор эффективности
            </Heading>
            <Text color={subtextColor} fontSize="sm" mt={1.5}>
              Данные обновляются автоматически • Последнее:{" "}
              {new Date().toLocaleTimeString("ru-RU", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </Box>
        </Flex>

        <SimpleGrid
          columns={{ base: 1, sm: 2, lg: 3, xl: 5 }}
          spacing={4}
          mb={8}
        >
          <KPICard
            label="Всего задач"
            value={totaltask.total}
            trend="+12%"
            color="blue"
            icon={TimeIcon}
            subValue="За последнюю неделю"
          />
          <KPICard
            label="В разработке"
            value={totaltask.inProgress}
            trend="-2%"
            color="orange"
            icon={WarningIcon}
            isDown
            subValue="Текущий статус"
          />
          <KPICard
            label="В тестировании"
            value={totaltask.testing}
            trend="+8%"
            color="amber"
            icon={SettingsIcon}
            subValue="Среднее в день"
          />
          <KPICard
            label="Завершено"
            value={totaltask.done}
            trend="+18%"
            color="green"
            icon={CheckCircleIcon}
            subValue="На этой неделе"
          />
          <KPICard
            label="К разработке"
            value={totaltask.development}
            trend="+5%"
            color="purple"
            icon={RepeatIcon}
            subValue="В очереди"
          />
        </SimpleGrid>

        <SimpleGrid columns={{ base: 1, xl: 3 }} spacing={6} mb={8}>
          <Card
            gridColumn={{ xl: "span 2" }}
            borderRadius="2xl"
            boxShadow="0 4px 20px rgba(0,0,0,0.04)"
            border="1px"
            borderColor={borderColor}
            bg={cardBg}
          >
            <CardBody p={6}>
              <Flex justify="space-between" align="center" mb={6}>
                <Box>
                  <Heading size="md" fontWeight="semibold" color={textColor}>
                    Рабочий процесс
                  </Heading>
                  <Text fontSize="sm" color={subtextColor} mt={1}>
                    Распределение задач по статусам
                  </Text>
                </Box>
                <HStack gap={2}>
                  <Badge colorScheme="green" borderRadius="full" px={2} py={1}>
                    Завершено
                  </Badge>
                  <Badge colorScheme="blue" borderRadius="full" px={2} py={1}>
                    В работе
                  </Badge>
                  <Badge colorScheme="orange" borderRadius="full" px={2} py={1}>
                    Тестирование
                  </Badge>
                </HStack>
              </Flex>

              <Box h="300px">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={areaData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="colorCompleted"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#10B981"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#10B981"
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient
                        id="colorInProgress"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#3B82F6"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#3B82F6"
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient
                        id="colorTesting"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#F59E0B"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#F59E0B"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="4 4"
                      vertical={false}
                      stroke={gridColor}
                    />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: axisColor, fontSize: 11, fontWeight: 500 }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: axisColor, fontSize: 11, fontWeight: 500 }}
                    />
                    <Tooltip
                      content={<CustomAreaTooltip />}
                      cursor={{
                        stroke: gridColor,
                        strokeWidth: 1,
                        strokeDasharray: "5 3",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="completed"
                      name="Завершено"
                      stroke="#10B981"
                      strokeWidth={2.5}
                      fill="url(#colorCompleted)"
                      activeDot={{
                        r: 5,
                        fill: "#10B981",
                        stroke: cardBg,
                        strokeWidth: 2,
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="inProgress"
                      name="В разработке"
                      stroke="#3B82F6"
                      strokeWidth={2.5}
                      fill="url(#colorInProgress)"
                      activeDot={{
                        r: 5,
                        fill: "#3B82F6",
                        stroke: cardBg,
                        strokeWidth: 2,
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="testing"
                      name="В тестировании"
                      stroke="#F59E0B"
                      strokeWidth={2.5}
                      fill="url(#colorTesting)"
                      activeDot={{
                        r: 5,
                        fill: "#F59E0B",
                        stroke: cardBg,
                        strokeWidth: 2,
                      }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </CardBody>
          </Card>

          <Card
            borderRadius="2xl"
            boxShadow="0 4px 20px rgba(0,0,0,0.04)"
            border="1px"
            borderColor={borderColor}
            bg={cardBg}
          >
            <CardBody
              display="flex"
              flexDirection="column"
              alignItems="center"
              p={6}
            >
              <Flex justify="space-between" w="100%" mb={4}>
                <Heading size="md" fontWeight="semibold" color={textColor}>
                  Распределение
                </Heading>
                <Tag
                  size="sm"
                  variant="subtle"
                  colorScheme="purple"
                  borderRadius="full"
                >
                  {pieData.length} статуса
                </Tag>
              </Flex>

              <Box w="100%" h="240px" position="relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={4}
                      dataKey="value"
                      stroke={cardBg}
                      strokeWidth={4}
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color}
                          style={{ cursor: "pointer" }}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomDonutTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <Box
                  position="absolute"
                  top="50%"
                  left="50%"
                  transform="translate(-50%, -50%)"
                  textAlign="center"
                  pointerEvents="none"
                >
                  <Text
                    fontSize="2xl"
                    fontWeight="bold"
                    color={textColor}
                    lineHeight="1"
                  >
                    {totalDone}%
                  </Text>
                  <Text fontSize="xs" color={subtextColor} fontWeight="medium">
                    готово
                  </Text>
                </Box>
              </Box>

              <SimpleGrid
                columns={{ base: 1, sm: 2 }}
                spacing={3}
                w="100%"
                mt={4}
              >
                {pieData.map((item) => (
                  <Flex
                    key={item.name}
                    align="center"
                    gap={2.5}
                    p={2.5}
                    borderRadius="lg"
                    _hover={{ bg: useColorModeValue("gray.50", "gray.700") }}
                    transition="background 0.2s"
                    cursor="pointer"
                  >
                    <Box
                      w="2.5"
                      h="2.5"
                      borderRadius="md"
                      bg={item.color}
                      boxShadow="sm"
                    />
                    <Box>
                      <Text
                        fontSize="xs"
                        fontWeight="semibold"
                        color={textColor}
                      >
                        {item.name}
                      </Text>
                      <Text fontSize="xs" color={subtextColor}>
                        {item.value}%
                      </Text>
                    </Box>
                  </Flex>
                ))}
              </SimpleGrid>
            </CardBody>
          </Card>
        </SimpleGrid>

        <Card
          borderRadius="2xl"
          boxShadow="0 4px 20px rgba(0,0,0,0.04)"
          border="1px"
          borderColor={borderColor}
          bg={cardBg}
        >
          <CardBody p={6}>
            <Flex justify="space-between" align="center" mb={6}>
              <Heading size="md" fontWeight="semibold" color={textColor}>
                Команда
              </Heading>
              <Tag
                size="sm"
                variant="outline"
                colorScheme="gray"
                borderRadius="full"
              >
                {teamMembers.length} участников
              </Tag>
            </Flex>
            {teamMembers.length > 0 ? (
              <TeamAnalytics members={teamMembers} period="За эту неделю" />
            ) : (
              <Text color={subtextColor} textAlign="center" py={4}>
                Нет данных о команде
              </Text>
            )}
          </CardBody>
        </Card>
      </Flex>
    </AppPageLayout>
  );
}
