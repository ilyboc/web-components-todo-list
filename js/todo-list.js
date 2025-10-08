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
        this.addItem = this.addItem.bind(this);
        this.checkDuplicate = this.checkDuplicate.bind(this);
        this.removeItem = this.removeItem.bind(this);
        this.toggleItem = this.toggleItem.bind(this);

        this.appendChild(templateTodo.content.cloneNode(true));
        this.$input = this.querySelector('todo-input');
        this.$listContainer = this.querySelector('#list-container');

        this.$input.addEventListener('onSubmit', this.addItem);
        this.$input.addEventListener('onChange', this.checkDuplicate);
    }

    connectedCallback() {
        this.render();
    }

    addItem(e) {
        console.log('Add item', this._cannotAdd);
        if (this._cannotAdd) {
            alert("Cannot add duplicated todo");
            return;
        }
        this._list.push({ id: generateId(), text: e.detail, checked: false });
        this.render();
    }

    checkDuplicate(e) {
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
        this._list = this._list.filter(item => item.id != e.detail.dataset.key);
        this.render();
    }

    toggleItem(e) {
        console.log('Toggle item', e.detail);
        const item = this._list.find(item => item.id == e.detail.dataset.key);
        if (!item) return;

        console.log(this._list)
        item.checked = !item.checked;
        console.log(this._list)
        this.render();
    }

    disconnectedCallback() {
        this.$input.removeEventListener('onSubmit', this.addItem);
    }

    render() {
        if (!this.$listContainer) return;
        this.$listContainer.innerHTML = '';
        this._list.forEach((item, index) => {
            let $item = document.createElement('todo-item');
            $item.dataset.checked = item.checked ? 'true' : '';
            $item.dataset.key = item.id;
            $item.data = structuredClone(item);
            $item.addEventListener('onRemove', this.removeItem);
            $item.addEventListener('onToggle', this.toggleItem);
            this.$listContainer.appendChild($item);
        });
    }
}

window.customElements.define('todo-list', TodoList);