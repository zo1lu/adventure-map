namespace NodeJS {
    interface ProcessEnv {
        BUCKET_NAME:string
        BUCKET_REGION:string
        ACCESS_KEY:string
        SECRET_ACCESS_KEY:string
    }
    interface FormDataValue {
        id:string,
        type:string,
        image:ArrayBuffer
    }
    interface FormData {
        append(name: string, value: FormDataValue, fileName?: string): void;
        set(name: string, value: FormDataValue, fileName?: string): void;
      }
  }