import type { ModalProps, ThemeComponentProps } from "@chakra-ui/react";
import type { ReactNode } from "react";

export interface CustomModalProps {
    title?: string,
    contentBody?: ReactNode,
    contentfooter?: ReactNode,
    isOpen: boolean,
    onClose: () => void;
    size: 'lg' | 'md' 
}