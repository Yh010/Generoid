/* eslint-disable @typescript-eslint/no-explicit-any */
// src/types/babel-standalone.d.ts

declare module '@babel/standalone' {
  import type { TransformOptions } from '@babel/core';
  
  export interface BabelFileResult {
    ast?: object | null;
    code?: string | null;
    map?: object | null;
    metadata?: object | null;
  }

  export interface FileResultCallback {
    (err: Error | null, result: BabelFileResult | null): void;
  }

  export interface Node {
    type: string;
    [key: string]: any;
  }

  export function transform(code: string, options?: TransformOptions): BabelFileResult;

  export function transformFromAst(
    ast: Node,
    code?: string,
    opts?: TransformOptions,
    callback?: FileResultCallback,
  ): void;

  export function registerPlugin(name: string, plugin: object | (() => void)): void;

  export function registerPlugins(newPlugins: {
    [key: string]: object | (() => void);
  }): void;

  export function registerPreset(name: string, preset: object | (() => void)): void;

  export function registerPresets(newPresets: {
    [key: string]: object | (() => void);
  }): void;

  export const availablePlugins: Record<string, object | (() => void)>;
  export const availablePresets: Record<string, object | (() => void)>;

  export function transformScriptTags(scriptTags?: HTMLCollection): void;

  export function disableScriptTags(): void;

  export const packages: {
    generator: any;
    parser: any;
    template: any;
    traverse: any;
    types: any;
  };
}