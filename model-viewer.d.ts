declare namespace JSX {
  interface IntrinsicElements {
    'model-viewer': any &
      React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
  }
}

declare module '@google/model-viewer';
