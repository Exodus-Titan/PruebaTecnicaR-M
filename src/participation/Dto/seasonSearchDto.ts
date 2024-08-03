import { IsNotEmpty, IsString } from "class-validator";

export class SeasonSearchDto{
    @IsNotEmpty()
    @IsString()
    season: string;

    @IsNotEmpty()
    @IsString() 
    status: string;
}