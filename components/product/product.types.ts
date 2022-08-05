export interface ProductType {
    images: string[];
    productName: string;
    productNumber: string;
    description: string;
    stockState: string;
    prise: string;
}
export interface Translations {
    productNumberLabel: string;
    compareLabel: string;
    stockLabel: string;
    sizesLabel: string;
    cartButtonLabel: string;
    sizeButtonLabel: string;
    specificationButtonLabel: string;
    geometryButtonLabel: string;
    technologyButtonLabel: string;
    moreTextButtonLabel: string;
    lessTextButton: string;
}

export type ZoomPosition = { top: number; left: number } | Directions;

export type Directions = "right" | "left";

export type ShowElementType = "true" | "false";
