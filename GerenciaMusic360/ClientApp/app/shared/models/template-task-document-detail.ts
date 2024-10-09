export interface TemplateTaskDocumentDetail {
    id: number,
    name: string,
    templateTaskDocumentId: number,
    required: boolean,
    position: number,
    usersAuthorize: number[],
    estimatedDateVerficationString: string,
    isPermanent: boolean,
    projectId: number,
    entityId: number,
}
