import { Logger, ILogger } from "../utils/logger";
import axios from "axios";

// Import Config
import config from "../config/config";

export class OMBDService {
  private _logger: ILogger;
  private _config = config;

  constructor() {
    this._logger = new Logger(__filename);
  }

  public getByTitle = async (title: string) => {
    const BASE_OMDB_URL: string = `${this._config.ombd.apiUrl}/?t=${title}&apikey=${this._config.ombd.apiKey}`;
    this._logger.info(`Connected to ombd: ${BASE_OMDB_URL}`);

    return axios.get(BASE_OMDB_URL);
  };

  public renameJson = (json: any): any => {
    const result: any = {};

    Object.keys(json).forEach((key: string) => {
      const resultKey: string = this.isUpperCase(key.charAt(1))
        ? key.toLowerCase()
        : this.getFirstLetterToLowerCase(key);

      result[resultKey] = this.getTransform(json[key]);
    });

    return result;
  };

  private isUpperCase = (string: string): boolean => {
    return /^[A-Z]*$/.test(string);
  };

  private getTransform = (string: string): null | boolean | string => {
    if (string === "N/A") return null;
    if (string === "True") return true;
    if (string === "False") return false;

    return string;
  };

  private getFirstLetterToLowerCase = (string: string): string => {
    return string.charAt(0).toLowerCase() + string.slice(1);
  };
}
