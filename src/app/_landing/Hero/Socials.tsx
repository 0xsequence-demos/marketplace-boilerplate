'use client';

import {
  Button,
  DiscordIcon,
  Flex,
  InstagramIcon,
  LinkIcon,
  TiktokIcon,
  TwitterIcon,
  YoutubeIcon,
  cn,
} from '$ui';
import { type MarketplaceConfig } from '@0xsequence/marketplace-sdk';

type SocialsProps = {
  socials: MarketplaceConfig['socials'];
  className?: string;
};

export const Socials = ({ socials, className }: SocialsProps) => {
  return (
    <Flex className={cn('h-fit w-fit gap-2', className)}>
      {socials
        ? Object.entries(socials).map(([key, val], i) => {
            if (!val) return null;

            let icon: React.ReactNode = <LinkIcon />;

            switch (key) {
              case 'discord': {
                icon = <DiscordIcon />;
                break;
              }
              case 'twitter': {
                icon = <TwitterIcon />;
                break;
              }
              case 'tiktok': {
                icon = <TiktokIcon />;
                break;
              }
              case 'instagram': {
                icon = <InstagramIcon />;
                break;
              }
              case 'youtube': {
                icon = <YoutubeIcon />;
                break;
              }
            }

            const href = val as string;
            return (
              <Button asChild key={i} variant="muted">
                <a target="_blank" href={href}>
                  {icon}
                </a>
              </Button>
            );
          })
        : null}
    </Flex>
  );
};
