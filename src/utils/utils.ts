export const appendIfExists = (fd: FormData, key: string, value: any) => {
  if (value !== undefined && value !== null && value !== "") {
    fd.append(key, String(value));
  }
};
