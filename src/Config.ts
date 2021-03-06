import * as fs from "fs"
import * as os from "os"
import * as _ from "lodash";

export interface IStoredKey {
  name: string;
  value: string;
}

export interface IConfig {
  pullzones: IStoredKey[];
  storages: IStoredKey[];
  [key: string]: IStoredKey[];
}

class _Config {
  static storePath = process.env["BNYCDN_HOMEFILE"] || (os.homedir() + "/.bunnycdn");

  private configuration: IConfig = {
    pullzones: [], // FIXME : Deprecated field since 0.3.0
    storages: [],
    apikey: []
  };

  // Typically loading configuration from the storage files
  public loadConfig() : IConfig {
    if (fs.existsSync(_Config.storePath)) {
      const fd = fs.openSync(_Config.storePath, 'r');
      const storeContent = fs.readFileSync(fd);
      this.configuration = JSON.parse(storeContent.toString());
      fs.closeSync(fd);
      // console.log("Loaded config : ", this.configuration);
    } else {
      this.persistConf();
    }
    return this.configuration
  }

  // Gets the local configuration loaded
  public getConf() : IConfig {
    // This is compatibility layer for < 0.3.0 when using config for first time in >= 0.3.0 versions
    if (!this.configuration["apikey"]) {
      this.configuration["apikey"] = this.configuration["pullzones"];
      this.persistConf();
    }

    return this.configuration
  }

  // This function will auto append unexisting keys and will replace existing keys
  public mergeToConf(objectToMerge: IStoredKey, type: string ) : void {
    this.configuration[type] = this.configuration[type].filter((e) => e.name !== objectToMerge.name);
    this.configuration[type].push(objectToMerge);
  }

  // Deletes a key and its values from the store
  public deleteKey(k: string, type: string = "apikey") : void {
    const maybeValue = this.get(k, type);
    if (!maybeValue) {
      console.error("There is no key " + k);
      return ;
    }

    this.configuration[type] = _.filter(this.configuration[type], (e) => e.name !== k);
    this.persistConf();
    console.log("ⓘSuccessfully deleted key : " + k);
  }

  public get(k: string, type: string): IStoredKey | undefined {
    return _.find(this.configuration[type], {'name': k})
  }

  public getApiKey(k: string, type: string = "apikey"): string | undefined {
    const maybeKey = this.get(k, type);
    if (!maybeKey)
      process.env["BNYCDN_CI"] || console.error("There is no key " + k);
    return (maybeKey && maybeKey.value) || (process.env["BNYCDN_CI"] && "mocked");
  }

  // This function persists the current state of the configuration into the configuration file
  public persistConf() : void {
    const fd = fs.openSync(_Config.storePath, 'a+');
    fs.ftruncateSync(fd);
    fs.writeFileSync(fd, JSON.stringify(this.configuration));
    fs.closeSync(fd);
  }
}

const i = new _Config();
export const Config = i;
