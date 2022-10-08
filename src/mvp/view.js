'use strict';


export class View {
	#presenter = null
	#leftSide
	#form
	#carObject
	#carUploadObject

	constructor( presenter ) {
		console.log( " --- VIEW INIT --- " );
		this.#presenter = presenter
		this.#carObject = {}
		this.#carUploadObject = {}

		// file upload block
		this.fileImage = document.querySelector( '.file_image' );
		this.formUpload = document.querySelector( '.file_upload' );

		this.#leftSide = document.querySelector( '.left_side' );

		// lest side hide
		this.#form = document.forms[ 0 ]
		this.closeBtn = document.querySelector( '.close_btn' )
		this.left_side = document.querySelector( '.left_side' );
		this.right_side = document.querySelector( '.right_side' );
		this.flag = true

		// left side tabs
		this.tabs = Array.from( document.querySelectorAll( '.tabs li' ) );
		this.divs = Array.from( document.querySelectorAll( '.controls_content > div' ) );

		// FIND FORM  control get data
		this.selectBrand = this.#form[ 0 ]
		this.selectModel = this.#form[ 1 ]
		this.selectYear = this.#form[ 2 ]
		this.selectPrice = this.#form[ 3 ]
		this.newCar = this.#form[ 4 ]
		this.usedCar = this.#form[ 5 ]
		this.submitBtn = this.#form[ 6 ]


		// UPLOAD FORM
		this.uploadBrand = this.formUpload[ 0 ]
		this.uploadModel = this.formUpload[ 1 ]
		this.uploadYear = this.formUpload[ 2 ]

		this.eventInit()
	}

	eventInit() {
		window.addEventListener( 'DOMContentLoaded', this.initRightSideHandler.bind( this ) )
		this.closeBtn.addEventListener( 'click', this.closeBtnHandler.bind( this ) )

		// upload form
		this.formUpload[ 'form_image_send' ].addEventListener( 'click', this.formImageHandler.bind( this ) )
		this.uploadBrand.addEventListener('change', this.uploadBrandHandler.bind(this))
		this.uploadModel.addEventListener('change', this.uploadModelHandler.bind(this))
		this.uploadYear.addEventListener('change', this.uploadYearHandler.bind(this))

		// find form
		this.selectBrand.addEventListener( 'change', this.selectBrandHandler.bind( this ) )
		this.selectModel.addEventListener( 'change', this.selectModelHandler.bind( this ) )
		this.selectYear.addEventListener( 'change', this.selectYearHandler.bind( this ) )
		this.selectPrice.addEventListener( 'change', this.selectPriceHandler.bind( this ) )
		this.newCar.addEventListener( 'change', this.selectNewCarHandler.bind( this ) )
		this.usedCar.addEventListener( 'change', this.selectUsedCarHandler.bind( this ) )
		this.submitBtn.addEventListener( 'click', this.submitBtnHandler.bind( this ) )
		// call tabs logic
		this.tabsHandler()
	}

	uploadBrandHandler({target}){
		const idx = target.value
		const uploadBrandText = target.options[ idx - 1 ].text

		this.#carUploadObject.brand = uploadBrandText
	}
	uploadModelHandler({target}){
		const idx = target.value
		const uploadModelText = target.options[ idx - 1 ].text
		this.#carUploadObject.model = uploadModelText

	}
	uploadYearHandler({target}){
		const idx = target.value
		const uploadYearText = target.options[ idx - 1 ].text
		this.#carUploadObject.year = uploadYearText
	}


	initRightSideHandler( e ) {
		const cars = JSON.parse( localStorage.getItem( 'cars' ) )

		if ( !Array.isArray( cars ) ) return


		this.#presenter.getCarsFromView( cars )
		this.createCarsCard( cars )
	}

	formImageHandler( e ) {
		e.preventDefault()

		const reader = new FileReader()


		const price = this.formUpload[ 3 ]
		const miles = this.formUpload[ 'file_miles' ]
		const newCar = this.formUpload[ 'file_newCar' ]


		if ( !this.fileImage.files[ 0 ] ) {
			return
		}


		reader.addEventListener( 'load', () => {
			const fileSrc = reader.result

			const car = {
				brand: this.#carUploadObject.brand,
				model: this.#carUploadObject.model,
				year: this.#carUploadObject.year,
				price: price.value,
				miles: miles.value,
				imageUrl: fileSrc
			}
			console.log('CAR UPLOAD ', car);

			newCar.value === 'new' ? car.newCar = true : car.newCar = false

			console.log( car );
			this.#presenter.getCarFromView( car )
		} )

		reader.readAsDataURL( this.fileImage.files[ 0 ] )
	}

	// DEPRECATED
	fileLoaderHandler( e ) {
		e.preventDefault()

		const reader = new FileReader()

		reader.addEventListener( 'load', () => {
			const fileSrc = reader.result
			const img = document.createElement( 'img' )
			img.classList.add( 'imgSrc' )
			img.src = fileSrc.toString()
			console.log( img.src );
			this.right_side.append( img )
		} )

		reader.readAsDataURL( this.fileImage.files[ 0 ] )

	}

