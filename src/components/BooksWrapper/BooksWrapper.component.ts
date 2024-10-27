import { parse, stringify } from 'querystring'
import './BooksWrapper.style.scss'
import template from './BooksWrapper.template.html'
interface VolumeInfo {
    title: string
    authors?: string[]
    description?: string
    imageLinks?: {
        thumbnail?: string
    }
    canonicalVolumeLink?: string
    averageRating?: number
    ratingsCount?: any
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
    private categories: NodeListOf<Element>
    private currentCategory: string
    private currentStartIndex: number
    private currentMaxResults: number
    private goodsBasket: string[]
    private goodsElement: Element | null
    constructor(goodsElement: Element | null) {
        this.element = document.createElement('div')
        this.element.classList.add('BooksWrapper')
        this.render()
        this.booksContainer = this.element.querySelector('.BooksWrapper__books')
        this.apiKey = process.env.API_URL
        this.categories = this.element.querySelectorAll('.bw-categories__item')
        this.currentCategory = 'Architecture'
        this.currentStartIndex = 0
        this.currentMaxResults = 6
        this.goodsBasket = []
        this.goodsElement = goodsElement

        console.log(localStorage.getItem('goodsId'))
        this.loadGoodFromLocalStorage()

        this.fetchToGoogleApi(
            this.currentCategory,
            this.currentStartIndex,
            this.currentMaxResults,
        ).then((books) => this.renderBookCards(books))
        this.selectCategory()
    }
    private selectCategory() {
        this.categories.forEach((category) => {
            category.addEventListener('click', () => {
                this.categories.forEach((cat) => {
                    cat.classList.remove('bw-categories__item--active')
                })
                category.classList.add('bw-categories__item--active')

                if (category.textContent) {
                    this.currentCategory = category.textContent
                }
                if (this.booksContainer) {
                    this.booksContainer.innerHTML = ''
                    this.currentStartIndex = 0
                    this.fetchToGoogleApi(
                        this.currentCategory,
                        this.currentStartIndex,
                        this.currentMaxResults,
                    ).then((books) => this.renderBookCards(books))
                }
            })
        })
    }

    private async fetchToGoogleApi(
        category: string,
        startIndex: number,
        maxResults: number,
    ): Promise<BookItem[]> {
        const googleApiUrl = `https://www.googleapis.com/books/v1/volumes?q="subject:${category.trim()}"&key=${this.apiKey}&printType=books&startIndex=${startIndex}&maxResults=${maxResults}&langRestrict=en`

        const request = await fetch(googleApiUrl)
        const response: GoogleApiResponse = await request.json()
        console.log(response)

        this.lazyLoadBook(this.currentCategory)
        return response.items
    }

