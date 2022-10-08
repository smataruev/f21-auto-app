'use strict';
import moment from 'moment'

export class Presenter {
	#view = null
	#model = null

	constructor() {
		console.log( " --- PRESENTER INIT --- " );
	}

	init( view, model ) {
		this.#view = view
		this.#model = model

		// this.#model.getFromLocalStorage()
	}

	async fetchCars() {
		const cars = await this.#model.cars
		// console.log( cars );

		// send to view, array needed
		await this.sendToView( cars )
	}

	async sendToView( cars ) {
		await this.#view.getFromPresenter( cars )
	}

	async filterCars( car ) {
		const cars = this.#model.cars.filter( mCar => {
			console.log('car  input ', car);
			console.log('car local ', mCar);

			if ( mCar.brand.toLowerCase() === car.brand.toLowerCase()  &&
				mCar.model.toLowerCase()  === car.model.toLowerCase()  &&
				mCar.price === car.price &&
				mCar.year === car.year &&
				mCar.newCar === car.newCar
			) {
				return true
			}
		} )
		this.#view.getFromPresenter( cars )
	}

	async getCarFromView( car ) {

		car.brand = this.normalizeStr(car.brand)
		car.model = this.normalizeStr(car.model)
		car.price = this.validateNumbers(car.price)
		car.miles = this.validateNumbers(car.miles)
		car.year = this.validateNumbers(car.year)
		car.id = this.generateID()
		car.post_date = this.generateDate()

		this.#model.cars = car
		this.fetchCars()
	}

	async getCarsFromView(cars) {
		this.#model.setCarsToArrayCars(cars)
	}
	// DONE
	generateID() {
		// console.log(this.#model.cars.length);
		return this.#model.getCarsLength()
		// return Math.floor((Math.random() * 945564999931) + (Math.random() * 4556765499999931))
	}

	// DONE
	generateDate() {

		let myLocale = 1
		const month = ( moment().month() + myLocale ).toString().length < 2 ? '0' + ( moment().month() + myLocale ) : moment().month() + myLocale
		const day = ( moment().date()).toString().length < 2 ? '0' + moment().date() : moment().date()

		return `${ day }.${ month }.${ moment().year() }`
	}

	// DONE
	validateNumbers( val ) {
		const pattern = /^[0-9]+$/;

		if ( pattern.test( val ) ) {
			return +val
		}
		throw new Error("Not valid data")
	}

	// DONE
	normalizeStr(str) {
		// Приведение к нижнему регистру и удалению пробелов
		return str.trim().toLowerCase()
	}
}

