import { IEncryptionPassword } from "nestia-fetcher";

export namespace Configuration {
    export const API_PORT = async () => 37001;
    export const ENCRYPTION_PASSWORD = async (): Promise<
        Readonly<IEncryptionPassword>
    > => ({
        key: "pJXhbHlYfzkC1CBK8R67faaBgJWB9Myu",
        iv: "IXJBt4MflFxvxKkn",
    });
}
