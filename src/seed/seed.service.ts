import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios, { AxiosInstance } from "axios";
import { Model } from 'mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { PokeResponse } from './interfaces/poke-response.interface';
import { CreatePokemonDto } from '../pokemon/dto/create-pokemon.dto';
import { AxiosAdapter } from 'src/common/adapters/axios/axios.adapter';

@Injectable()
export class SeedService {

  constructor(@InjectModel(Pokemon.name) private pokemonModel: Model<Pokemon>,
    private readonly requestAdapter: AxiosAdapter) { }

  private readonly axios: AxiosInstance = axios;

  async executeSeed() {
    await this.pokemonModel.deleteMany({});
    const { results } = await this.requestAdapter.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=600');

    const pokemonsToInsert: CreatePokemonDto[] = results.map(({ name, url }) => {
      const segments = url.split('/');
      const no = +segments[segments.length - 2];
      const pokemon: CreatePokemonDto = {
        no,
        name
      };
      return pokemon;
    }
    );

    await this.pokemonModel.create(pokemonsToInsert);

    return `Seed executed and ${pokemonsToInsert.length} pokemons has been inserted!`;
  }
}
