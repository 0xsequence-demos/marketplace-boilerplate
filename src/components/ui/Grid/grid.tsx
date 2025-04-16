import React from 'react';

import { cn } from '$ui';
import { Slot } from '@radix-ui/react-slot';

type GridStyleProps = {
  templateRows?: string;
  templateColumns?: string;
  templateAreas?: string;
  template?: string;
};

interface GridProps
  extends React.HTMLAttributes<HTMLDivElement>,
    GridStyleProps {
  as?: string;
  asChild?: boolean;

  children?: React.ReactNode;
}

export const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  (props, ref) => {
    const {
      as,
      asChild,
      children,
      className,
      template,
      templateAreas,
      templateColumns,
      templateRows,
      style,
      ...otherProps
    } = props;

    if (as) {
      return React.createElement(
        as,
        {
          ref,
          className: cn('grid', className),
          style: {
            ...(template ? { gridTemplate: template } : {}),
            ...(templateAreas ? { gridTemplateAreas: templateAreas } : {}),
            ...(templateColumns
              ? { gridTemplateColumns: templateColumns }
              : {}),
            ...(templateRows ? { gridTemplateRows: templateRows } : {}),
            ...style,
          },
          ...otherProps,
        },
        children,
      );
    }

    const Comp = asChild ? Slot : 'div';

    return (
      <Comp
        ref={ref}
        className={cn('grid', className)}
        style={{
          ...(template ? { gridTemplate: template } : {}),
          ...(templateAreas ? { gridTemplateAreas: templateAreas } : {}),
          ...(templateColumns ? { gridTemplateColumns: templateColumns } : {}),
          ...(templateRows ? { gridTemplateRows: templateRows } : {}),
          ...style,
        }}
        {...otherProps}
      >
        {children}
      </Comp>
    );
  },
);

Grid.displayName = 'Grid';
interface GridChildProps extends React.HTMLAttributes<HTMLDivElement> {
  name?: string;
  children?: React.ReactNode;
}
export const GridChild = React.forwardRef<HTMLDivElement, GridChildProps>(
  (props, ref) => {
    const { children, name: id, style, ...otherProps } = props;

    return (
      <div
        ref={ref}
        style={{
          gridArea: id,
          ...style,
        }}
        {...otherProps}
      >
        {children}
      </div>
    );
  },
);

GridChild.displayName = 'GridChild';
