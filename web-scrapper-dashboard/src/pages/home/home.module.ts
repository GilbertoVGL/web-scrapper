import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home';
import { FormsModule } from '@angular/forms';

export const homeModuleRoutes: Routes = [
	{
		path: '',
		component: HomeComponent
	}
];

@NgModule({
	declarations: [HomeComponent],
	imports: [
		RouterModule.forChild(homeModuleRoutes),
		CommonModule,
		FormsModule
	],
	exports: [HomeComponent]
})
export class HomeModule { }
