import { Picker as RnPicker } from '@react-native-picker/picker';
import { StyleSheet } from 'react-native';

import theme from '../theme';

const styles = StyleSheet.create({
  picker: {
    fontFamily: theme.fonts.main,
    fontSize: theme.fontSizes.body,
    color: theme.colors.textPrimary,
  },
});

const Picker = ({ style, value, options = [], onChange }) => {
  const pickerStyle = { ...styles.picker, ...style };

  return (
    <RnPicker
      style={pickerStyle}
      selectedValue={value}
      onValueChange={onChange}
    >
      {options.map(({ value, label }) => (
        <RnPicker.Item key={value} label={label} value={value} />
      ))}
    </RnPicker>
  );
};

export default Picker;
