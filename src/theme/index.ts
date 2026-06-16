import { extendTheme, type StyleFunctionProps, type ThemeConfig } from "@chakra-ui/react";
import Tabs from "./ThemTabs";

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

export const theme = extendTheme({
  config,
  components: {
    Tabs,
  },
  styles: {
    global: (props: StyleFunctionProps) => ({
      body: {
        bg: props.colorMode === "dark" ? "gray.900" : "white",
        color: props.colorMode === "dark" ? "gray.100" : "gray.800",
      },
    }),
  },
});

export default theme;
