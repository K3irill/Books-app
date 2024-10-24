import styles from './Header.module.scss';
import template from './Header.template.html';

export class Header {
  private element: HTMLElement;

  constructor() {
    this.element = document.createElement('header');
    this.render();
  }

  private render() {
    this.element.innerHTML = template;
  }

  public appendTo(parent: HTMLElement) {
    parent.appendChild(this.element);
  }
}