import { Module } from '@nestjs/common';
import { AxiosAdapter as AxiosAdapter } from './adapters/axios/axios.adapter';

@Module({
  providers: [AxiosAdapter],
  exports: [AxiosAdapter]
})
export class CommonModule {}
