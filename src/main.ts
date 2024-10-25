import 'reset-css'
import './styles/styles.scss'
import { Header } from './components/Header/Header.component'

import { Main } from './components/Main/Main.component'
import { Banner } from './components/Slider/Slider.component'

const app = document.getElementById('app')

if (app) {
    const header = new Header()
    const main = new Main()
    const banner = new Banner()
    header.appendTo(app)
    main.appendTo(app)
    banner.appendTo(main.element)
}
