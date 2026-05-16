import { Icon, type IconProps } from "@chakra-ui/react";

export default function PeopleIcon(props: IconProps) {
  return (
    <Icon viewBox="0 0 32 32" {...props}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
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
            <use xlink:href="#image0_7_69" transform="scale(0.01)" />
          </pattern>
          <image
            id="image0_7_69"
            width="100"
            height="100"
            preserveAspectRatio="none"
            xlink:href="data:image/png;base64,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"
          />
        </defs>
      </svg>
    </Icon>
  );
}
