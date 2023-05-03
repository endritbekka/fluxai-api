import * as dotenv from "dotenv";
dotenv.config();

interface configurationI {
  default: {
    app_front_url: string;
  };
  server: {
    app_port: string;
  };
  database: {
    url: string;
  };
  redis: {
    url: string;
  };
  user: {
    roles: {
      ADMIN: string;
      USER: string;
    };
  };
  jwt: {
    tfa_auth_key: string;
    tfa_auth_key_exp: string;
    mail_key: string;
    mail_two_factor_expire: string;
  };
  mail: {
    api_key: string;
    from_email: string;
  };
  organization: {
    types: {
      COMPANY: string;
      INDIVIDUAL: string;
    };
  };
}

const configuration: configurationI = {
  server: {
    app_port: process.env.APP_PORT || "3000",
  },
  database: {
    url: process.env.DB_URL || "",
  },
  redis: {
    url: process.env.REDIS_URL || "",
  },
  jwt: {
    tfa_auth_key: process.env.JWT_TFA_AUTH_KEY as string,
    tfa_auth_key_exp: "10m",
    mail_key: process.env.JWT_MAIL_KEY as string,
    mail_two_factor_expire: "10m",
  },
  user: {
    roles: {
      ADMIN: "ADMIN",
      USER: "USER",
    },
  },
  organization: {
    types: {
      COMPANY: "COMPANY",
      INDIVIDUAL: "INDIVIDUAL",
    },
  },
  mail: {
    api_key: process.env.SENDGRID_API_KEY as string,
    from_email: process.env.SENDGRID_SENDER_EMAIL as string,
  },
  default: {
    app_front_url: process.env.APP_FRONT_URL || "",
  },
};

export default configuration;
