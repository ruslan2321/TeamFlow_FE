import { useColorModeValue } from "@chakra-ui/react";

export const useAuthPageColors = () => ({
  panelBg: useColorModeValue("white", "gray.800"),
  headingColor: useColorModeValue("gray.900", "white"),
  titleColor: useColorModeValue("gray.900", "gray.100"),
  labelColor: useColorModeValue("gray.800", "gray.200"),
  mutedTextColor: useColorModeValue("gray.600", "gray.400"),
  secondaryLabelColor: useColorModeValue("gray.700", "gray.300"),
  overlayBg: useColorModeValue(
    "rgba(255, 255, 255, 0.85)",
    "rgba(26, 32, 44, 0.9)",
  ),
  imageOverlayBg: useColorModeValue("white", "gray.900"),
});
