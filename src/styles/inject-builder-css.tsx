"use client";

 
import { useServerInsertedHTML } from 'next/navigation';
import { useRef } from 'react';
 
export default function InjectBuilderCss({
  children,
  cssString,
}: {
  children: React.ReactNode;
  cssString: string;
}) {
  const isServerInserted = useRef(false);
  useServerInsertedHTML(() => {
    if (isServerInserted.current) return null;
    isServerInserted.current = true;
    // Tailwind 4 requires the variables to be in the :root
    const rootCssString = cssString.replace(/body/g, ':root');
    return  <style id="builder-css" dangerouslySetInnerHTML={{ __html: rootCssString }} />
  });
 
   return <>{children}</>;
}