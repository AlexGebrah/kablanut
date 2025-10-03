import type {AddressType} from "./AddressType.ts";
import type { SpecificationType } from "./SpecificationType.ts";


export type ProjectType = {
    id: string;
    projectName: string;
    projectKind: string;
    projectDateStart: string;
    projectDateFinish: string;
    specificationPlan: SpecificationType[];
    specificationFact: SpecificationType[];
    projectAddress: AddressType;
    projectStatus: string;
    customer: string;
    manufacturer: string;
    kablan: string[];
    designer: string;
    executor: string[];
    admin: string;
};
