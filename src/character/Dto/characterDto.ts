import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class characterDto{

    constructor(id: number, name: string, species: string, origin: string, location: string, gender: string, state: string, episodes: number[]){
        this.id = id;
        this.name = name;
        this.species = species;
        this.origin = origin;
        this.location = location;
        this.gender = gender;
        this.state = state;
        this.episodes = episodes;
    }

    @IsNotEmpty()
    @IsNumber()
    id: number;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    species: string;

    @IsString()
    @IsNotEmpty()
    origin: string;

    @IsString()
    @IsNotEmpty()
    location: string;

    @IsString()
    @IsNotEmpty()
    gender: string;

    @IsString()
    @IsNotEmpty()
    state: string;

    @IsArray()
    @IsNotEmpty()
    episodes: number[];
}