import { Box, IconButton, Input, InputGroup, InputLeftElement } from '@chakra-ui/react'
import React from 'react'
import SearchIcon from '../../../Icon/SearchIcon'

export default function Search() {
  return (
    <>
    <Box m={'10px'}>
        <InputGroup>
        <InputLeftElement>
            <IconButton bg={'transparent'} w={24} h={24} sx={{with:'24px', height: '24px', _hover: {
                bg: 'transparent'
            }}} aria-label='' icon={<SearchIcon/>} /> 
        </InputLeftElement>
        <Input placeholder='Найти....' bg={'#fffff'}/>
        </InputGroup>
    </Box>
    </>
  )
}
