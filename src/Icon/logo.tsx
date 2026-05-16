import { Icon, type IconProps } from "@chakra-ui/react";

export default function Logo(props: IconProps) {
  return (
    <Icon viewBox="0 0 14 22" {...props}>
      <svg
        width="45"
        height="47"
        viewBox="0 0 45 47"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          width="44.032"
          height="46.1719"
          rx="22"
          fill="url(#pattern0_7_1391)"
        />
        <defs>
          <pattern
            id="pattern0_7_1391"
            patternContentUnits="objectBoundingBox"
            width="1"
            height="1"
          >
            <use transform="matrix(0.00117233 0 0 0.001118 0 -0.21552)" />
          </pattern>
          <image
            id="image0_7_1391"
            width="853"
            height="1280"
            preserveAspectRatio="none"
          />
        </defs>
      </svg>
    </Icon>
  );
}
