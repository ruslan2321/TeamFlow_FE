import { Box, Flex, type BoxProps } from "@chakra-ui/react";
import type { ReactNode } from "react";
import SideBar from "../SideBar";

/** Отступ контента под фиксированную мобильную шапку SideBar (chakra spacing 16 = 4rem) */
export const MOBILE_HEADER_PT = 16;

type AppPageLayoutProps = {
  children: ReactNode;
  bg?: BoxProps["bg"];
  _dark?: BoxProps["_dark"];
  /** Декоративный фон (absolute), не перекрывает клики по контенту */
  decorations?: ReactNode;
};

export default function AppPageLayout({
  children,
  bg,
  _dark,
  decorations,
}: AppPageLayoutProps) {
  return (
    <Flex
      minH={{ base: "100dvh", md: "100vh" }}
      w="full"
      bg={bg}
      _dark={_dark}
      overflow="hidden"
      position="relative"
    >
      {decorations}
      <SideBar />
      <Box
        flex="1"
        minW={0}
        pt={{ base: MOBILE_HEADER_PT, md: 0 }}
        display="flex"
        flexDirection="column"
        minH={{ base: "100dvh", md: "100vh" }}
        h={{ md: "100vh" }}
        overflow="hidden"
        position="relative"
        zIndex={1}
      >
        {children}
      </Box>
    </Flex>
  );
}
