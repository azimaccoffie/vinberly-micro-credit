declare module "bcryptjs" {
  export function hash(s: string, saltOrRounds: number): Promise<string>;
  export function compare(s: string, hash: string): Promise<boolean>;
}