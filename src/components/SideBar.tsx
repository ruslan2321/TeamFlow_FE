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
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import {
  FiHome,
  FiUsers,
  FiBarChart2,
  FiLogOut,
  FiSun,
  FiMoon,
  FiMenu,
} from "react-icons/fi";
import { useLocation, Link, useNavigate } from "react-router-dom";
import ProfileInfo from "./ProfileInfo/ProfileInfo";
import { getCurrentUserId } from "../utils/utils.user.id";
import { clearAuthSession } from "../utils/auth.storage";

const NAV_ITEMS = [
  { label: "Главная", path: "/task", icon: FiHome },
  { label: "Моя команда", path: "/command", icon: FiUsers },
  { label: "Аналитика", path: "/analytics", icon: FiBarChart2 },
];

// Внутренний контент сайдбара (без изменений в десктоп-стилях)
const SidebarContent = ({ onClose }: { onClose?: () => void }) => {
  const location = useLocation();
  const navigation = useNavigate();
  const { colorMode, toggleColorMode } = useColorMode();
  const userId = getCurrentUserId();

  const LogOut = () => {
    clearAuthSession();
    navigation("/");
    onClose?.();
  };

  const bgHover = useColorModeValue("gray.100", "gray.700");
  const bgActive = useColorModeValue("blue.50", "blue.900");
  const colorActive = useColorModeValue("blue.600", "blue.300");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const textColor = useColorModeValue("gray.800", "gray.200");
  const subtextColor = useColorModeValue("gray.500", "gray.400");
  const themeHoverBg = useColorModeValue("blue.50", "blue.900/20");
  const logoutHoverBg = useColorModeValue("red.50", "red.900/20");
  const navHoverColor = useColorModeValue("blue.600", "blue.300");

  const handleNavClick = () => onClose?.();

  return (
    <Flex
      flexDirection="column"
      h="100vh"
      w="full"
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
            TeamFlow
          </Text>
        </Flex>
      </Box>

      <Box flex="1" overflowY="auto" pr={1}>
        <Flex flexDirection="column" gap={1}>
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                to={item.path}
                key={item.path}
                style={{ textDecoration: "none" }}
                onClick={handleNavClick}
              >
                <Flex
                  align="center"
                  px={3}
                  py={2.5}
                  minH="44px" // Стандартная зона нажатия для мобильных
                  borderRadius="md"
                  cursor="pointer"
                  bg={isActive ? bgActive : "transparent"}
                  color={isActive ? colorActive : "gray.600"}
                  _dark={{ color: isActive ? colorActive : "gray.400" }}
                  _hover={{ bg: bgHover, color: navHoverColor }}
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
          <Flex flex="1" align="center" gap={2} px={2} py={1} minW={0}>
            {userId != null ? <ProfileInfo id={userId} /> : null}
          </Flex>
          <Tooltip
            label={colorMode === "light" ? "Тёмная тема" : "Светлая тема"}
            hasArrow
          >
            <IconButton
              aria-label="Переключить тему"
              icon={colorMode === "light" ? <FiMoon /> : <FiSun />}
              onClick={toggleColorMode}
              variant="ghost"
              size="sm"
              color={subtextColor}
              _hover={{
                color: "blue.500",
                bg: themeHoverBg,
                transform: "rotate(15deg)",
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
              _hover={{
                color: "red.500",
                bg: logoutHoverBg,
              }}
              transition="all 0.15s ease"
            />
          </Tooltip>
        </Flex>
      </Box>
    </Flex>
  );
};

export default function SideBar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const userId = getCurrentUserId();
  const mobileBorderColor = useColorModeValue("gray.200", "gray.600");
  const mobileTextColor = useColorModeValue("gray.800", "gray.200");

  return (
    <>
      {/* Мобильная шапка (только < md) */}
      <Box
        display={{ base: "flex", md: "none" }}
        position="fixed"
        top={0}
        left={0}
        right={0}
        zIndex={100}
        h={16}
        bg="white"
        _dark={{ bg: "gray.800" }}
        borderBottom="1px solid"
        borderColor={mobileBorderColor}
        px={4}
        alignItems="center"
        justifyContent="space-between"
      >
        <Flex align="center" gap={3} minW={0}>
          <Image src="/icon.png" w="28px" h="28px" alt="Logo" flexShrink={0} />
          <Text
            fontSize="lg"
            fontWeight="bold"
            color={mobileTextColor}
            isTruncated
          >
            TeamFlow
          </Text>
        </Flex>
        <Flex align="center" gap={2} flexShrink={0}>
          {userId != null ? (
            <Box display={{ base: "block", md: "none" }}>
              <ProfileInfo id={userId} compact />
            </Box>
          ) : null}
          <IconButton
            aria-label="Открыть меню"
            icon={<FiMenu />}
            variant="ghost"
            size="md"
            color={mobileTextColor}
            onClick={onOpen}
            minW="44px"
            minH="44px"
          />
        </Flex>
      </Box>

      {/* Десктопный сайдбар */}
      <Box
        display={{ base: "none", md: "block" }}
        w="64"
        flexShrink={0}
        h="100vh"
        position="sticky"
        top={0}
        zIndex={10}
      >
        <SidebarContent />
      </Box>

      {/* Мобильный Drawer */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay bg="blackAlpha.400" />
        <DrawerContent maxW="80vw">
          <DrawerCloseButton />
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
    </>
  );
}
