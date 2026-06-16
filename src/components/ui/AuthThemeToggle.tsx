import { IconButton, useColorMode } from "@chakra-ui/react";
import { FiMoon, FiSun } from "react-icons/fi";

export default function AuthThemeToggle() {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <IconButton
      aria-label="Переключить тему"
      icon={colorMode === "light" ? <FiMoon /> : <FiSun />}
      onClick={toggleColorMode}
      variant="ghost"
      position="fixed"
      top={4}
      right={4}
      zIndex={10}
      size="md"
    />
  );
}
