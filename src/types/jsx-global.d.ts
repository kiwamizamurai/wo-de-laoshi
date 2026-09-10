import type { JSX as HonoJSX } from 'hono/jsx/dom/jsx-runtime';

declare global {
  namespace JSX {
    type Element = HonoJSX.Element;
    type ElementType = HonoJSX.ElementType;
    type ElementChildrenAttribute = HonoJSX.ElementChildrenAttribute;
    type IntrinsicElements = HonoJSX.IntrinsicElements;
    type IntrinsicAttributes = HonoJSX.IntrinsicAttributes;
  }
}

export {};
