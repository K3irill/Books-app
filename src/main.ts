import 'reset-css'
import './styles/styles.scss'
import { Header } from './components/Header/Header.component'

import { Main } from './components/Main/Main.component'
import { Banner } from './components/Slider/Slider.component'
import { BooksWrapper } from './components/BooksWrapper/BooksWrapper.component'

const app = document.getElementById('app')

if (app) {
    const header = new Header()
    const main = new Main()
    const banner = new Banner()
    const booksWrapper = new BooksWrapper()
    header.appendTo(app)
    main.appendTo(app)
    banner.appendTo(main.element)
    booksWrapper.appendTo(main.element)
}
