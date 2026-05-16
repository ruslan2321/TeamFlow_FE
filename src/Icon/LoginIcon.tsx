import { Icon, type IconProps } from "@chakra-ui/react";

export default function LoginIcon(props: IconProps) {
  return (
    <Icon viewBox="0 0 22 22" {...props}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
      >
        <rect width="24" height="24" fill="white" fill-opacity="0.55" />
        <path
          d="M11 7L9.6 8.4L12.2 11H2V13H12.2L9.6 15.6L11 17L16 12L11 7ZM20 19H12V21H20C21.1 21 22 20.1 22 19V5C22 3.9 21.1 3 20 3H12V5H20V19Z"
          fill="black"
          fill-opacity="0.24"
        />
      </svg>
    </Icon>
  );
}
