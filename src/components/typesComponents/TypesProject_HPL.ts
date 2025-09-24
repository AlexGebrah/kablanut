import type { ProjectAddress } from "./TypeAddress";
import type { SpecificationItem } from "./TypeSpecificationItem";

export type ProjectKind = 'HPL' | 'Аллюминий' | 'Балкон';

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

// ВАЖНО: убираем " = ProjectKind", чтобы не было размывания типов
export type ProjectType<K extends ProjectKind> = {
    id: string;
    projectName: string;
    projectKind: K;
    projectDateStart: string;
    projectDateFinish: string;
    specificationPlan: SpecificationFor<K>;
    specificationFact: SpecificationFor<K>;
    projectAddress: ProjectAddress;
    projectStatus: string;
    customer: string;
    manufacturer: string;
    kablan: string[];
    designer: string;
    executor: string[];
    admin: string;
};
