export const getBaseUrl = () => {
  const env = process.env.NODE_ENV;
  if (env === "production") {
    return "https://app.resqx.de"; // Production URL
  }
  return "http://localhost:3000"; // Development URL
};