	selectBrandHandler( { target } ) {
		// console.log(target.value);
		const idx = target.value
		const brandText = target.options[ idx -1 ].text
		this.#carObject.brand = brandText.toLowerCase()

		this.selectFillModels( this.#carObject.brand )
	}

	selectFillModels( brand ) {
		const models = document.querySelector( '.auto_model_select' );

		if ( brand === 'bmw' ) {
			this.bmwFillModel(models)
		} else if ( brand === 'mercedes-benz' ) {
				this.mersFillModel(models)
		}
	}

	bmwFillModel(models) {
		const bmwModels = [ '', '5 Series', '7 Series' ]
		models.innerHTML = ''
		for ( let i = 0; i < bmwModels.length; i++ ) {
			const opt = document.createElement( 'option' );
			opt.value = i
			opt.innerHTML = bmwModels[ i ];
			models.appendChild( opt );
		}
	}

	mersFillModel(models){
		const mersModels = ['', 'E Class', 'S Class' ]
		models.innerHTML = ''
		for ( let i = 0; i < mersModels.length; i++ ) {
			const opt = document.createElement( 'option' );
			opt.value = i
			opt.innerHTML = mersModels[ i ];
			models.appendChild( opt );
		}
	}

	selectModelHandler( { target } ) {
		const idx = target.value
		const modelText = target.options[ idx ].text
		console.log(modelText);
		this.#carObject.model = modelText
	}

	selectYearHandler( { target } ) {
		const idx = target.value
		const yearText = target.options[ idx - 1 ].text
		this.#carObject.year = +yearText

	}

	selectPriceHandler( { target } ) {
		const idx = target.value
		const priceText = target.options[ idx - 1 ].text
		this.#carObject.price = +priceText
	}

	selectNewCarHandler( { target } ) {
		if ( target.value === 'new' ) {
			this.#carObject.newCar = true
		}
	}

	selectUsedCarHandler( { target } ) {
		if ( target.value === 'used' ) {
			this.#carObject.newCar = false
		}
	}

	closeBtnHandler( e ) {
		if ( this.flag ) {
			this.left_side.style.width = '0'
			this.right_side.style.width = `${ 100 }%`

			Array.from( this.left_side.children ).forEach( item => {
				item.style.display = 'none'
			} )

			this.closeBtn.style.display = 'block'
			this.flag = false
		} else {
			Array.from( this.left_side.children ).forEach( item => {
				item.style.display = 'block'
			} )
			this.left_side.style.width = '30%'
			this.right_side.style.width = `70%`
			this.flag = true
		}
	}

	async submitBtnHandler( e ) {
		e.preventDefault()

		console.log( ' --- submitBtnHandler ---', this.#carObject );

		await this.#presenter.filterCars( this.#carObject )
	}

	tabsHandler( e ) {
		this.tabs.forEach( tab => {
			tab.addEventListener( 'click', e => {
				// console.log(tab);
				this.tabs.forEach( tab => tab.classList.remove( 'active' ) )
				e.target.classList.add( 'active' )

				//
				this.divs.forEach( div => div.style.display = 'none' )
				//
				document.querySelector( e.target.dataset.tab ).style.display = 'block'
			} )
		} )
	}

	getFromPresenter( cars ) {
		console.log( cars );

		this.createCarsCard( cars )
	}

	createCarsCard( cars = [] ) {
		const cardr = []

		if ( Array.isArray( cars ) ) {

			cars.forEach( car => {
				const card = this.cardTemplate( car )
				cardr.push( card )
			} )

			this.render( cardr )
		} else {
			console.log( "метод createCarsCard должен принимать только массивы" );
		}
	}

	cardTemplate( car ) {
		// console.log(car);
		const card = document.createElement( 'div' )
		card.classList.add( 'card' )

		const card_block_image = document.createElement( 'div' )
		card_block_image.classList.add( 'card_block_image' )

		const card_img_wrap = document.createElement( 'div' )
		card_img_wrap.classList.add( 'card_img_wrap' )

		const card__image = document.createElement( 'img' )
		card__image.classList.add( 'card__image' )


		const card_block_main_info = document.createElement( 'div' )
		card_block_main_info.classList.add( 'card_block_main_info' )

		const card__title = document.createElement( 'p' )
		card__title.classList.add( 'card__title' )

		const card__model = document.createElement( 'p' )
		card__model.classList.add( 'card__model' )

		const card__year = document.createElement( 'p' )
		card__year.classList.add( 'card__year' )

		const card__price = document.createElement( 'p' )
		card__price.classList.add( 'card__price' )


		const card_block_secondary_info = document.createElement( 'div' )
		card_block_secondary_info.classList.add( 'card_block_secondary_info' )

		const card__used = document.createElement( 'p' )
		card__used.classList.add( 'card__used' )

		const card__id = document.createElement( 'p' )
		card__id.classList.add( 'card__id' )

		const card__miles = document.createElement( 'p' )
		card__miles.classList.add( 'card__miles' )

		card_img_wrap.append( card__image )
		card_block_image.append( card_img_wrap )

		card_block_main_info.append( card__title )
		card_block_main_info.append( card__model )
		card_block_main_info.append( card__year )
		card_block_main_info.append( card__price )

		card_block_secondary_info.append( card__used )
		card_block_secondary_info.append( card__id )
		card_block_secondary_info.append( card__miles )

		card.append( card_block_image )
		card.append( card_block_main_info )
		card.append( card_block_secondary_info )

		card__image.src = car.imageUrl

		card__title.textContent = car.brand
		card__model.textContent = car.model
		card__year.textContent = car.year
		card__price.textContent = `${ car.price } $`

		card__used.textContent = car.newCar ? 'new' : 'used'
		card__id.textContent = `id ${ car.id }`
		card__miles.textContent = `miles ${ car.miles }`

		return card
	}

	render( cards ) {
		this.clear()

		cards.forEach( car => this.right_side.append( car ) )

	}

	clear() {
		this.right_side.innerHTML = ''
	}
}


