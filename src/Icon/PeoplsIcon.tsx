import { Icon, type IconProps } from '@chakra-ui/react';

export default function PeopleIcon(props: IconProps) {
  return (
    <Icon 
      viewBox="0 0 21 21" 
      boxSize={6} // Стандартный размер иконки
      {...props}  // Разрешить переопределение цвета/размера
    >
      <rect width="21" height="21" fill="url(#pattern0_7_69)"/>
      <defs>
        <pattern id="pattern0_7_69" patternContentUnits="objectBoundingBox" width="1" height="1">
          <use xlinkHref="#image0_7_69" transform="scale(0.01)"/>
        </pattern>
        <image 
          id="image0_7_69" 
          width="100" 
          height="100" 
          preserveAspectRatio="none" 
          xlinkHref="data:image/png;base64,iVBORw0KGgo..." // ваш base64
        />
      </defs>
    </Icon>
  );
}
