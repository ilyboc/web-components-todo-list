const templateTodoInput = document.createElement('template');
templateTodoInput.innerHTML = `
    <form id="new-todo-form">
        <input id="new-todo" type="text" placeholder="What needs to be done?">
        <div>
            <button type="button" id="clear-button">Clear</button>
            <button type="submit">Add</button>
            <span id="message"></span>
        </div>
    </form>
`;

class TodoInput extends HTMLElement {
    static observedAttributes = ['data-message'];

    constructor() {
        super();
        this.appendChild(templateTodoInput.content.cloneNode(true));
        this.$form = this.querySelector('form');
        this.$input = this.querySelector('input');
        this.$message = this.querySelector('span');
        this.$clearButton = this.querySelector('#clear-button');

        this.handleInput = this.handleInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClear = this.handleClear.bind(this);

        this.$input.addEventListener("input", this.handleInput);
        this.$form.addEventListener("submit", this.handleSubmit);
        this.$clearButton.addEventListener("click", this.handleClear);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'data-message') this.updatedMessage(newValue);
    }

    connectedCallback() {
        console.log('TodoInput ADDED TO THE DOM');
    }

    disconnectedCallback() {
        if (this.$input) {
            this.$input.removeEventListener("input", this.handleInput);
        }
        if (this.$form) {
            this.$form.removeEventListener("submit", this.handleSubmit);
        }
    }
    
    handleInput(e) {
        this.dispatchEvent(new CustomEvent('onChange', { detail: this.$input.value }));
    }

    handleSubmit(e) {
        e.preventDefault();
        if (!this.$input.value) return;
        this.dispatchEvent(new CustomEvent('onSubmit', { detail: this.$input.value }));
        this.$input.value = '';
        this.$message.innerText = '';
    }

    handleClear(e) {
        e.preventDefault();
        console.log('Clearing', this.$input.value);
        this.$input.value = '';
        this.$message.innerText = '';
        this.dispatchEvent(new CustomEvent('onChange', { detail: this.$input.value }));
    }

    updatedMessage(message) {
        this.$message.innerText = message;
    }
}

window.customElements.define('todo-input', TodoInput);
