import clsx, { type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export { Text } from './Text';
export { Button } from './Button';
export { Box } from './Box';
export { BaseImage as Image } from './Image/image';
export { Flex } from './Flex';
export { Grid } from './Grid';
export { Badge } from './Badge';
export { Switch } from './Switch';
export { Avatar } from './Avatar';
export { Tabs } from './Tabs';
export { Label } from './Label';
export { Checkbox } from './Checkbox';
export { Accordion } from './Accordion';
export { Tooltip } from './Tooltip';
export { Input } from './Input';
export { Table } from './Table';
export { Select } from './Select';
export { ScrollArea } from './ScrollArea';
export { Dialog } from './Dialog';
export { ToastProvider, toast } from './Toast';
export { Portal } from './Portal';

export * from './icons';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
