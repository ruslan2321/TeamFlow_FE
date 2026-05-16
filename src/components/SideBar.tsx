import {
  Flex,
  Box,
  Text,
  IconButton,
  Divider,
  useColorModeValue,
  useColorMode,
  Image,
  Tooltip,
} from "@chakra-ui/react";
import {
  FiHome,
  FiUsers,
  FiBarChart2,
  FiLogOut,
  FiSun,
  FiMoon,
} from "react-icons/fi";
import { useLocation, Link, useNavigate } from "react-router-dom";
import ProfileInfo from "./ProfileInfo/ProfileInfo";
import { getCurrentUserId } from "../utils/utils.user.id";

const NAV_ITEMS = [
  { label: "Главная", path: "/task", icon: FiHome },
  { label: "Моя команда", path: "/command", icon: FiUsers },
  { label: "Аналитика", path: "/analytics", icon: FiBarChart2 },
];

export default function SideBar() {
  const location = useLocation();
  const navigation = useNavigate();
  const { colorMode, toggleColorMode } = useColorMode();
  const userId = getCurrentUserId();

  const LogOut = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    navigation("/");
  };

  const bgHover = useColorModeValue("gray.100", "gray.700");
  const bgActive = useColorModeValue("blue.50", "blue.900");
  const colorActive = useColorModeValue("blue.600", "blue.300");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const textColor = useColorModeValue("gray.800", "gray.200");
  const subtextColor = useColorModeValue("gray.500", "gray.400");

  return (
    <Flex
      flexDirection="column"
      h="100vh"
      w={{ base: "full", md: "64" }}
      bg="white"
      _dark={{ bg: "gray.800" }}
      borderRight="1px"
      borderColor={borderColor}
      px={4}
      py={6}
      gap={4}
      transition="background 0.2s ease"
    >
      <Box>
        <Flex align="center" gap={3} px={2}>
          <Image src="/icon.png" w={"64px"} alt="Logo" />
          <Text
            fontSize="xl"
            fontWeight="bold"
            color={textColor}
            letterSpacing="tight"
          >
            TeamFLow
          </Text>
        </Flex>
      </Box>

      <Box flex="1" overflowY="auto" pr={1}>
        <Flex flexDirection="column" gap={1}>
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link to={item.path} key={item.path} style={{ textDecoration: "none" }}>
                <Flex
                  align="center"
                  px={3}
                  py={2.5}
                  borderRadius="md"
                  cursor="pointer"
                  bg={isActive ? bgActive : "transparent"}
                  color={isActive ? colorActive : "gray.600"}
                  _dark={{ color: isActive ? colorActive : "gray.400" }}
                  _hover={{ bg: bgHover, color: "blue.600" }}
                  transition="all 0.15s ease"
                  borderLeft="3px solid"
                  borderColor={isActive ? "blue.500" : "transparent"}
                >
                  <Box as={item.icon} boxSize="5" mr={3} />
                  <Text fontSize="sm" fontWeight="medium">
                    {item.label}
                  </Text>
                </Flex>
              </Link>
            );
          })}
        </Flex>
      </Box>

      <Box>
        <Divider mb={4} borderColor={borderColor} />
        
        <Flex align="center" gap={2}>
          <Flex flex="1" align="center" gap={2} px={2} py={1}>
            <ProfileInfo id={userId ?? 0} />
          </Flex>
          
          <Tooltip label={colorMode === "light" ? "Тёмная тема" : "Светлая тема"} hasArrow>
            <IconButton
              aria-label="Переключить тему"
              icon={colorMode === "light" ? <FiMoon /> : <FiSun />}
              onClick={toggleColorMode}
              variant="ghost"
              size="sm"
              color={subtextColor}
              _hover={{ 
                color: "blue.500", 
                bg: useColorModeValue("blue.50", "blue.900/20"),
                transform: "rotate(15deg)"
              }}
              transition="all 0.2s ease"
            />
          </Tooltip>
          
          <Tooltip label="Выйти" hasArrow>
            <IconButton
              aria-label="Выйти"
              icon={<FiLogOut />}
              onClick={LogOut}
              variant="ghost"
              size="sm"
              color={subtextColor}
              _hover={{ color: "red.500", bg: useColorModeValue("red.50", "red.900/20") }}
              transition="all 0.15s ease"
            />
          </Tooltip>
        </Flex>
      </Box>
    </Flex>
  );
}