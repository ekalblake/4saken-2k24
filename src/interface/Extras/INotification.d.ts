declare interface INotification<T = unknown> {
	data: T;
	message: string;
	success: boolean;
}
