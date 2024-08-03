import { IsNotEmpty, IsNumber } from "class-validator";

export class IdDto{
    @IsNotEmpty()
    @IsNumber()
    charId: number;

    @IsNotEmpty()
    @IsNumber()
    epId: number;
}