export interface TextOptions {
    text: string;
    size: number;
    font: string;
    fill?: string;
    stroke?: string;
    style?: string;
    alignH?: "left" | "center" | "right";
    alignV?: "top" | "middle" | "bottom" | "alphabetic";
}