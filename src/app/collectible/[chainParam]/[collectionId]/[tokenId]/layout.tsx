import { Flex, cn } from '$ui';
import Sidebar from './_layout/Sidebar';

const CollectableLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Flex
      className={cn(
        '@container/collectibleViewContainer',
        'mx-auto my-12 h-fit min-h-screen w-full max-w-[1200px] flex-col gap-12',
      )}
    >
      <Flex
        className={cn(
         '@max-4xl/collectibleViewContainer:flex-col @max-4xl/collectibleViewContainer:gap-6 sm:px-4',
          '@4xl/collectibleViewContainer:flex-row @4xl/collectibleViewContainer:gap-8'
        )}
      >
        <Sidebar />
        <Flex className="flex-1 flex-col">{children}</Flex>
      </Flex>
    </Flex>
  );
};

export default CollectableLayout;
