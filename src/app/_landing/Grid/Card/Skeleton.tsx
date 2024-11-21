import { Badge, Flex, Image, Text } from '$ui';

export const CollectionCardSkeleton = () => {
  return (
    <Flex className="loading flex-col gap-2 bg-foreground/10 p-2">
      <Image
        containerClassName="h-full flex-1"
        className="object-cover"
        loading
      />

      <Flex className="items-center">
        <Text as="h6" className="text-sm max-lines-[1]" loading>
          -----
        </Text>
      </Flex>

      <Text className="text-sm text-foreground/50 max-lines-[2]" loading>
        -------
        <br />
        -------
      </Text>

      <Flex className="flex-wrap gap-2">
        <Badge variant="muted" loading>
          7D Vol&nbsp;<span>---</span>
        </Badge>
        <Badge variant="muted" loading>
          TVL:&nbsp;<span>---</span>
        </Badge>
      </Flex>
    </Flex>
  );
};
