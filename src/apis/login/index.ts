import Service from "@/apis";
import type {LoginParams} from './type.ts'

const loginApi = (params: LoginParams) => {
    return Service.post("/sign/signin", params);
}

export {
    loginApi
}