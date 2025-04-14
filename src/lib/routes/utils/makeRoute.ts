/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Routes } from '..';
import type { ReadonlyURLSearchParams } from 'next/navigation';
import {
  useParams as useNextParams,
  useSearchParams as useNextSearchParams,
} from 'next/navigation';
import queryString from 'query-string';
import { z } from 'zod';

// https://www.flightcontrol.dev/blog/fix-nextjs-routing-to-have-full-type-safety
type RouteBuilder<Params extends z.ZodSchema, Search extends z.ZodSchema> = {
  (p?: z.input<Params>, options?: { search?: z.input<Search> }): string;
  parse: (input: z.input<Params>) => z.output<Params>;
  useParams: () => z.output<Params>;
  useSearchParams: () => z.output<Search>;
  params: z.output<Params>;
};

const empty: z.ZodSchema = z.object({});

export function makeRoute<
  Params extends z.ZodSchema,
  Search extends z.ZodSchema,
>(
  fn: (p: z.input<Params>) => string,
  paramsSchema: Params = empty as Params,
  search: Search = empty as Search,
): RouteBuilder<Params, Search> {
  const routeBuilder: RouteBuilder<Params, Search> = (params, options) => {
    const baseUrl = fn(params);
    const searchString =
      options?.search && queryString.stringify(options.search);
    return [baseUrl, searchString ? `?${searchString}` : ''].join('');
  };

  routeBuilder.parse = function parse(args: z.input<Params>): z.output<Params> {
    const res = paramsSchema.safeParse(args);
    if (!res.success) {
      const routeName =
        Object.entries(Routes).find(
          ([, route]) => (route as unknown) === routeBuilder,
        )?.[0] ?? '(unknown route)';
      throw new Error(
        `Invalid route params for route ${routeName}: ${res.error.message}`,
      );
    }
    return res.data;
  };

  routeBuilder.useParams = function useParams(): z.output<Params> {
    const res = paramsSchema.safeParse(useNextParams());
    if (!res.success) {
      const routeName =
        Object.entries(Routes).find(
          ([, route]) => (route as unknown) === routeBuilder,
        )?.[0] || '(unknown route)';
      throw new Error(
        `Invalid route params for route ${routeName}: ${res.error.message}`,
      );
    }
    return res.data;
  };

  routeBuilder.useSearchParams = function useSearchParams(): z.output<Search> {
    const res = search.safeParse(
      convertURLSearchParamsToObject(useNextSearchParams()),
    );
    if (!res.success) {
      const routeName =
        Object.entries(Routes).find(
          ([, route]) => (route as unknown) === routeBuilder,
        )?.[0] || '(unknown route)';
      throw new Error(
        `Invalid search params for route ${routeName}: ${res.error.message}`,
      );
    }
    return res.data;
  };

  // set the type
  routeBuilder.params = undefined as z.output<Params>;
  // set the runtime getter
  Object.defineProperty(routeBuilder, 'params', {
    get() {
      throw new Error(
        'Routes.[route].params is only for type usage, not runtime. Use it like `typeof Routes.[routes].params`',
      );
    },
  });

  return routeBuilder;
}

function convertURLSearchParamsToObject(
  params: ReadonlyURLSearchParams | null,
): Record<string, string | string[]> {
  if (!params) {
    return {};
  }

  const obj: Record<string, string | string[]> = {};
  for (const [key, value] of params.entries()) {
    if (params.getAll(key).length > 1) {
      obj[key] = params.getAll(key);
    } else {
      obj[key] = value;
    }
  }
  return obj;
}
