export const getImageId = (url: string) => {
  const id = url.split("/").pop();
  return id;
};
