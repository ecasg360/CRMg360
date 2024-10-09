export interface SelectOption {
    value: any;
    viewValue: string;
}

export interface SelectOptionTranslate extends SelectOption {
    viewValueTranslate: string;
}

export interface ChartOptions {
    name: any,
    value: any,
}