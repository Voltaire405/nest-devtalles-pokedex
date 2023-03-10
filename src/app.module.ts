import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';

import { CommonModule } from './common/common.module';
import { PokemonModule } from './pokemon/pokemon.module';
import { SeedModule } from './seed/seed.module';
import { AppConfiguration } from './config/app.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

//Es importante el orden en el que se especifica la importación del ConfigModule.forRoot()
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [AppConfiguration]
    }),
    PokemonModule,
    MongooseModule.forRoot( process.env.MONGODB ),
    ServeStaticModule.forRoot({
    rootPath: join(__dirname,'..','public'), }),
    CommonModule,
    SeedModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {

  constructor() {
    //Print enviroment variables
    console.log(process.env); 
  }

}
