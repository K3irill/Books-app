import { title } from 'process'
import './BooksWrapper.style.scss'
import template from './BooksWrapper.template.html'
import { join } from 'path'

interface VolumeInfo {
    title: string
    authors?: string[]
    description?: string
    imageLinks?: {
        thumbnail?: string
    }
    canonicalVolumeLink?: string
    averageRating?: number
}

interface SaleInfo {
    retailPrice?: {
        amount: number
        currencyCode: string
    }
}

interface BookItem {
    id: string
    selfLink: string
    volumeInfo: VolumeInfo
    saleInfo: SaleInfo
}

interface GoogleApiResponse {
    items: BookItem[]
}

export class BooksWrapper {
    private element: HTMLElement
    private apiKey: string | undefined
    private booksContainer
    constructor() {
        this.element = document.createElement('div')
        this.element.classList.add('BooksWrapper')
        this.render()
        this.booksContainer = this.element.querySelector('.BooksWrapper__books')
        this.apiKey = process.env.API_URL

        this.fetchToGoogleApi().then((books) => this.renderBookCards(books))
    }
    private async fetchToGoogleApi(): Promise<BookItem[]> {
        let startIndex = 0
        let maxResults = 6
        const googleApiUrl = `https://www.googleapis.com/books/v1/volumes?q="subject:Business"&key=${this.apiKey}&printType=books&startIndex=${startIndex}&maxResults=${maxResults}&langRestrict=en`

        const request = await fetch(googleApiUrl)
        const response: GoogleApiResponse = await request.json()
        console.log(response.items)
        return response.items
    }

    private async createBookCards(book: BookItem, index: number) {
        const bookContainer = document.createElement('div')
        bookContainer.classList.add('book')

        const bookPosterContainer = document.createElement('div')
        bookPosterContainer.classList.add('book__img-container')

        const bookPoster = document.createElement('img')
        bookPoster.classList.add('book__img')
        bookPoster.src =
            book.volumeInfo.imageLinks?.thumbnail ||
            '/public/assets/images/img-placeholder.jpg'
        bookPosterContainer.append(bookPoster)

        const bookContent = document.createElement('div')
        bookContent.classList.add('book__content')

        const bookAuthor = document.createElement('h3')
        bookAuthor.classList.add('book__author')
        bookAuthor.textContent = book.volumeInfo.authors
            ? book.volumeInfo.authors[0]
            : 'Неизвестный автор'

        const bookTitle = document.createElement('h2')
        bookTitle.classList.add('book__title')
        bookTitle.textContent = book.volumeInfo.title

        const bookRatesContainer = document.createElement('div')
        bookRatesContainer.classList.add('book__rates-container')

        const bookRatesStar = document.createElement('div')
        bookRatesStar.classList.add('book__rates-stars')
        bookRatesContainer.append(bookRatesStar)
        const bookRatesFillStar = document.createElement('div')
        bookRatesFillStar.classList.add('book__fill-stars')
        const rating = book.volumeInfo.averageRating
        if (rating) {
            const fillPercentage = (rating / 5) * 100
            bookRatesFillStar.style.width = `${fillPercentage}%`
        }

        bookRatesStar.append(bookRatesFillStar)

        const bookDescription = document.createElement('p')
        bookDescription.classList.add('book__description')
        bookDescription.textContent = book.volumeInfo.description
            ? book.volumeInfo.description.split(' ').length >= 17
                ? book.volumeInfo.description
                      .split(' ')
                      .slice(0, 17)
                      .join(' ') + '...'
                : book.volumeInfo.description
            : 'Описание отсутствует'

        const bookPrice = document.createElement('p')
        bookPrice.classList.add('book__price')
        bookPrice.textContent = book.saleInfo.retailPrice
            ? `${book.saleInfo.retailPrice.amount} ${book.saleInfo.retailPrice.currencyCode}`
            : 'Цена не указана'

        const bookBuyLink = document.createElement('a')
        bookBuyLink.classList.add('book__buy-link')
        bookBuyLink.setAttribute(
            'href',
            book.volumeInfo.canonicalVolumeLink || '#',
        )
        bookBuyLink.textContent = 'BUY NOW'

        this.appendMultiply(bookContainer, [bookPosterContainer, bookContent])
        this.appendMultiply(bookContent, [
            bookAuthor,
            bookTitle,
            bookRatesContainer,
            bookDescription,
            bookPrice,
            bookBuyLink,
        ])

        this.booksContainer?.append(bookContainer)
    }
    private renderBookCards(arrCards: BookItem[]) {
        arrCards.forEach((card, index) => this.createBookCards(card, index))
    }

    private async lazyLoadBook() {}

    private appendMultiply(parent: HTMLElement, elements: HTMLElement[]) {
        elements.forEach((element) => parent.append(element))
    }

    private render() {
        this.element.innerHTML = template
    }

    public appendTo(parent: HTMLElement) {
        parent.appendChild(this.element)
    }
}
