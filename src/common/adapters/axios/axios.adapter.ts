import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { HttpRequest } from 'src/common/interfaces/http-request.interface';

@Injectable()
export class AxiosAdapter implements HttpRequest {

    private readonly axios: AxiosInstance = axios;

    async get<T>(url: string): Promise<T> {
        try {
            const { data } = await this.axios.get<T>(url);
            return data;
        } catch (error) {
            throw new Error('Request Failure');
        }
    }
}
