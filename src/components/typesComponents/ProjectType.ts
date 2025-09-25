import type {AddressType} from "./AddressType.ts";
import type { SpecificationItem } from "./TypeSpecificationItem";
import {
    PROJECT_KIND_HPL,
    PROJECT_KIND_ALUMINIUM,
    PROJECT_KIND_BALCON,
} from "../../constants/TypeConstants.ts";

// Берём типы из значений констант
export type ProjectKind =
    | typeof PROJECT_KIND_HPL
    | typeof PROJECT_KIND_ALUMINIUM
    | typeof PROJECT_KIND_BALCON;

export type SpecificationFor<K extends ProjectKind> =
    K extends 'HPL' ? {
            structures: SpecificationItem[];
            panels: SpecificationItem[];
            glif: SpecificationItem[];
        } :
        K extends 'Аллюминий' ? {
                panels: SpecificationItem[];
                glif: SpecificationItem[];
            } :
            K extends 'Балкон' ? {
                pillars: SpecificationItem[];
                aluminium: SpecificationItem[];
                ushka: SpecificationItem[];
                glass: SpecificationItem[];
            } : never;


export type ProjectType<K extends ProjectKind> = {
    id: string;
    projectName: string;
    projectKind: K;
    projectDateStart: string;
    projectDateFinish: string;
    specificationPlan: SpecificationFor<K>;
    specificationFact: SpecificationFor<K>;
    projectAddress: AddressType;
    projectStatus: string;
    customer: string;
    manufacturer: string;
    kablan: string[];
    designer: string;
    executor: string[];
    admin: string;
};
