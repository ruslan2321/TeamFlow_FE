import { Icon, type IconProps } from "@chakra-ui/react";

export default function PeopleIcon(props: IconProps) {
  return (
    <Icon viewBox="0 0 32 32" {...props}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="21"
        height="21"
        viewBox="0 0 21 21"
        fill="none"
      >
        <rect width="21" height="21" fill="url(#pattern0_7_69)" />
        <defs>
          <pattern
            id="pattern0_7_69"
            patternContentUnits="objectBoundingBox"
            width="1"
            height="1"
          >
            <use  transform="scale(0.01)" />
          </pattern>
          <image
            id="image0_7_69"
            width="100"
            height="100"
            preserveAspectRatio="none"
      
          />
        </defs>
      </svg>
    </Icon>
  );
}
