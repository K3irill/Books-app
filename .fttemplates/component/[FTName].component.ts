import { render } from 'sass'
import styles from './[FTName].module.scss';
import template from './[FTName].template.html';

export class <FTName | pascalcase> {
    private element: HTMLElement;

    constructor() {
        this.element = document.createElement('DIV');
        this.render();
    }

    private render() {
        this.element.innerHTML = template; 
    }

    public appendTo(parent: HTMLElement) {
        parent.appendChild(this.element); 
    }
}
