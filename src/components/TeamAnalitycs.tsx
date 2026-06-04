// src/components/TeamAnalitycs/index.tsx
import {
  Box,
  Flex,
  Text,
  Heading,
  Card,
  CardBody,
  Avatar,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  useColorModeValue,
} from "@chakra-ui/react";
import { Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from "recharts";
import type { TaskAnalitycs } from "../types/TeamType";
import { useMemo } from "react";
import type { Task } from "../types/TaskType";
import { useGetTasksQuery } from "../api/TaskApi";

interface TeamAnalyticsProps {
  members: TaskAnalitycs[];
  period?: string;
}

const TASK_COLORS = {
  done: "#22C55E",
  inProgress: "#3B82F6",
  toDevelop: "#8B5CF6",
  toTest: "#F59E0B",
};

const DONUT_COLORS = ["#22C55E", "#3B82F6", "#8B5CF6", "#F59E0B"];

const TeamMemberCard = ({ member }: { member: TaskAnalitycs }) => {
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.100", "gray.700");
  const hoverBg = useColorModeValue("gray.50/50", "gray.700/50");
  const hoverBorder = useColorModeValue("gray.200", "gray.600");
  const nameColor = useColorModeValue("gray.800", "white");
  const roleColor = useColorModeValue("gray.400", "gray.500");
  const avatarBg = useColorModeValue("gray.100", "gray.700");
  const avatarColor = useColorModeValue("gray.600", "gray.300");
  const svgBg = useColorModeValue("#F1F5F9", "#374151");
  const centerTextColor = useColorModeValue("gray.700", "gray.200");
  const barBg = useColorModeValue("gray.100", "gray.700");
  const { data: tasks = [] } = useGetTasksQuery();
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

  const total = totaltask.total || 1;
  const done = totaltask.done || 0;
  const inProgress = totaltask.inProgress || 0;
  const toDevelop = totaltask.development || 0;
  const toTest = totaltask.testing

  const donePercent = total ? Math.round((done / total) * 100) : 0;
  const inProgressPercent = total ? Math.round((inProgress / total) * 100) : 0;
  const toDevelopPercent = total ? Math.round((toDevelop / total) * 100) : 0;
  const toTestPercent = total ? Math.round((toTest / total) * 100) : 0;

  const segments = [
    { percent: donePercent, color: TASK_COLORS.done },
    { percent: inProgressPercent, color: TASK_COLORS.inProgress },
    { percent: toDevelopPercent, color: TASK_COLORS.toDevelop },
    { percent: toTestPercent, color: TASK_COLORS.toTest },
  ].filter((seg) => seg.percent > 0);

  const isOnline = member.status === "В сети";

  return (
    <Box
      mb={3}
      p={4}
      borderRadius="xl"
      bg={cardBg}
      border="1px"
      borderColor={borderColor}
      _hover={{ borderColor: hoverBorder, bg: hoverBg }}
      transition="all 0.2s ease"
      cursor="pointer"
    >
      <Flex align="center" gap={3}>
        <Box position="relative">
          <Avatar
            name={member.username}
            size="sm"
            bg={avatarBg}
            color={avatarColor}
            fontWeight="medium"
          />
          {isOnline && (
            <Box
              position="absolute"
              bottom={0}
              right={0}
              w="2.5"
              h="2.5"
              borderRadius="full"
              bg="green.500"
              border="2px solid"
              borderColor={cardBg}
            />
          )}
        </Box>

        <Box flex={1} minWidth={0}>
          <Text fontWeight="medium" fontSize="sm" color={nameColor} isTruncated>
            {member.username}
          </Text>
          <Text fontSize="xs" color={roleColor} isTruncated>
            {member.role}
          </Text>
        </Box>

        <Box position="relative" w="36px" h="36px">
          <svg viewBox="0 0 36 36" style={{ transform: "rotate(-90deg)" }}>
            <circle
              cx="18"
              cy="18"
              r="14"
              fill="none"
              stroke={svgBg}
              strokeWidth="3"
            />
            <circle
              cx="18"
              cy="18"
              r="14"
              fill="none"
              stroke={
                donePercent >= 75
                  ? "#22C55E"
                  : donePercent >= 50
                    ? "#F59E0B"
                    : "#94A3B8"
              }
              strokeWidth="3"
              strokeDasharray={`${donePercent * 0.88} 88`}
              strokeLinecap="round"
            />
          </svg>
          <Text
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            fontSize="xs"
            fontWeight="semibold"
            color={centerTextColor}
          >
            {donePercent}
          </Text>
        </Box>
      </Flex>

      {segments.length > 0 && (
        <Flex h="3px" borderRadius="full" overflow="hidden" mt={3} bg={barBg}>
          {segments.map((segment, idx) => (
            <Box
              key={idx}
              bg={segment.color}
              style={{ width: `${segment.percent}%` }}
              minW={segment.percent > 2 ? "2px" : "0"}
            />
          ))}
        </Flex>
      )}
    </Box>
  );
};
//@ts-ignore
const TeamDonutChart = ({ members }: { members: TaskAnalitycs[] }) => {
  const tooltipBg = useColorModeValue("white", "gray.800");
  const tooltipBorder = useColorModeValue("gray.100", "gray.700");
  const tooltipTextColor = useColorModeValue("gray.700", "gray.200");
  const pieStroke = useColorModeValue("white", "gray.800");
  const centerTextColor = useColorModeValue("gray.700", "gray.200");
  const centerSubtextColor = useColorModeValue("gray.500", "gray.400");

  const { data: tasks = []} = useGetTasksQuery();
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

  const data = [
    {
      name: "Готово",
      value: totaltask.done,
      percent: totaltask.total
        ? Math.round((totaltask.done / totaltask.total) * 100)
        : 0,
      color: DONUT_COLORS[0],
    },
    {
      name: "В разработке",
      value: totaltask.inProgress,
      percent: totaltask.total
        ? Math.round((totaltask.inProgress / totaltask.total) * 100)
        : 0,
      color: DONUT_COLORS[1],
    },
    {
      name: "К разработке",
      value: totaltask.development,
      percent: totaltask.total
        ? Math.round((totaltask.development / totaltask.total) * 100)
        : 0,
      color: DONUT_COLORS[2],
    },
    {
      name: "К тестированию",
      value: totaltask.testing,
      percent: totaltask.total
        ? Math.round((totaltask.testing / totaltask.total) * 100)
        : 0,
      color: DONUT_COLORS[3],
    },
  ].filter((item) => item.value > 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload?.length) {
      const data = payload[0].payload;
      return (
        <Box
          bg={tooltipBg}
          p={3}
          borderRadius="lg"
          boxShadow="lg"
          border="1px"
          borderColor={tooltipBorder}
        >
          <Text fontWeight="semibold" color={tooltipTextColor} fontSize="sm">
            {data.name}
          </Text>
          <Text fontSize="lg" fontWeight="bold" color={data.color}>
            {data.percent}%
          </Text>
        </Box>
      );
    }
    return null;
  };

  return (
    <Box h="300px" position="relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={110}
            paddingAngle={4}
            dataKey="value"
            stroke={pieStroke}
            strokeWidth={3}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                style={{ cursor: "pointer" }}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <Box
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        textAlign="center"
      >
        <Text fontSize="3xl" fontWeight="bold" color={centerTextColor}>
          {totaltask.total
            ? Math.round((totaltask.done / totaltask.total) * 100)
            : 0}
          %
        </Text>
        <Text fontSize="xs" color={centerSubtextColor} fontWeight="medium">
          выполнено
        </Text>
      </Box>
    </Box>
  );
};

