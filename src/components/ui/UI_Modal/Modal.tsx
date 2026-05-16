import {  type FC } from 'react'
import type { CustomModalProps } from './type'
import CloseIcon from '../../../Icon/CloseIcon'
import {  IconButton, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Text } from '@chakra-ui/react'

export const UI_Modal:FC<CustomModalProps> = ({contentBody, contentfooter, size, isOpen, onClose ,title}) =>  {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size={size} >
        <ModalContent>
            <ModalHeader className='flex justify-between'>
    
                <Text>{title}</Text>
                  <IconButton icon={<CloseIcon/>} aria-label='' onClick={onClose}/>
            </ModalHeader>
            <ModalBody>
                {contentBody}
            </ModalBody>
            <ModalFooter>
                {contentfooter}
            </ModalFooter>
        </ModalContent>
    </Modal>
  )
}
