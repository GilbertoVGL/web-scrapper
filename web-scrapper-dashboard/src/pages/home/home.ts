import { Component, OnInit } from '@angular/core';
import { ScrappingServiceProvider } from '../../providers/services/scrapping-service';

@Component({
	selector: 'app-home',
	templateUrl: './home.html',
	styleUrls: ['./home.scss']
})
export class HomeComponent implements OnInit {

	typeOfSearch: string;
	scraps: Array<any>;
	gotImageRubbish: boolean = true;
	gotPriceRubbish: boolean = true;

	constructor(private scrappingService: ScrappingServiceProvider) {
		this.scrappingService.getRealtyPrices().then((scraps: Array<any>) => {
			this.scraps = scraps;
		});
	}

	ngOnInit(): void {
		console.log('Oh crap')
	}

	getRubbish() {
		this.scrappingService.getRealtyPrices().then((scraps: Array<any>) => {
			this.scraps = scraps;
		});
	}
}
