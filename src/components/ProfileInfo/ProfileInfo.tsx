import { Box, SkeletonCircle, Text } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import type { ProfileInfoProps } from "./type";
import { useGetProfileQuery } from "../../api/ProfileApi";
import { useNavigate } from "react-router-dom";
import { getLastNameAndInitials } from "../../utils/utils.formateName";
import { getStoredUser } from "../../utils/auth.storage";
import { getCurrentUserId } from "../../utils/utils.user.id";
import UserAvatar from "../ui/UserAvatar";

export default function ProfileInfo({ id, compact = false }: ProfileInfoProps) {
  const isValidId = Number.isFinite(id) && id > 0;
  const storedUser = getStoredUser();
  const isCurrentUser = isValidId && id === getCurrentUserId();

  const { data, isLoading, isFetching } = useGetProfileQuery(id, {
    skip: !isValidId,
  });

  const username =
    data?.username ||
    (isCurrentUser ? String(storedUser?.username ?? "") : "") ||
    "Пользователь";

  const avatar =
    data?.avatar || (isCurrentUser ? storedUser?.avatar : undefined);

  const prevAvatarRef = useRef<string | undefined>(undefined);
  const [avatarVersion, setAvatarVersion] = useState(0);

  useEffect(() => {
    if (avatar && avatar !== prevAvatarRef.current) {
      prevAvatarRef.current = avatar;
      setAvatarVersion(Date.now());
    }
  }, [avatar]);

  const navigate = useNavigate();

  if (!isValidId) return null;

  const showSkeleton = (isLoading || isFetching) && !avatar && !data?.username;

  return (
    <Box
      display="flex"
      alignItems="center"
      gap="15px"
      cursor="pointer"
      minW={0}
      onClick={() => navigate("/profile")}
    >
      {showSkeleton ? (
        <SkeletonCircle size={compact ? "8" : "10"} flexShrink={0} />
      ) : (
        <UserAvatar
          key={`${avatar}-${avatarVersion}`}
          name={username}
          avatar={avatar}
          cacheKey={avatarVersion || undefined}
          size={compact ? "sm" : "md"}
          flexShrink={0}
        />
      )}

      {!compact && (
        <Box minW={0} flex="1">
          {showSkeleton ? (
            <Box
              h="14px"
              w="80px"
              bg="gray.200"
              _dark={{ bg: "gray.600" }}
              borderRadius="md"
            />
          ) : (
            <Text fontSize={14} isTruncated>
              {getLastNameAndInitials(username)}
            </Text>
          )}
        </Box>
      )}
    </Box>
  );
}
