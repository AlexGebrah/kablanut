import type {ProjectType} from "./ProjectType.ts";
import type {UserType} from "./UserType.ts";

export type MaterialItem = {
    materialName: string;
    quantity: number;
    unit: string;
};

export type MaterialsType = {
    id: string,
    project: { id: ProjectType["id"] },
    user: {
        id: UserType["id"],
        fullName: UserType["fullName"],
    },
    items: MaterialItem[];
    "dateCreate": string,
    "status": "draft" | "active" | "done"
}

