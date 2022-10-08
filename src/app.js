import './index.scss'
import { Model } from './mvp/model'
import { Presenter } from './mvp/presenter'
import { View } from './mvp/view'

import cars from './mvp/cars.json'

const model = new Model(  )
const presenter = new Presenter()
const view = new View( presenter )

presenter.init( view, model )

// inner left controls
// brand
// year
// title
// price


// car card
// title
// description
// image
// price
// year
// mileage


