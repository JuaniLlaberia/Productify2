import { ReactNode } from 'react';
import { Label } from './label';

const InputWrapper = ({
  children,
  className,
  label,
  inputId,
  error,
}: {
  children: ReactNode;
  className?: string;
  label?: string;
  inputId: string;
  error?: string;
}) => {
  return (
    <div className={className}>
      <Label htmlFor={inputId}>{label}</Label>
      {children}
      {error && error.length > 0 ? (
        <p className='text-sm px-1 text-red-500'>{error}</p>
      ) : null}
    </div>
  );
};

export default InputWrapper;