export default function TeamAnalytics({
  members,
  period = "Результаты команды",
}: TeamAnalyticsProps) {
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.100", "gray.700");
  const headingColor = useColorModeValue("gray.800", "white");
  const subtextColor = useColorModeValue("gray.500", "gray.400");
  const sectionHeaderColor = useColorModeValue("gray.600", "gray.300");
  const statBg = useColorModeValue("gray.50", "gray.700");
  const statTextColor = useColorModeValue("gray.700", "gray.200");
  const statLabelColor = useColorModeValue("gray.500", "gray.400");
  const legendBg = useColorModeValue("gray.50", "gray.700");
  const legendTextColor = useColorModeValue("gray.600", "gray.300");

  const { data: tasks = [] } = useGetTasksQuery();
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

  const avgEfficiency =
    members.length > 0
      ? Math.round(
          members.reduce((acc, m) => acc + (m.efficiency || 0), 0) /
            members.length,
        )
      : 0;

  const activeMembers = members.filter((m) => m.status === "В сети").length;

  return (
    <Card
      borderRadius="2xl"
      boxShadow="xl"
      bg={cardBg}
      border="1px"
      borderColor={borderColor}
    >
      <CardBody p={10}>
        <Flex justify="space-between" align="center" mb={10}>
          <Box>
            <Heading size="lg" fontWeight="bold" color={headingColor} mb={1}>
              {period}
            </Heading>
            <Text fontSize="sm" color={subtextColor}>
              {members.length} участников • {activeMembers} онлайн
            </Text>
          </Box>
          <Flex gap={2}>
            <Stat
              textAlign="center"
              px={4}
              py={2}
              bg={statBg}
              borderRadius="xl"
            >
              <StatNumber fontSize="xl" fontWeight="bold" color={statTextColor}>
                {totaltask.total}
              </StatNumber>
              <StatLabel fontSize="xs" color={statLabelColor} mb={0}>
                задач
              </StatLabel>
            </Stat>
            <Stat
              textAlign="center"
              px={4}
              py={2}
              bg="green.50"
              _dark={{ bg: "green.900/20" }}
              borderRadius="xl"
            >
              <StatNumber fontSize="xl" fontWeight="bold" color="green.600">
                {totaltask.done}
              </StatNumber>
              <StatLabel fontSize="xs" color="green.600" mb={0}>
                готово
              </StatLabel>
            </Stat>
          </Flex>
        </Flex>

        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={12}>
          <Box>
            <Text
              fontSize="sm"
              fontWeight="semibold"
              color={sectionHeaderColor}
              mb={4}
            >
              Участники команды
            </Text>
            {members.map((member) => (
              <TeamMemberCard key={member.id} member={member} />
            ))}

            <Flex
              gap={5}
              mt={8}
              flexWrap="wrap"
              justify="center"
              p={4}
              bg={legendBg}
              borderRadius="xl"
            >
              <Flex align="center" gap={2}>
                <Box
                  w="3"
                  h="3"
                  borderRadius="md"
                  bg={TASK_COLORS.done}
                  boxShadow="sm"
                />
                <Text fontSize="xs" fontWeight="medium" color={legendTextColor}>
                  готово
                </Text>
              </Flex>
              <Flex align="center" gap={2}>
                <Box
                  w="3"
                  h="3"
                  borderRadius="md"
                  bg={TASK_COLORS.inProgress}
                  boxShadow="sm"
                />
                <Text fontSize="xs" fontWeight="medium" color={legendTextColor}>
                  В разработке
                </Text>
              </Flex>
              <Flex align="center" gap={2}>
                <Box
                  w="3"
                  h="3"
                  borderRadius="md"
                  bg={TASK_COLORS.toDevelop}
                  boxShadow="sm"
                />
                <Text fontSize="xs" fontWeight="medium" color={legendTextColor}>
                  К разработке
                </Text>
              </Flex>
              <Flex align="center" gap={2}>
                <Box
                  w="3"
                  h="3"
                  borderRadius="md"
                  bg={TASK_COLORS.toTest}
                  boxShadow="sm"
                />
                <Text fontSize="xs" fontWeight="medium" color={legendTextColor}>
                  К тестированию
                </Text>
              </Flex>
            </Flex>
          </Box>

          <Box>
            <Text
              fontSize="sm"
              fontWeight="semibold"
              color={sectionHeaderColor}
              textAlign="center"
              mb={2}
            >
              Общий результат команды
            </Text>
            <TeamDonutChart members={members} />

            {/* ✅ Добавлен 4-й стат для "К тестированию" */}
            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={3} mt={4}>
              {/* ✅ Готово */}
              <Stat
                textAlign="center"
                p={3}
                bg={useColorModeValue("green.50", "green.900/20")}
                borderRadius="xl"
              >
                <StatNumber
                  fontSize="xl"
                  fontWeight="bold"
                  color={TASK_COLORS.done}
                >
                  {totaltask.done}
                </StatNumber>
                <StatLabel fontSize="xs" color={statLabelColor} mb={0}>
                  готово
                </StatLabel>
              </Stat>

              {/* ✅ В работе */}
              <Stat
                textAlign="center"
                p={3}
                bg={useColorModeValue("blue.50", "blue.900/20")}
                borderRadius="xl"
              >
                <StatNumber
                  fontSize="xl"
                  fontWeight="bold"
                  color={TASK_COLORS.inProgress}
                >
                  {totaltask.inProgress}
                </StatNumber>
                <StatLabel fontSize="xs" color={statLabelColor} mb={0}>
                  в работе
                </StatLabel>
              </Stat>

              {/* ✅ На тесте */}
              <Stat
                textAlign="center"
                p={3}
                bg={useColorModeValue("amber.50", "amber.900/20")}
                borderRadius="xl"
              >
                <StatNumber
                  fontSize="xl"
                  fontWeight="bold"
                  color={TASK_COLORS.toTest}
                >
                  {totaltask.testing}
                </StatNumber>
                <StatLabel fontSize="xs" color={statLabelColor} mb={0}>
                  на тесте
                </StatLabel>
              </Stat>

              {/* ✅ Эффективность */}
              <Stat
                textAlign="center"
                p={3}
                bg={useColorModeValue("purple.50", "purple.900/20")}
                borderRadius="xl"
              >
                <StatNumber
                  fontSize="xl"
                  fontWeight="bold"
                  color={statTextColor}
                >
                  {avgEfficiency}%
                </StatNumber>
                <StatLabel fontSize="xs" color={statLabelColor} mb={0}>
                  эффективность
                </StatLabel>
              </Stat>
            </SimpleGrid>
          </Box>
        </SimpleGrid>
      </CardBody>
    </Card>
  );
}
