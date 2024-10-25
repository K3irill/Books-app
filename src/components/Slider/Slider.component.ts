import { error, log } from 'console'
import './Slider.style.scss'
import template from './Slider.template.html'

export class Banner {
    private element: HTMLElement
    private IMAGES: { _title: string; _url: string }[]
    private currentIndex: number

    constructor() {
        this.element = document.createElement('div')
        this.element.classList.add('banner')
        this.IMAGES = []
        this.currentIndex = 0

        this.addImageToSlider(
            'Black Friday',
            '/assets/images/Slider/banner1.png',
        )
        this.addImageToSlider(
            'Top 10 Books',
            '/assets/images/Slider/banner2.png',
        )
        this.addImageToSlider('Cozy Books', '/assets/images/Slider/banner3.png')

        this.render()
        this.renderImages()
        this.init()
    }

    private addImageToSlider(title: string, url: string): void {
        this.IMAGES.push({ _title: title, _url: url })
    }

    private init() {
        const carousel = this.element.querySelector(
            '.banner__slider',
        ) as HTMLElement
        const dots = this.element.querySelectorAll(
            '.dot',
        ) as NodeListOf<HTMLElement>
        const slideCount = dots.length
        let activeIndex = 0

        if (!carousel || !dots.length) {
            console.error('Carousel or dots not found!')
            return
        }

        const setActiveIndex = (index: number) => {
            dots.forEach((dot) => dot.classList.remove('active'))
            dots[index].classList.add('active')
            carousel.style.setProperty('--active-index', `${index}`)
            this.currentIndex = index
        }

        const scrollToSlide = (index: number) => {
            const sliderList = this.element.querySelector(
                '.banner__list',
            ) as HTMLElement
            if (sliderList) {
                sliderList.style.transform = `translateX(-${index * 100}%)`
            }
        }

        dots[0].classList.add('active')
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                setActiveIndex(index)
                scrollToSlide(index)
            })
        })
    }

    private renderImages() {
        const sliderList = this.element.querySelector(
            '.banner__list',
        ) as HTMLElement
        const slideDotsList = this.element.querySelector(
            '.banner__nav-dots',
        ) as HTMLElement

        if (!sliderList || !slideDotsList) {
            console.warn('Slider list or dots list not found.')
            return
        }

        for (let i = 0; i < this.IMAGES.length; i++) {
            const sliderItem = document.createElement('li')
            sliderItem.classList.add('banner__item')
            sliderItem.style.width = '100%'
            const slideImg = document.createElement('img')
            slideImg.src = this.IMAGES[i]._url
            slideImg.alt = this.IMAGES[i]._title

            const dotsItem = document.createElement('li')
            dotsItem.classList.add('dot')
            dotsItem.dataset.index = i.toString()
            const dotsLinksItem = document.createElement('a')
            sliderItem.append(slideImg)
            sliderList.append(sliderItem)
            dotsItem.append(dotsLinksItem)
            slideDotsList.append(dotsItem)
        }
    }

    private render() {
        this.element.innerHTML = template
    }

    public appendTo(parent: HTMLElement) {
        parent.appendChild(this.element)
    }
}
