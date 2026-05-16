import { Avatar, Box, Text } from "@chakra-ui/react";
import type { ProfileInfoProps } from "./type";
import { useGetProfileQuery } from "../../api/ProfileApi";
import { useNavigate } from "react-router-dom";
//фото для теста
import TestAvatar from '/test-avatar.png'
import { getLastNameAndInitials } from "../../utils/utils.formateName";



export default function ProfileInfo({ id }: ProfileInfoProps) {
  const { data, isLoading, error } = useGetProfileQuery(id);

  const navigate = useNavigate()
  if (isLoading || error) return <></>;



  return (
    <Box display={"flex"} alignItems={'center'} gap={"15px"} onClick={() => {navigate('/profile')}}>
      <Box>
       
        <Avatar src={TestAvatar} cursor={"pointer"} />
      </Box>

      <Box>
        <Text fontSize={14}>{getLastNameAndInitials(data?.username)}</Text>
      </Box>
    </Box>
  );
}