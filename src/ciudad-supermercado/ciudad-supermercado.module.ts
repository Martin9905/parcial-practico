import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CiudadSupermercadoService } from './ciudad-supermercado.service';
import { CiudadEntity } from 'src/ciudad/ciudad.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CiudadEntity])],
  providers: [CiudadSupermercadoService]
})
export class CiudadSupermercadoModule {}
