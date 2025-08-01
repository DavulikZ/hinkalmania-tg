import React from 'react';
import styled from 'styled-components';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: string;
  color?: string;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 10px;
  margin: 0 5px;
  min-width: 80px;
`;

const Label = styled.div`
  font-size: 12px;
  color: #FFFFFF;
  opacity: 0.8;
  margin-bottom: 5px;
  text-align: center;
`;

const ValueContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const Icon = styled.span`
  font-size: 16px;
  margin-right: 5px;
`;

const Value = styled.div<{ color: string }>`
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  color: ${props => props.color};
`;

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  color = '#FFFFFF',
}) => {
  return (
    <Container>
      <Label>{label}</Label>
      <ValueContainer>
        {icon && <Icon>{icon}</Icon>}
        <Value color={color}>{value}</Value>
      </ValueContainer>
    </Container>
  );
};

export default StatCard; 