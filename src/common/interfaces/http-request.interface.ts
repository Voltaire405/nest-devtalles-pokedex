export interface HttpRequest {
    get<T>(url : string) : Promise<T>;
}