import type {AddressType} from "./AddressType.ts";
import type { SpecificationItem } from "./SpecificationType.ts";
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


export type ProjectType = {
    id: string;
    projectName: string;
    projectKind: string;
    projectDateStart: string;
    projectDateFinish: string;
    specificationPlan: SpecificationItem[];
    specificationFact: SpecificationItem[];
    projectAddress: AddressType;
    projectStatus: string;
    customer: string;
    manufacturer: string;
    kablan: string[];
    designer: string;
    executor: string[];
    admin: string;
};
