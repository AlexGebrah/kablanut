import type {AddressType} from "./AddressType.ts";


export type UserType = {
    id: string
    fullName: {
        firstName: string
        lastName: string
    }
    birthDate: string
    address: AddressType,
    contacts: {
        telephone: string
        mail: string
    }
    company: string
    role: string
}