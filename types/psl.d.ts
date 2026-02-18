declare module "psl" {
  function get(domain: string): string | null;
  function parse(domain: string): { domain: string | null; subdomain: string | null; tld: string | null; error?: object };
  function isValid(domain: string): boolean;
}
