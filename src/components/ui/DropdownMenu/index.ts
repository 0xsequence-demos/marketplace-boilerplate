'use client';

import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenu as DropdownMenuRoot,
  DropdownMenuSeparator,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from './dropdownMenu';
import {
  DropdownMenuItemIndicator,
  Item,
  Sub,
  SubTrigger,
  Trigger,
} from '@radix-ui/react-dropdown-menu';

const DropdownMenu = {
  BaseContent: DropdownMenuContent,
  BaseSubContent: DropdownMenuSubContent,
  BaseRadioItem: DropdownMenuRadioItem,

  Root: DropdownMenuRoot,
  Trigger: DropdownMenuTrigger,
  Portal: DropdownMenuPortal,
  Sub: Sub,
  SubTrigger: DropdownMenuSubTrigger,
  SubContent: DropdownMenuSubContent,
  Item: DropdownMenuItem,

  Label: DropdownMenuLabel,
  Seperator: DropdownMenuSeparator,

  Group: DropdownMenuGroup,
  RadioGroup: DropdownMenuRadioGroup,
  ItemIndicator: DropdownMenuItemIndicator,

  TriggerUnStyled: Trigger,
  SubTriggerUnStyled: SubTrigger,
  ItemUnStyled: Item,
};
