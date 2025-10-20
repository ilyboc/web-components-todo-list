const templateTodo = document.createElement('template');
templateTodo.innerHTML = `
    <section>
        <todo-input></todo-input>
        <ul id="list-container"></ul>
    </section>
`;

const generateId = () => Date.now().toString() + Math.floor(Math.random() * 10000).toString();

class TodoList extends HTMLElement {
    constructor() {
        super();
        // State
        this._list = [
            { id: generateId(), text: 'todo', description: 'My first todo', checked: false, color: 'red', tags: ['general'] },
            { id: generateId(), text: 'Learn about Web Components', description: 'Study the basics of Web Components', checked: true, color: 'blue', tags: ['web', 'components'] },
        ];

        // Bindings
        this.addItemHandler = this.addItemHandler.bind(this);
        this.checkDuplicateHandler = this.checkDuplicateHandler.bind(this);
        this.removeItem = this.removeItem.bind(this);
        this.toggleItem = this.toggleItem.bind(this);
    }

    connectedCallback() {
        this.render();
    }

    addItemHandler(e) {
        if (this._cannotAdd) {
            alert("Cannot add duplicated todo");
            return;
        }
        const item = { id: generateId(), text: e.detail, checked: false };
        this._list.push(item);
        this.$listContainer.append(this.createTodoItem(item));
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

    removeItem(e) {
        this._list = this._list.filter(item => item.id != e.target.dataset.key);
        this.$listContainer.removeChild(e.target);
    }

    toggleItem(e) {
        const item = this._list.find(item => item.id == e.target.dataset.key);
        if (!item) return;

        item.checked = !item.checked;
        e.target.dataset.checked = item.checked ? 'true' : '';
    }

    disconnectedCallback() {}

    render() {
        this.appendChild(templateTodo.content.cloneNode(true));
        this.$input = this.querySelector('todo-input');
        this.$listContainer = this.querySelector('#list-container');
        this.$input.addEventListener('onSubmit', this.addItemHandler);
        this.$input.addEventListener('onChange', this.checkDuplicateHandler);
        this.renderListContainer();
    }

    renderListContainer() {
        this.$listContainer.innerHTML = '';

        const fragment = document.createDocumentFragment();
        this._list.forEach((item) => {
            fragment.appendChild(this.createTodoItem(item));
        });
        this.$listContainer.appendChild(fragment);
    }

    createTodoItem(item) {
        let $item = document.createElement('todo-item');
        $item.dataset.checked = item.checked ? 'true' : '';
        $item.dataset.key = item.id;
        $item.data = structuredClone(item);

        // Event listeners
        $item.addEventListener('onRemove', this.removeItem);
        $item.addEventListener('onRemoved', (e) => { alert("Removed Todo: " + e.target.data.text) });
        $item.addEventListener('onToggle', this.toggleItem);

        return $item;
    }
}

window.customElements.define('todo-list', TodoList);