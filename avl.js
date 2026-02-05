// ========================
// Node class
// ========================
class Node {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
        this.height = 1;
    }
}

// ========================
// AVL Tree class
// ========================
class AVLTree {
    constructor() {
        this.root = null;
    }

    height(node) {
        return node ? node.height : 0;
    }

    rightRotate(y) {
        let x = y.left;
        let T2 = x.right;
        x.right = y;
        y.left = T2;
        y.height = Math.max(this.height(y.left), this.height(y.right)) + 1;
        x.height = Math.max(this.height(x.left), this.height(x.right)) + 1;
        return x;
    }

    leftRotate(x) {
        let y = x.right;
        let T2 = y.left;
        y.left = x;
        x.right = T2;
        x.height = Math.max(this.height(x.left), this.height(x.right)) + 1;
        y.height = Math.max(this.height(y.left), this.height(y.right)) + 1;
        return y;
    }

    getBalance(node) {
        return node ? this.height(node.left) - this.height(node.right) : 0;
    }

    insert(node, value) {
        if (!node) return new Node(value);

        if (value < node.value) node.left = this.insert(node.left, value);
        else if (value > node.value) node.right = this.insert(node.right, value);
        else return node; // no duplicates

        node.height = 1 + Math.max(this.height(node.left), this.height(node.right));
        let balance = this.getBalance(node);

        // Left Left
        if (balance > 1 && value < node.left.value) return this.rightRotate(node);

        // Right Right
        if (balance < -1 && value > node.right.value) return this.leftRotate(node);

        // Left Right
        if (balance > 1 && value > node.left.value) {
            node.left = this.leftRotate(node.left);
            return this.rightRotate(node);
        }

        // Right Left
        if (balance < -1 && value < node.right.value) {
            node.right = this.rightRotate(node.right);
            return this.leftRotate(node);
        }

        return node;
    }

    add(value) {
        this.root = this.insert(this.root, value);
    }
}

// ========================
// Setup canvas and tree
// ========================
const tree = new AVLTree();
const canvas = document.getElementById('treeCanvas');
const ctx = canvas.getContext('2d');

// Set font for drawing node values
ctx.font = "16px Arial";
ctx.textAlign = "center";
ctx.textBaseline = "middle";

// ========================
// Dark Mode / Light Mode
// ========================
let darkMode = false;

function toggleTheme() {
    darkMode = !darkMode;
    document.body.classList.toggle("dark-mode");

    // Update button text
    const btn = document.querySelector(".theme-toggle button");
    btn.textContent = darkMode ? "Switch to Light Mode" : "Switch to Dark Mode";

    render(); // re-render tree with new colors
}

// ========================
// Draw AVL tree recursively
// ========================
function drawTree(node, x, y, spacing) {
    if (!node) return;

    // Node color
    ctx.fillStyle = getComputedStyle(document.documentElement)
        .getPropertyValue("--node-color");
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, 2 * Math.PI);
    ctx.fill();

    // Node text color
    ctx.fillStyle = getComputedStyle(document.documentElement)
        .getPropertyValue("--text-color");
    ctx.fillText(node.value, x, y);

    // Draw left child
    if (node.left) {
        ctx.strokeStyle = getComputedStyle(document.documentElement)
            .getPropertyValue("--line-color");
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - spacing, y + 80);
        ctx.stroke();
        drawTree(node.left, x - spacing, y + 80, spacing / 1.5);
    }

    // Draw right child
    if (node.right) {
        ctx.strokeStyle = getComputedStyle(document.documentElement)
            .getPropertyValue("--line-color");
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + spacing, y + 80);
        ctx.stroke();
        drawTree(node.right, x + spacing, y + 80, spacing / 1.5);
    }
}

// ========================
// Render tree on canvas
// ========================
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawTree(tree.root, canvas.width / 2, 50, 200);
}

// ========================
// Button functions
// ========================
function insertNode() {
    const value = parseInt(document.getElementById("nodeValue").value);
    if (!isNaN(value)) {
        tree.add(value);
        render();
        document.getElementById("nodeValue").value = "";
    }
}
