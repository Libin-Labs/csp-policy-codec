export type Policy = Readonly<Record<string, readonly string[]>>;
export function parsePolicy(text: string): Policy {
  if (typeof text !== 'string' || text.length > 65536)
    throw new TypeError('Expected bounded policy string');
  const out: Record<string, string[]> = {};
  for (const part of text.split(';')) {
    const words = part.trim().split(/\s+/).filter(Boolean);
    if (!words.length) continue;
    const name = words.shift()!.toLowerCase();
    if (!/^[a-z][a-z0-9-]*$/.test(name) || Object.hasOwn(out, name))
      throw new TypeError('Invalid or duplicate directive');
    out[name] = words;
  }
  return Object.fromEntries(Object.entries(out).map(([k, v]) => [k, Object.freeze([...v])]));
}
export function formatPolicy(policy: Policy): string {
  if (!policy || typeof policy !== 'object' || Array.isArray(policy))
    throw new TypeError('Expected directive record');
  return Object.keys(policy)
    .sort()
    .map((k) => {
      if (
        !/^[a-z][a-z0-9-]*$/.test(k) ||
        !Array.isArray(policy[k]) ||
        policy[k]!.some((v) => typeof v !== 'string' || /[;\r\n]/.test(v))
      )
        throw new TypeError('Invalid directive value');
      return [k, ...policy[k]!].join(' ');
    })
    .join('; ');
}
export function directive(policy: Policy, name: string): readonly string[] | undefined {
  return policy[name.toLowerCase()];
}
