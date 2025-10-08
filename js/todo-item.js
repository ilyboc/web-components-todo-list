const templateTodoItem = document.createElement('template');
templateTodoItem.innerHTML = `
    <li class="item">
        <input type="checkbox">
        <p></p>
        <button class="destroy">x</button>
    </li>
`;

class TodoItem extends HTMLElement {
    constructor() {
        super();
        
    }

    connectedCallback() {
        this.render();
    }

    disconnectedCallback() { }

    render() {
        this.appendChild(templateTodoItem.content.cloneNode(true));
        this.$item = this.querySelector('.item');
        this.$removeButton = this.querySelector('.destroy');
        this.$text = this.querySelector('p');
        this.$checkbox = this.querySelector('input');
        this.$removeButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.dispatchEvent(new CustomEvent('onRemove', { detail: this }));
        });
        this.$checkbox.addEventListener('click', (e) => {
            e.preventDefault();
            this.dispatchEvent(new CustomEvent('onToggle', { detail: this }));
        });
        this.$text.innerText = this.data.text;
        if (this.dataset.checked) {
            this.$item.classList.add('completed');
            this.$checkbox.setAttribute('checked', '');
        } else {
            this.$item.classList.remove('completed');
            this.$checkbox.removeAttribute('checked');
        }

    }
}

window.customElements.define('todo-item', TodoItem);
