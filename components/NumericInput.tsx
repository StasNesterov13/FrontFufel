import React from 'react';
import AppInput from './AppInput';

interface Props {
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  style?: any;
}

const NumericInput = ({ value, onChange, placeholder, style }: Props) => {
  return (
    <AppInput
      style={style}
      keyboardType='number-pad'
      placeholder={placeholder}
      value={value === 0 ? '' : String(value)}
      onChangeText={(text) => {
        const num = Number(text.replace(/[^0-9]/g, '')) || 0;
        onChange(num);
      }}
    />
  );
};

export default NumericInput;
