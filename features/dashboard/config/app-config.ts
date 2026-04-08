import packageJson from "../../../package.json";

const currentYear = new Date().getFullYear();

export const APP_CONFIG = {
  name: "Cofino Admin",
  version: packageJson.version,
  copyright: `© ${currentYear}, Cofiño Usados.`,
  meta: {
    title: "Cofiño Admin Dashboard",
    description: "Dashboard administrativo de Cofiño Usados.",
  },
};
