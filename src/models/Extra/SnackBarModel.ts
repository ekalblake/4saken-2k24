export default class SnackBarModel {
	private message: string;
	private success: boolean;
	private data: unknown;

	public constructor(data: INotification) {
		this.message = data.message;
		this.success = data.success;
		this.data = data.data;
	}

	public getMessage(): string {
		return this.message;
	}

	public getSuccess(): boolean {
		return this.success;
	}

	public getData(): any {
		return this.data;
	}

	setSnackbar(snackBarObject: INotification) {
		this.message = snackBarObject.message;
		this.success = snackBarObject.success;
		this.data = snackBarObject.data;
	}
}
