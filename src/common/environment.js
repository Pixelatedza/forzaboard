const Environments = {
  Local: {
    name: "local",
    hostname: "localhost",
    apiHost: "",
    apiBase: "/api",
  },
  Prod: {
    name: "prod",
    hostname: "api.forzaboard.net",
    apiHost: "https://api.forzaboard.net",
    apiBase: "",
  },
};

let currentEnv = Environments.Prod;

for (const env of Object.values(Environments)) {
  if (env.hostname === window.location.hostname) {
    currentEnv = env;
    currentEnv.apiHref = currentEnv.apiHost + currentEnv.apiBase;
    break;
  }
}

export const Environment = currentEnv;
