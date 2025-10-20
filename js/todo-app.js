import { generateId } from './utils.js';
import { TodoList } from './todo-list.js';
import { TodoInput } from './todo-input.js';

const templateTodo = document.createElement('template');
templateTodo.innerHTML = `
    <section>
        <todo-input></todo-input>
        <ul is="todo-list" id="list-container"></ul>
    </section>
`;

class TodoApp extends HTMLElement {
    constructor() {
        super();
        // State that holds the source of truth
        this._list = [
            { id: generateId(), text: 'todo', description: 'My first todo', checked: false, color: 'red', tags: ['general'] },
            { id: generateId(), text: 'Learn about Web Components', description: 'Study the basics of Web Components', checked: true, color: 'blue', tags: ['web', 'components'] },
        ];

        // Bindings
        this.addItemHandler = this.addItemHandler.bind(this);
        this.checkDuplicateHandler = this.checkDuplicateHandler.bind(this);
        this.listChangeHandler = this.listChangeHandler.bind(this);
    }

    connectedCallback() {
        this.render();
    }

    disconnectedCallback() {}


    addItemHandler(e) {
        if (this._cannotAdd) {
            alert("Cannot add duplicated todo");
            return;
        }
        const item = { id: generateId(), text: e.detail, checked: false };
        this._list.push(item);
        console.log("Adding item", this._list, this.$listContainer);
        this.$listContainer.data = structuredClone(this._list);
    }

    checkDuplicateHandler(e) {
        const searchTerm = e.detail.trim();
        if (searchTerm === '') return;
        this._cannotAdd = this._list.find(item => item.text === searchTerm) != null;
        if (this._cannotAdd) {
            this.$input.setAttribute('data-message', "Todo already exists!");
        } else {
            this.$input.setAttribute('data-message', "");
        }
        // No need to re-render everything
    }

    listChangeHandler(e) {
        this._list = e.detail;
    }


    render() {
        const node = templateTodo.content.cloneNode(true);
        
        this.$input = node.querySelector('todo-input');
        Object.setPrototypeOf(this.$input, TodoInput.prototype);
        this.$input.addEventListener('onSubmit', this.addItemHandler);
        this.$input.addEventListener('onChange', this.checkDuplicateHandler);
        
        this.$listContainer = node.querySelector('#list-container');
        Object.setPrototypeOf(this.$listContainer, TodoList.prototype);
        this.$listContainer.data = structuredClone(this._list);
        this.$listContainer.addEventListener('onChange', this.listChangeHandler);

        this.appendChild(node);
    }
}

window.customElements.define('todo-app', TodoApp);