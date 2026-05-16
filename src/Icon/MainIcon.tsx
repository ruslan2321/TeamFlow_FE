
import { Icon, type IconProps } from '@chakra-ui/react';

export default function MainIcon(props: IconProps) {


  return (
    <Icon viewBox="0 0 14 22" {...props}>
      <path
        fill="currentColor"
        d="M6.5 0L0 7h2v13h4V12h3v8h4V7h2L6.5 0zm-.5 19H4v-8h2v8zm7 0h-2v-8h2v8z"
      />
    </Icon>
  );
}