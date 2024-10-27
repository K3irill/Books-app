import styles from './Main.style.scss'
import template from './Main.template.html'

export class Main {
    public element: HTMLElement

    constructor() {
        this.element = document.createElement('main')
    }

    public appendTo(parent: HTMLElement) {
        parent.appendChild(this.element)
    }
}
