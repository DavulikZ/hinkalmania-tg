import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

interface GradientButtonProps {
  title: string;
  onPress: () => void;
  colors?: string[];
  style?: React.CSSProperties;
  textStyle?: React.CSSProperties;
  disabled?: boolean;
}

const Button = styled(motion.button)<{
  colors: string[];
  disabled: boolean;
}>`
  background: linear-gradient(135deg, ${props => props.colors[0]}, ${props => props.colors[1]});
  border: none;
  border-radius: 15px;
  padding: 15px 30px;
  font-size: 16px;
  font-weight: bold;
  color: #FFFFFF;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.5 : 1};
  user-select: none;
  outline: none;
  
  &:active {
    transform: ${props => props.disabled ? 'none' : 'scale(0.98)'};
  }
`;

const GradientButton: React.FC<GradientButtonProps> = ({
  title,
  onPress,
  colors = ['#FF6B6B', '#FF8E8E'],
  style,
  textStyle,
  disabled = false,
}) => {
  return (
    <Button
      colors={colors}
      disabled={disabled}
      onClick={disabled ? undefined : onPress}
      style={style}
      whileHover={disabled ? {} : { scale: 1.05 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
    >
      <span style={textStyle}>{title}</span>
    </Button>
  );
};

export default GradientButton; 