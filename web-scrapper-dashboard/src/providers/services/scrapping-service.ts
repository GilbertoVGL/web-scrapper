import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { take } from 'rxjs/operators';

@Injectable()
export class ScrappingServiceProvider {

	constructor(private httpClient: HttpClient) { }

	getRealtyPrices() {
		return new Promise((resolve, reject) => {
			const url = `${environment.apiUrl}/search/realty-prices`;
			console.log('url =>> ', url);
			this.httpClient.post(url, {}).pipe(take(1)).subscribe((res: any) => {
				console.log('res =>> ', res);
				resolve(res.data);
			});
		})
	}
}
