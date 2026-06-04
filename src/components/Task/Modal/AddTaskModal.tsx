// src/components/AddTask/index.tsx
import {
  Button,
  FormControl,
  FormLabel,
  FormHelperText,
  HStack,
  Input,
  Select,
  Textarea,
  useToast,
  VStack,
  useColorModeValue,
  Box,
} from "@chakra-ui/react";
import { useState, type FC, useEffect, useRef } from "react";
import { useAddTaskMutation } from "../../../api/TaskApi";
import type { Task } from "../../../types/TaskType";
import { UI_Modal } from "../../ui/UI_Modal/Modal";
import { useGetTeamQuery } from "../../../api/ProfileApi";
import { getCurrentUserId } from "../../../utils/utils.user.id";

export const AddTask: FC<{
  isOpen: boolean;
  onClose: () => void;
  onCreated?: () => void;
}> = ({ isOpen, onClose, onCreated }) => {
  const toast = useToast();
  const titleRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<Partial<Task>>({
    name_task: "",
    title: "",
    description: "",
    status: "К разработке",
    userId: undefined,
  });

  const [addTask, { isLoading }] = useAddTaskMutation();
  const userId = getCurrentUserId();
  const { data: team } = useGetTeamQuery(userId ?? 0);

  // 🎨 Современная палитра: спокойные тона, чёткий контраст
  const inputBg = useColorModeValue("gray.50", "gray.750");
  const inputHoverBg = useColorModeValue("gray.100", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const labelColor = useColorModeValue("gray.700", "gray.300");
  const placeholderColor = useColorModeValue("gray.400", "gray.500");
  const accentColor = "blue.500";
  const successColor = "green.500";

  const statusColors: Record<string, string> = {
    "К разработке": "gray.400",
    "В разработке": "blue.500",
    "К тестированию": "green.500",
    Готово: "purple.500",
  };

  // Фокус на первое поле при открытии модалки
  useEffect(() => {
    if (isOpen && titleRef.current) {
      setTimeout(() => titleRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!formData.name_task?.trim() || !formData.title?.trim()) {
      toast({
        title: "Заполните название и заголовок",
        status: "warning",
        isClosable: true,
        duration: 3000,
      });
      return;
    }
    if (!formData.userId) {
      toast({
        title: "Выберите исполнителя",
        status: "warning",
        isClosable: true,
        duration: 3000,
      });
      return;
    }

    const { userId, ...taskDto } = formData;

    try {
      await addTask({ dto: taskDto, userId: Number(userId) }).unwrap();
      onCreated?.();
      toast({
        title: "Задача создана",
        status: "success",
        isClosable: true,
        duration: 3000,
      });
      setFormData({
        name_task: "",
        title: "",
        description: "",
        status: "К разработке",
        userId: undefined,
      });
      onClose();
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: error?.data?.message || "Не удалось создать задачу",
        status: "error",
        isClosable: true,
        duration: 4000,
      });
    }
  };

  return (
    <UI_Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      title="Новая задача"
      contentBody={
        <VStack spacing={5} align="stretch" py={1}>
          {/* Название */}
          <FormControl isRequired>
            <FormLabel
              fontSize="sm"
              fontWeight="500"
              color={labelColor}
              mb={1.5}
            >
              Название задачи
            </FormLabel>
            <Input
              ref={titleRef}
              placeholder="Краткое имя, например: Обновить хедер"
              bg={inputBg}
              borderColor={borderColor}
              borderRadius="lg"
              h="42px"
              _hover={{ bg: inputHoverBg }}
              focusBorderColor={accentColor}
              _placeholder={{ color: placeholderColor }}
              value={formData.name_task}
              onChange={(e) =>
                setFormData({ ...formData, name_task: e.target.value })
              }
              transition="all 0.15s ease"
            />
          </FormControl>

          {/* Заголовок */}
          <FormControl isRequired>
            <FormLabel
              fontSize="sm"
              fontWeight="500"
              color={labelColor}
              mb={1.5}
            >
              Заголовок
            </FormLabel>
            <Input
              placeholder="Детальное описание для карточки"
              bg={inputBg}
              borderColor={borderColor}
              borderRadius="lg"
              h="42px"
              _hover={{ bg: inputHoverBg }}
              focusBorderColor={accentColor}
              _placeholder={{ color: placeholderColor }}
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              transition="all 0.15s ease"
            />
          </FormControl>

          {/* Описание */}
          <FormControl>
            <FormLabel
              fontSize="sm"
              fontWeight="500"
              color={labelColor}
              mb={1.5}
            >
              Описание
            </FormLabel>
            <Textarea
              placeholder="Подробности, шаги воспроизведения, ожидаемый результат..."
              rows={3}
              resize="vertical"
              bg={inputBg}
              borderColor={borderColor}
              borderRadius="lg"
              _hover={{ bg: inputHoverBg }}
              focusBorderColor={accentColor}
              _placeholder={{ color: placeholderColor }}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              transition="all 0.15s ease"
            />
            <FormHelperText fontSize="xs" color={placeholderColor} mt={2}>
              Необязательно, но помогает исполнителю понять контекст
            </FormHelperText>
          </FormControl>

          {/* Статус и Исполнитель */}
          <HStack spacing={4} align="start">
            <FormControl flex={1}>
              <FormLabel
                fontSize="sm"
                fontWeight="500"
                color={labelColor}
                mb={1.5}
              >
                Статус
              </FormLabel>
              <Select
                bg={inputBg}
                borderColor={borderColor}
                borderRadius="lg"
                h="42px"
                _hover={{ bg: inputHoverBg }}
                focusBorderColor={accentColor}
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                transition="all 0.15s ease"
              >
                {Object.keys(statusColors).map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </Select>
              {/* Современный индикатор статуса: тонкая линия, меняющая цвет */}
              <Box
                mt={2}
                h="3px"
                w="full"
                bg={statusColors[formData.status || ""]}
                borderRadius="full"
                transition="background 0.2s"
              />
            </FormControl>

            <FormControl flex={1} isRequired>
              <FormLabel
                fontSize="sm"
                fontWeight="500"
                color={labelColor}
                mb={1.5}
              >
                Исполнитель
              </FormLabel>
              <Select
                placeholder="Выберите из команды..."
                bg={inputBg}
                borderColor={borderColor}
                borderRadius="lg"
                h="42px"
                _hover={{ bg: inputHoverBg }}
                focusBorderColor={accentColor}
                value={formData.userId}
                onChange={(e) =>
                  setFormData({ ...formData, userId: Number(e.target.value) })
                }
                transition="all 0.15s ease"
              >
                {team?.data?.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.username}
                  </option>
                ))}
              </Select>
            </FormControl>
          </HStack>
        </VStack>
      }
      contentfooter={
        <HStack justify="flex-end" spacing={3} pt={2}>
          <Button
            variant="ghost"
            onClick={onClose}
            borderRadius="lg"
            px={5}
            _hover={{ bg: useColorModeValue("gray.100", "gray.700") }}
            transition="background 0.15s ease"
          >
            Отмена
          </Button>
          <Button
            onClick={handleSubmit}
            isLoading={isLoading}
            loadingText="Создаю..."
            bg={successColor}
            color="white"
            borderRadius="lg"
            px={5}
            fontWeight="500"
            _hover={{
              bg: "green.600",
              transform: "translateY(-1px)",
              boxShadow: "0 4px 12px rgba(34, 197, 94, 0.25)",
            }}
            _active={{ transform: "translateY(0)" }}
            transition="all 0.15s ease"
          >
            Создать задачу
          </Button>
        </HStack>
      }
    />
  );
};
