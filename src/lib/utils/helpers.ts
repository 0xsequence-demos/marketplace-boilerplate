export const textClassName = (isEmpty: boolean) =>
  `${isEmpty ? 'italic' : ''} text-${
    isEmpty ? 'foreground/50' : 'foreground'
  } font-${isEmpty ? 'light' : 'normal'}}`;

export const isHtml = (fileName: string) => {
  const isHtml = /.*\.(html\?.+|html)$/.test(fileName?.toLowerCase());
  return isHtml;
};

export const isVideo = (fileName: string) => {
  const isVideo = /.*\.(mp4|ogg|webm)$/.test(fileName?.toLowerCase());
  return isVideo;
};

export const is3dModel = (fileName: string) => {
  const isGltf = /.*\.gltf$/.test(fileName?.toLowerCase());
  return isGltf;
};

export const isDefined = <T>(value: T): value is NonNullable<T> =>
  value != null;
