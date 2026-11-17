export interface IdentitySession {
  isActive(signal?: AbortSignal): Promise<boolean>
}
