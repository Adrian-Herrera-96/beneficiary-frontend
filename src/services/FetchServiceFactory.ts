import { APIConnection } from "./APIConnection";
import { APIConnectionFactory } from "./APIConnectionFactory";
import { FetchService } from "./FetchService";

import { checkIp } from "@/helpers/ip";

export class FetchServiceFactory extends APIConnectionFactory {
  private baseUrl: string;

  constructor(baseUrl: string) {
    super();
    this.baseUrl = baseUrl;
  }

  public createAPIConnection(): APIConnection {
    return new FetchService(this.baseUrl);
  }
}

const host = process.env.NEXT_PUBLIC_BACKEND_HOST || "localhost";
const port = process.env.NEXT_PUBLIC_BACKEND_PORT || 3080;
const baseUrl = `http://${host}:${port}/api/`;
const factory = new FetchServiceFactory(baseUrl);

export const apiClient = factory.createAPIConnection();

export const apiClientBiometric = async () => {
  const ip = await checkIp();
  const biometricHost = ip || "localhost";
  const biometricPort = process.env.NEXT_PUBLIC_BIOMETRIC_PORT || 8899;
  const baseUrlBiometric = `http://${biometricHost}:${biometricPort}/api/`;
  const biometricFactory = new FetchServiceFactory(baseUrlBiometric);

  return biometricFactory.createAPIConnection();
};

const hostFrontend = process.env.NEXT_PUBLIC_SERVER_FRONTEND || "localhost";
const portFrontend = process.env.NEXT_PUBLIC_SERVER_PORT_FRONTEND || 3000;
const baseURlFrontend = `http://${hostFrontend}:${portFrontend}/api/`;
const factoryFrontend = new FetchServiceFactory(baseURlFrontend);

export const apiServerFrontend = factoryFrontend.createAPIConnection();
