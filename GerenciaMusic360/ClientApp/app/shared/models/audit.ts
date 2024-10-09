export interface Audit {
	Created?: string | Date;
	Creator?: string;
	Modified?: string | Date;
	Modifier?: string;
	Erased?: string | Date;
	Eraser?: string;
	EntityId?: number;
}