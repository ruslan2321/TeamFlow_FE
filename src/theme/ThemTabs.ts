// theme/ThemTabs.ts
import { defineStyleConfig } from '@chakra-ui/react';
import type { ComponentStyleConfig } from '@chakra-ui/react';

export const tabStyles = {
  myTasks: {
    background: 'white',
    width: '139px',
    height: '37px',
    borderRadius: '10px',
    fontSize: '14px',
    color: 'black',
    transition: 'all 0.2s ease',
    _hover: { background: 'gray.50' },
    _selected: {
      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
      color: 'white',
      boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)',
      border: 'none',
      transform: 'translateY(-1px)',
    },
    _dark: {
      background: 'gray.700',
      color: 'gray.200',
      _hover: { background: 'gray.600' },
      _selected: {
        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
        color: 'white',
        boxShadow: '0 4px 14px rgba(79, 70, 229, 0.4)',
      },
    },
  },
  toDevelopment: {
    background: '#9CA3AF',
    width: '139px',
    height: '37px',
    borderRadius: '10px',
    fontSize: '14px',
    color: 'white',
    transition: 'all 0.2s ease',
    _hover: { background: '#8B95A5' },
    _selected: {
      background: '#6B7280',
      color: 'white',
      boxShadow: '0 4px 14px rgba(107, 114, 128, 0.35)',
      border: 'none',
      transform: 'translateY(-1px)',
    },
    _dark: {
      _selected: {
        background: '#4B5563',
        boxShadow: '0 4px 14px rgba(75, 85, 99, 0.4)',
      },
    },
  },
  inDevelopment: {
    background: '#2F6BFF',
    width: '139px',
    height: '37px',
    borderRadius: '10px',
    fontSize: '14px',
    color: 'white',
    transition: 'all 0.2s ease',
    _hover: { background: '#2563EB' },
    _selected: {
      background: '#1D4ED8',
      color: 'white',
      boxShadow: '0 4px 14px rgba(47, 107, 255, 0.35)',
      border: 'none',
      transform: 'translateY(-1px)',
    },
    _dark: {
      _selected: {
        background: '#1E40AF',
        boxShadow: '0 4px 14px rgba(30, 64, 175, 0.4)',
      },
    },
  },
  toTesting: {
    background: '#16A34A',
    width: '139px',
    height: '37px',
    borderRadius: '10px',
    fontSize: '14px',
    color: 'white',
    transition: 'all 0.2s ease',
    _hover: { background: '#15803D' },
    _selected: {
      background: '#166534',
      color: 'white',
      boxShadow: '0 4px 14px rgba(22, 163, 74, 0.35)',
      border: 'none',
      transform: 'translateY(-1px)',
    },
    _dark: {
      _selected: {
        background: '#14532D',
        boxShadow: '0 4px 14px rgba(20, 83, 45, 0.4)',
      },
    },
  },
};

export const Tabs: ComponentStyleConfig = defineStyleConfig({
  variants: {
    custom: {
      tablist: {
        display: 'flex',
        gap: '10px',
        border: 'none',
        p: '4px',
        bg: 'transparent',
        overflowX: 'auto',
        css: {
          '&::-webkit-scrollbar': { height: '4px' },
          '&::-webkit-scrollbar-thumb': { 
            bg: 'gray.300', 
            borderRadius: '4px',
            _dark: { bg: 'gray.600' }
          },
        },
      },
      tab: {
        _focus: { boxShadow: 'none' },
        _active: { transform: 'scale(0.98)' },
      },
      tabpanel: {
        p: 0,
        mt: 5,
      },
    },
  },
  defaultProps: {
    variant: 'custom',
  },
});

export default Tabs;