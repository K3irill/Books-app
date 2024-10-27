import './Header.style.scss'

import template from './Header.template.html'

export class Header {
    private element: HTMLElement
    public goodsElement: Element | null
    constructor() {
        this.element = document.createElement('header')
        this.element.classList.add('header')
        this.render()
        this.goodsElement = this.element.querySelector('#goods')
        console.log(this.goodsElement)
    }

    private render() {
        this.element.innerHTML = template
    }

    public appendTo(parent: HTMLElement) {
        parent.appendChild(this.element)
    }
}
