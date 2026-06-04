import {
  Box,
  Flex,
  IconButton,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { BsPlus } from "react-icons/bs";
import AppPageLayout from "../components/layout/AppPageLayout";
import { useState } from "react";
import { useGetTasksQuery } from "../api/TaskApi";
import type { Task } from "../types/TaskType";
import { tabStyles } from "../theme/ThemTabs";
import { AddTask } from "../components/Task/Modal/AddTaskModal";
import CardTask from "../components/Task/CardTask";

export default function CardTaskPage() {
  const { data: tasks = [] } = useGetTasksQuery();
  const [tabIndex, setTabIndex] = useState(0);

  const getFilteredTasks = (index: number): Task[] => {
    if (index === 0) return tasks;
    const statuses = ["", "К разработке", "В разработке", "К тестированию"];
    return tasks.filter((task) => task.status === statuses[index]);
  };

  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <AppPageLayout bg="gray.50" _dark={{ bg: "gray.900" }}>
      <Box display="flex" flexDirection="column" h="full" overflow="hidden">
        <Flex
          align="center"
          justify="space-between"
          px={{ base: 4, md: 8 }}
          py={5}
          bg="white"
          _dark={{ bg: "gray.800" }}
          borderBottom="1px solid"
          borderColor="gray.200"
          boxShadow="sm"
          zIndex={1}
        >
          <Box>
            <Text
              fontSize={{ base: "xl", md: "2xl" }}
              fontWeight="bold"
              color="gray.800"
              _dark={{ color: "white" }}
            >
              Задачи
            </Text>
            <Text
              fontSize="sm"
              color="gray.500"
              _dark={{ color: "gray.400" }}
              mt={0.5}
            >
              Управление проектами и задачами команды
            </Text>
          </Box>
        </Flex>

        <Box
          flex="1"
          overflowY="auto"
          px={{ base: 4, md: 8 }}
          py={6}
          pb={{ base: 24, md: 6 }}
          css={{
            "&::-webkit-scrollbar": { width: "8px" },
            "&::-webkit-scrollbar-track": { bg: "transparent" },
            "&::-webkit-scrollbar-thumb": {
              bg: "gray.300",
              borderRadius: "4px",
            },
            _dark: { "&::-webkit-scrollbar-thumb": { bg: "gray.600" } },
          }}
        >
          <Tabs variant="custom" index={tabIndex} onChange={setTabIndex}>
            <Box
              overflowX="auto"
              css={{ "&::-webkit-scrollbar": { display: "none" } }}
              pb={2}
            >
              <TabList minW="max-content" display="flex" gap="10px" pb={1}>
                <Tab sx={tabStyles.myTasks}>Все задачи</Tab>
                <Tab sx={tabStyles.toDevelopment}>К разработке</Tab>
                <Tab sx={tabStyles.inDevelopment}>В разработке</Tab>
                <Tab sx={tabStyles.toTesting}>К тестированию</Tab>
              </TabList>
            </Box>

            <TabPanels>
              <TabPanel px={0} py={4}>
                <CardTask tasks={getFilteredTasks(0)} />
              </TabPanel>
              <TabPanel px={0} py={4}>
                <CardTask tasks={getFilteredTasks(1)} />
              </TabPanel>
              <TabPanel px={0} py={4}>
                <CardTask tasks={getFilteredTasks(2)} />
              </TabPanel>
              <TabPanel px={0} py={4}>
                <CardTask tasks={getFilteredTasks(3)} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>

        <Box
          position="fixed"
          bottom={{ base: 6, md: 4 }}
          right={{ base: 4, md: 4 }}
          zIndex={10}
        >
          <IconButton
            aria-label="Добавить задачу"
            icon={<BsPlus />}
            bg="green.500"
            color="white"
            size="lg"
            borderRadius="full"
            boxShadow="lg"
            onClick={onOpen}
            _hover={{ bg: "green.600", transform: "scale(1.1)" }}
            transition="all 0.2s ease"
          />
        </Box>
      </Box>
      <AddTask isOpen={isOpen} onClose={onClose} />
    </AppPageLayout>
  );
}
