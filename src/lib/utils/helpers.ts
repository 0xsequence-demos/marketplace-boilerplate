
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

