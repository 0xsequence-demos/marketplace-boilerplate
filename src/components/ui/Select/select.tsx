'use client';

import * as React from 'react';
import { Controller } from 'react-hook-form';

import { ChevronDownIcon, cn } from '$ui';
import * as SelectPrimitive from '@radix-ui/react-select';

/* eslint-disable @typescript-eslint/no-unsafe-assignment -- TODO*/

const Select = SelectPrimitive.Root;

const SelectGroup = SelectPrimitive.Group;

const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      'flex h-10 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm',
      'ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'placeholder:text-foreground/60',
      'text-foreground',
      className,
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon>
      <ChevronDownIcon className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content> & {
    container?: HTMLElement | null;
  }
>(({ className, children, position = 'popper', container, ...props }, ref) => (
  <SelectPrimitive.Portal
    container={container}
    // className="relative z-50"
  >
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        'overflow-hidden rounded-md border border-border bg-background text-foreground shadow-md',
        'relative z-50 min-w-[8rem] cursor-pointer',
        'animate-in fade-in-80',
        position === 'popper' && 'translate-y-1',
        className,
      )}
      position={position}
      {...props}
    >
      <SelectPrimitive.Viewport
        className={cn(
          'p-1',
          position === 'popper' &&
            'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]',
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn('py-1.5 pl-8 pr-2 text-sm font-semibold', className)}
    {...props}
  />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex w-full cursor-default select-none items-center rounded-md text-sm outline-none',
      'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      'focus:bg-foreground/10 focus:text-foreground',
      'py-2 pl-4 pr-2',
      className,
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        {/* <CheckIcon className="h-4 w-4" /> */}
      </SelectPrimitive.ItemIndicator>
    </span>

    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn('-mx-1 my-1 h-px bg-muted', className)}
    {...props}
  />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

type ControlledSelectProps = Omit<
  React.ComponentProps<typeof Controller>,
  'render'
> & {
  label: React.ReactNode;
  values: { label: React.ReactNode; value: string }[];
  container?: HTMLElement | null;

  onValueChange: (value: string) => void;
};

const ControlledSelect = ({
  control,
  defaultValue,
  name,
  onValueChange,
  rules,
  label,
  values,
  container,
  ...selectProps
}: ControlledSelectProps) => (
  <Controller
    defaultValue={defaultValue}
    name={name}
    control={control}
    rules={rules}
    disabled={selectProps.disabled}
    render={({ field }) => (
      <Select
        onValueChange={onValueChange}
        defaultValue={defaultValue}
        disabled={field.disabled}
        name={field.name}
        value={field.value}
      >
        <SelectTrigger className="h-12 w-full">{label}</SelectTrigger>
        <SelectContent container={container}>
          {values.map((v, i) => (
            <SelectItem key={i} value={v.value}>
              {v.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )}
  />
);

export {
  Select,
  
  SelectValue,
  SelectTrigger,
  SelectContent,
  
  SelectItem,
  
  ControlledSelect,
};
