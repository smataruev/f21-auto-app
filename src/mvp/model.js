'use strict';

export class Model {
	#cars = []

	constructor() {
		console.log( " --- MODEL INIT --- " );
		this.#cars = []

		// console.log(this.#cars);
	}

	getCarsLength() {
		if ( this.#cars.length === 0 ) {
			console.log('here');
			return 1
		}
		console.log('here 2');
		return this.#cars.length+1
	}

	get cars() {
		return this.#cars
	}


	set cars( val ) {
		this.#cars.push( val )
		this.setToLocalStorage( this.#cars )
	}

	setCarsToArrayCars(cars) {
		this.#cars = cars
	}
	setToLocalStorage( cars ) {
		localStorage.setItem( 'cars', JSON.stringify( cars ) )
	}
}
