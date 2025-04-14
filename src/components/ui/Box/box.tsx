type BoxProps = React.HTMLAttributes<HTMLDivElement>;

const Box = ({ ...props }: BoxProps) => {
  return <div {...props} />;
};

export { Box };
