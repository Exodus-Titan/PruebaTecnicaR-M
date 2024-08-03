import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class SearchDto{
    @IsNotEmpty()
    @IsNumber()
    id: number;

    @IsNotEmpty()
    @IsString() 
    status: string;
}