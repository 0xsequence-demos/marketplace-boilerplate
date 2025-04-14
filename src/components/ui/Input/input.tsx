'use client';

import * as React from 'react';
import { type Control, Controller, type FieldValues } from 'react-hook-form';

import { cn } from '$ui';
import { CloseIcon, LoadingIcon, SearchIcon } from '../icons';
import { type VariantProps, cva } from 'class-variance-authority';

const inputBoxVariants = cva([
  'flex h-fit w-full items-center rounded-md border border-input bg-transparent text-foreground',
  'divide-x divide-input',
  'ring-offset-background focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
]);

const inputVariants = cva(
  [
    'h-full w-full bg-transparent outline-none',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'file:border-0 file:bg-transparent file:text-sm file:font-medium',
    'placeholder:text-muted-foreground/60',
  ],
  {
    variants: {
      inputSize: {
        sm: 'px-2 py-1 text-sm',
        default: 'px-3 py-2 text-sm',
        md: 'px-3 py-3 text-sm',
        lg: 'text-md px-5 py-3',
      },
    },
    defaultVariants: {
      inputSize: 'default',
    },
  },
);

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;

  inputClassname?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, type, inputSize, inputClassname, prefix, suffix, ...props },
    ref,
  ) => {
    return (
      <div className={cn(inputBoxVariants(), className)}>
        {prefix}
        <input
          className={cn(inputVariants({ inputSize }), inputClassname)}
          type={type}
          ref={ref}
          {...props}
        />
        {suffix}
      </div>
    );
  },
);
Input.displayName = 'Input';

interface SearchInputProps extends React.ComponentProps<typeof Input> {
  iconClassname?: string;
  loading?: boolean;

  onClear?: () => void;
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, iconClassname, onClear, loading, ...props }, ref) => {
    return (
      <Input
        ref={ref}
        className={cn('divide-none', className)}
        prefix={
          <SearchIcon
            className={cn('ml-2 h-5 w-6 text-inherit', iconClassname)}
          />
        }
        suffix={
          <>
            {props.value && !loading ? <CloseIcon onClick={onClear} /> : null}
            {loading ? <LoadingIcon /> : null}
          </>
        }
        {...props}
      />
    );
  },
);

SearchInput.displayName = 'SearchInput';

const ControlInput = <T extends FieldValues>(
  props: Omit<React.ComponentProps<typeof Controller>, 'render' | 'control'> &
    React.ComponentProps<typeof Input> & {
      // control: Control<any, any>
      control: Control<T>;
    },
) => {
  const { name, control, disabled, rules, ...inputProps } = props;

  return (
    <Controller
      name={name}
      control={control as Control<FieldValues>}
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      defaultValue={props.defaultValue}
      disabled={disabled}
      rules={rules}
      render={({ field }) => <Input {...inputProps} {...field} />}
    />
  );
};

export { Input, SearchInput, ControlInput };
