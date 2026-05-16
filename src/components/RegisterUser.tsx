/* import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
} from '@chakra-ui/react';
import type { Profile } from '../types/ProfileType';
import { useAddUserMutation } from '../api/ProfileApi';



export default function RegisterUser() {
  const [add] = useAddUserMutation()
  const [formData, setFormData] = useState<Omit<Profile, 'id'>>({
    name: '',
    login: '',
    password: '',
    firstname: '',
    lastname: '',
    post: '',
    role: '',
    image: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try{
      await add(formData).unwrap()

    }catch{}
  }

  return (
    <Box  mx="auto" p={5}>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl>
            <FormLabel>Имя:</FormLabel>
            <Input name="name" value={formData.name} onChange={handleChange} />
          </FormControl>
          <FormControl>
            <FormLabel>Фамилия:</FormLabel>
            <Input name="lastname" value={formData.lastname} onChange={handleChange} />
          </FormControl>
          <FormControl>
            <FormLabel>Отчество:</FormLabel>
            <Input name="firstname" value={formData.firstname} onChange={handleChange} />
          </FormControl>
          <FormControl>
            <FormLabel>Должность:</FormLabel>
            <Input name="post" value={formData.post} onChange={handleChange} />
          </FormControl>
          <FormControl>
            <FormLabel>Логин:</FormLabel>
            <Input name='login' value={formData.login} onChange={handleChange}/>
          </FormControl>
          <FormControl>
            <FormLabel>Придумайте Пароль:</FormLabel>
            <Input name='password' value={formData.password} onChange={handleChange}/>
          </FormControl>
         <FormControl>
            <FormLabel>Роль: </FormLabel>
            <Select
              name='role'
              onChange={handleChange}
              value={formData.role}
            >
              <option value={'Admin'}>Админ</option>
              <option value={'User'}>Пользователь</option>
            </Select>
          </FormControl>
          <Button colorScheme="blue" type="submit">Сохранить</Button>
        </VStack>
      </form>
    </Box>
  );
}
 */