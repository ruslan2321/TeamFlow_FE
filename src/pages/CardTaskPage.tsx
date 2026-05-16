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
import SideBar from "../components/SideBar";
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
    <Flex h="100vh" w="100%" bg="gray.50" _dark={{ bg: "gray.900" }}>
      <Box w={{ base: "full", md: "64" }} flexShrink={0} h="full">
        <SideBar />
      </Box>

      <Box
        flex="1"
        display="flex"
        flexDirection="column"
        overflow="hidden"
        h="full"
      >
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
            <TabList style={{ display: "flex", gap: "10px", paddingBottom: 4 }}>
              <Tab sx={{ ...tabStyles.myTasks }}>Все задачи</Tab>
              <Tab sx={{ ...tabStyles.toDevelopment }}>К разработке</Tab>
              <Tab sx={tabStyles.inDevelopment}>В разработке</Tab>
              <Tab sx={tabStyles.toTesting}>К тестированию</Tab>
            </TabList>

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
        <Flex p={10} justifyContent={"end"}>
          <IconButton
            aria-label=""
            _hover={{ bg: "green", transform: "scale(1.2)" }}
            icon={<BsPlus />}
            color={"white"}
            bg={"green"}
            rounded={90}
            onClick={onOpen}
          />
        </Flex>
      </Box>
      <AddTask isOpen={isOpen} onClose={onClose} />
    </Flex>
  );
}
