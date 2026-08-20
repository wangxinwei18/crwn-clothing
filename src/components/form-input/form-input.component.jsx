import './form-input.styles.scss';

const FormInput = ({ label, ...otherProps }) => {
  const hasValue = Boolean(otherProps.value);

  return (
    <div className="group">
      <input className="form-input" {...otherProps} />
      {label && (
        <label className={`${hasValue ? 'shrink' : ''} form-input-label`}>
          {label}
        </label>
      )}
    </div>
  );
};

export default FormInput;
