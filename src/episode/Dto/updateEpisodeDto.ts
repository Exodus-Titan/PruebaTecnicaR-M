import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class UpdateEpisodeDto{

    constructor(){}
    
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    air_date: string;

    @IsString()
    @IsNotEmpty()
    episode: string;

    @IsString()
    @IsNotEmpty()
    duration: string;

    @IsArray()
    @IsNotEmpty()
    characters: number[];
}