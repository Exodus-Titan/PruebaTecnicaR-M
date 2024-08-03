import { IsArray, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class EpisodeDto{

    constructor(id: number, name: string, air_date: string, episode: string, duration: string, characters: number[]){
        this.id = id;
        this.name = name;
        this.air_date = air_date;
        this.episode = episode;
        this.duration = duration;
        this.characters = characters;
    }

    @IsNotEmpty()
    @IsNumber()
    id: number;

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