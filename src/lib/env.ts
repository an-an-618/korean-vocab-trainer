export function getRequiredEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is required.`);
  }
  return value;
}

export function getAppOrigin(requestUrl: string) {
  return new URL(requestUrl).origin;
}
