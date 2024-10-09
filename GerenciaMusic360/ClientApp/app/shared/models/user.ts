export interface IUser {
    birthdate: string;
    strBirthdate: Date;
    email: string;
    gender: string;
    id: number;
    lastName: string;
    name: string;
    password: string;
    phoneOne: string;
    pictureUrl: string;
    role: string;
    roleId: number;
    secondLastName: string;
    status: number
    userId: string;
    departmentId: number;
}

export interface ProjectUser extends IUser {
    projectRoleId?: number;
    projectId: number;
    rolName: string;
    memberProjectId?: number;
}

export interface IMarketingUser extends IUser {
    fullName: string;
}