declare module "consola" {
  export function ready(obj: { message: string, badge?: boolean }): void;
  export function info(...args: any[]): void;
  export function error(...args: any[]): void;
}
