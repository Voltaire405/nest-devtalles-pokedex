import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';

import { Pokemon } from './entities/pokemon.entity';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';

@Injectable()
export class PokemonService {

  private defaultLimit: number;

  constructor(@InjectModel(Pokemon.name) private pokemonModel: Model<Pokemon>,
    private readonly configService: ConfigService) {
    this.defaultLimit = this.configService.get<number>('defaultLimit');
  }

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();
    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      this.handleExceptions(error);
    }
    throw new Error("Error no identified!");

  }

  async findAll({ limit = this.defaultLimit, offset = 0 }: PaginationDto) {
    console.log(limit);
    console.log(offset);
    return await this.pokemonModel.find()
      .limit(limit)
      .skip(offset)
      .sort({ no: 1 })
      .select('-__v');
  }

  async findOne(term: string) {
    let pokemon: Pokemon;

    //es un no de pokemon
    if (!isNaN(Number(term))) {
      pokemon = await this.pokemonModel.findOne({ no: term });
    }

    // es un mongoid
    if (!pokemon && isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findOne({ _id: term });
    }
    //es un nombre de un pokemon
    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({ name: term.toLowerCase().trim() });
    }

    if (!pokemon) throw new NotFoundException(`We dont found any result for your key search '${term}'`);

    return pokemon;
  }

  async update(id: string, updatePokemonDto: UpdatePokemonDto) {

    const pokemon = await this.findOne(id);

    if (pokemon.name) pokemon.name = pokemon.name.toLowerCase().trim();

    try {
      await pokemon.updateOne(updatePokemonDto);
    } catch (error) {
      this.handleExceptions(error);
    }

    return { ...pokemon.toJSON(), ...updatePokemonDto };
  }

  async remove(_id: string) {
    //We guarantee that is valid mongo id because ParseMongoIdPipe is applied before
    // //  const pokemon : Pokemon = await this.findOne(id);
    // //    pokemon.deleteOne();
    //await this.pokemonModel.findByIdAndDelete(id);
    const result = await this.pokemonModel.deleteOne({ _id });
    if (result.deletedCount === 0) throw new NotFoundException(`Pokemon with id ${_id} doesnt exist!`);

  }

  handleExceptions(error: any) {
    if (this.objectAlreadyExist(error)) {
      throw new BadRequestException("Pokemon already exist!");
    }
    throw new InternalServerErrorException("Server Error, please, see logs for more info.");
  }

  objectAlreadyExist(errorThrowed): boolean {
    return errorThrowed.code == 11000;
  }
}
