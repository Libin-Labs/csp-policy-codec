import * as api from '@lp-labs/csp-policy-codec';
import { parsePolicy, formatPolicy } from '@lp-labs/csp-policy-codec';
const policy = parsePolicy("default-src 'self'; img-src https:");
if (!formatPolicy(policy).includes("default-src 'self'")) throw new Error('Directive missing');
// @ts-expect-error invalid argument must be rejected by declarations
api.parsePolicy(4);
