import React from 'react';

import Pill from './Pill';

type CollectiblePreviewPillProps = {
  imageSrc?: string;
  name: string;
};

const CollectiblePreviewPill = ({
  imageSrc,
  name,
}: CollectiblePreviewPillProps) => {
  return (
    <Pill>
      {imageSrc && (
        <img
          src={imageSrc}
          alt={`${name}-preview`}
          width="3"
          height="3"
          className="rounded-full"
        />
      )}

      <p className="text-text100 text-xsmall font-bold">{name}</p>
    </Pill>
  );
};

export default CollectiblePreviewPill;
