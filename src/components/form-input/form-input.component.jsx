import { FormInputLabel, Input, Group } from './form-input.styles';

const FormInput = ({ label, autoComplete, ...otherProps }) => {
  // const hasValue = Boolean(otherProps.value);

  return (
    <Group>
      <Input autoComplete={autoComplete} {...otherProps} />
      {label && (
        <FormInputLabel shrink={otherProps.value.length}>
          {label}
        </FormInputLabel>
      )}
    </Group>
  );
};

export default FormInput;
