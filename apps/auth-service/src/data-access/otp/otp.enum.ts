export enum OtpType {
  VERIFY_EMAIL = 'verify_email',
  RESET_PASSWORD = 'reset_password',
  MFA = 'mfa',
}

export enum OtpStatus {
  PENDING = 'pending',
  USED = 'used',
  EXPIRED = 'expired',
}