    private async createBookCards(book: BookItem, index: number) {
        const bookContainer = document.createElement('div')
        bookContainer.classList.add('book')
        bookContainer.dataset.id = book.id

        const bookPosterContainer = document.createElement('div')
        bookPosterContainer.classList.add('book__img-container')

        const bookPoster = document.createElement('img')
        bookPoster.classList.add('book__img')
        bookPoster.src =
            book.volumeInfo.imageLinks?.thumbnail ||
            '/assets/images/img-placeholder.jpg'
        bookPosterContainer.append(bookPoster)

        const bookContent = document.createElement('div')
        bookContent.classList.add('book__content')

        const bookAuthor = document.createElement('h3')
        bookAuthor.classList.add('book__author')
        bookAuthor.textContent =
            book.volumeInfo.authors?.map((author) => author).join(', ') ||
            'Неизвестный автор'

        const bookTitle = document.createElement('h2')
        bookTitle.classList.add('book__title')
        bookTitle.textContent = book.volumeInfo.title

        const rating = book.volumeInfo.averageRating

        const bookRatesContainer = document.createElement('div')
        bookRatesContainer.classList.add('book__rates-container')

        const bookRatesStar = document.createElement('div')
        bookRatesStar.classList.add('book__rates-stars')

        const bookRatesFillStar = document.createElement('div')
        bookRatesFillStar.classList.add('book__fill-stars')
        if (rating) {
            const fillPercentage = (rating / 5) * 100
            bookRatesFillStar.style.width = `${fillPercentage}%`
        } else {
            bookRatesContainer.style.display = 'none'
        }

        const bookRatesCount = document.createElement('p')
        bookRatesCount.classList.add('book__review-count')
        bookRatesCount.textContent = `${book.volumeInfo.ratingsCount} review`

        bookRatesStar.append(bookRatesFillStar)
        bookRatesContainer.append(bookRatesStar)
        bookRatesContainer.append(bookRatesCount)

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

        const bookBuyLink = document.createElement('button')
        bookBuyLink.classList.add('book__buy-link')
        bookBuyLink.addEventListener('click', () => {
            if (!this.goodsBasket.includes(book.id)) {
                this.goodsBasket.push(book.id)
            } else {
                this.goodsBasket = this.goodsBasket.filter(
                    (id) => id !== book.id,
                )
            }

            this.updateGoodsCount(
                bookContainer.getAttribute('data-id'),
                bookBuyLink,
            )
        })

        if (
            this.goodsBasket.includes(
                String(bookContainer.getAttribute('data-id')),
            )
        ) {
            bookBuyLink.classList.add('in-basket')
            bookBuyLink.textContent = 'IN THE CART'
        } else {
            bookBuyLink.classList.remove('in-basket')
            bookBuyLink.textContent = 'BUY NOW'
        }

        this.appendMultiply(bookContainer, [bookPosterContainer, bookContent])
        this.appendMultiply(bookContent, [
            bookAuthor,
            bookTitle,
            bookRatesContainer,
            bookDescription,
            bookPrice,
            bookBuyLink,
        ])
        bookContainer.addEventListener('click', (event) => {
            event.preventDefault()
            if (
                book.volumeInfo.canonicalVolumeLink &&
                event.target !== bookBuyLink
            ) {
                window.open(book.volumeInfo.canonicalVolumeLink, '_blank')
            }
        })
        this.booksContainer?.append(bookContainer)
    }
    private updateGoodsCount(bookId: string | null, btn: Element) {
        if (this.goodsElement) {
            this.goodsElement.textContent = String(this.goodsBasket.length)
        }
        if (bookId && btn) {
            if (this.goodsBasket.includes(bookId)) {
                btn.classList.add('in-basket')
                btn.textContent = 'IN THE CART'
                localStorage.setItem(
                    'goodsId',
                    JSON.stringify(this.goodsBasket),
                )
            } else {
                btn.classList.remove('in-basket')
                btn.textContent = 'BUY NOW'
                this.deleteBookFromLocalStorage(bookId)
            }
        }
    }
    private renderBookCards(arrCards: BookItem[]) {
        arrCards.forEach((card, index) => this.createBookCards(card, index))
    }

    private lazyLoadBook(category: string) {
        const booksWrapCont = this.element.querySelector(
            '.BooksWrapper__books-wrap',
        )
        let loadButton = booksWrapCont?.querySelector(
            '.BooksWrapper__load-button',
        )
        if (!loadButton) {
            loadButton = document.createElement('button')
            loadButton.classList.add('BooksWrapper__load-button')
            loadButton.textContent = 'Load more'

            loadButton.addEventListener('click', () => {
                this.currentStartIndex += 6
                this.currentMaxResults = 6
                this.fetchToGoogleApi(
                    this.currentCategory,
                    this.currentStartIndex,
                    this.currentMaxResults,
                ).then((books) => {
                    this.renderBookCards(books)
                })
            })
            booksWrapCont?.append(loadButton)
        }
    }

    private appendMultiply(parent: HTMLElement, elements: HTMLElement[]) {
        elements.forEach((element) => parent.append(element))
    }
    private loadGoodFromLocalStorage() {
        if (localStorage.getItem('goodsId') !== null) {
            let savedGoods = localStorage.getItem('goodsId')
            if (savedGoods) {
                const parsedGoods: string[] = JSON.parse(savedGoods)
                if (localStorage.getItem('goodsId')?.length !== 0) {
                    parsedGoods.forEach((id) => this.goodsBasket.push(id))
                }
                if (this.goodsElement) {
                    this.goodsElement.textContent = String(
                        this.goodsBasket.length,
                    )
                }
            }
        }
    }
    private deleteBookFromLocalStorage(bookId: string) {
        if (localStorage.getItem('goodsId') !== null) {
            let savedGoods = localStorage.getItem('goodsId')
            if (savedGoods) {
                let parsedGoods: string[] = JSON.parse(savedGoods)
                parsedGoods = parsedGoods.filter((good) => good !== bookId)
                localStorage.setItem('goodsId', JSON.stringify(parsedGoods))
            }
        }
    }
    private render() {
        this.element.innerHTML = template
    }
    public appendTo(parent: HTMLElement) {
        parent.appendChild(this.element)
    }
}
