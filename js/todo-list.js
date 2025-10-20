export class TodoList extends HTMLUListElement {
    constructor() {
        super();
        // Bindings
        this.removeItem = this.removeItem.bind(this);
        this.toggleItem = this.toggleItem.bind(this);
    }

    set data(value) {
        if (this._data == null) {
            this._data = value;
        } else {
            this._data = value;
            this.update();
        }
    }

    get data() {
        return this._data;
    }

    connectedCallback() {
        this.render();
    }

    disconnectedCallback() {}

    removeItem(e) {
        this.data = this.data.filter(item => item.id != e.target.dataset.key);
        this.$listContainer.removeChild(e.target);
        this.dispatchEvent(new CustomEvent("onChange", {detail: structuredClone(this.data)}));
    }

    toggleItem(e) {
        const item = this.data.find(item => item.id == e.target.dataset.key);
        if (!item) return;

        item.checked = !item.checked;
        e.target.dataset.checked = item.checked ? 'true' : '';

        this.dispatchEvent(new CustomEvent("onChange", {detail: structuredClone(this.data)}));
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

    update() {
        console.log("Updating list...", this.data, this.children);
        // Efficiently update the list by comparing children and data
        let i = 0;
        while (i < this.data.length || i < this.children.length) {
            const item = this.data[i];
            const child = this.children[i];

            if (item && child) {
                if (child.dataset.key === String(item.id)) {
                    // Same item, update data
                    child.data = structuredClone(item);
                } else {
                    // Different item, insert new todo before current child
                    const newChild = this.createTodoItem(item);
                    this.insertBefore(newChild, child);
                }
            } else if (item && !child) {
                // No child, add new todo at the end
                this.appendChild(this.createTodoItem(item));
            } else if (!item && child) {
                // No more items, remove extra children
                this.removeChild(child);
                // Don't increment i, as children shift left
                continue;
            }
            i++;
        }
    }

    render() {
        this.innerHTML = '';

        const fragment = document.createDocumentFragment();
        this.data.forEach((item) => {
            fragment.appendChild(this.createTodoItem(item));
        });
        this.appendChild(fragment);
    }
}

window.customElements.define('todo-list', TodoList, { extends: 'ul' });