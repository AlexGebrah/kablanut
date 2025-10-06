import type { ProjectType} from "./ProjectType.ts";
import type {UserType} from "./UserType.ts";

export type AlarmType =
    {
        id: string,
        project: {
            id: ProjectType["id"],
            projectName: ProjectType["projectName"],
        },
        user: { id: UserType["id"],
            fullName: UserType["fullName"],
        },
        dateCreate: string,
        status: "draft" | "active" | "done",
        title: "umit" | "no ready" | "no material" | "other",
        description: string,
    }
