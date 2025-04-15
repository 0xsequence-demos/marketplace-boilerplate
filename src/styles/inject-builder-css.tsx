"use client";

 
import { useServerInsertedHTML } from 'next/navigation';
 
export default function InjectBuilderCss({
  children,
  cssString,
}: {
  children: React.ReactNode;
  cssString: string;
}) {
 
  useServerInsertedHTML(() => {
    return <style>{cssString}</style>;
  });
 
  if (typeof window !== 'undefined') return <>{children}</>;
 
  return (
    <>
      {children}
    </>
  );
}