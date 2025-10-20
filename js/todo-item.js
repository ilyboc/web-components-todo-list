const templateTodoItem = document.createElement('template');
templateTodoItem.innerHTML = `
    <li class="item">
        <input type="checkbox">
        <p></p>
        <todo-form></todo-form>
        <button class="destroy">x</button>
    </li>
`;

class TodoItem extends HTMLElement {

    constructor() {
        super();
    }

    set data(value) {
        if (this._data == null) {
            this._data = value;
        } else {
            this._data = value;
            this.render();
        }
    }

    get data() {
        return this._data;
    }

    static get observedAttributes() {
        return ['data-checked'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'data-checked' && this.$checkbox) {
            this.updateChecked();
        }
    }

    connectedCallback() {
        this.render();
    }

    disconnectedCallback() {
        this.dispatchEvent(new CustomEvent('onRemoved'));
    }

    render() {
        this.innerHTML = '';
        this.append(templateTodoItem.content.cloneNode(true));
        this.$item = this.querySelector('.item');
        this.$removeButton = this.querySelector('.destroy');
        this.$text = this.querySelector('p');
        this.$checkbox = this.querySelector('input');
        this.$text.innerText = this.data.text;

        this.$removeButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.dispatchEvent(new CustomEvent('onRemove'));
        });
        this.$checkbox.addEventListener('click', (e) => {
            this.dispatchEvent(new CustomEvent('onToggle'));
        });
        
        this.updateChecked();
    }

    updateChecked() {
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
