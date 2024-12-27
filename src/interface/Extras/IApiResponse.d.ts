declare interface IApiResponse<T = unknown> {
	data: T;
	message: string;
	success: boolean;
}
