class Node {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
}

class BST {
    constructor() {
        this.root = null;
    }

    insert(value) {
        this.root = this._insert(this.root, value);
    }

    _insert(root, value) {
        if (root === null) {
            return new Node(value);
        }

        if (value < root.value) {
            root.left = this._insert(root.left, value);
        } else if (value > root.value) {
            root.right = this._insert(root.right, value);
        }

        return root;
    }

    delete(value) {
        this.root = this._delete(this.root, value);
    }

    _delete(root, value) {
        if (root === null) {
            return null;
        }

        if (value < root.value) {
            root.left = this._delete(root.left, value);
        } else if (value > root.value) {
            root.right = this._delete(root.right, value);
        } else {
            if (root.left === null) {
                return root.right;
            } else if (root.right === null) {
                return root.left;
            }

            root.value = this._minValueNode(root.right);

            root.right = this._delete(root.right, root.value);
        }

        return root;
    }

    _minValueNode(node) {
        let current = node;
        while (current.left !== null) {
            current = current.left;
        }
        return current.value;
    }

    search(value) {
        return this._search(this.root, value);
    }

    _search(root, value) {
        if (root === null || root.value === value) {
            return root;
        }

        return value < root.value ? this._search(root.left, value) : this._search(root.right, value);
    }

    inOrderTraversal(callback, visitedNodes = []) {
        this._inOrderTraversal(this.root, callback, visitedNodes);
    }

    _inOrderTraversal(node, callback, visitedNodes) {
        if (node !== null) {
            this._inOrderTraversal(node.left, callback, visitedNodes);
            visitedNodes.push(node);
            callback(node);
            this._inOrderTraversal(node.right, callback, visitedNodes);
        }
    }

    preOrderTraversal(callback, visitedNodes = []) {
        this._preOrderTraversal(this.root, callback, visitedNodes);
    }

    _preOrderTraversal(node, callback, visitedNodes) {
        if (node !== null) {
            visitedNodes.push(node);
            callback(node);
            this._preOrderTraversal(node.left, callback, visitedNodes);
            this._preOrderTraversal(node.right, callback, visitedNodes);
        }
    }

    postOrderTraversal(callback, visitedNodes = []) {
        this._postOrderTraversal(this.root, callback, visitedNodes);
    }

    _postOrderTraversal(node, callback, visitedNodes) {
        if (node !== null) {
            this._postOrderTraversal(node.left, callback, visitedNodes);
            this._postOrderTraversal(node.right, callback, visitedNodes);
            visitedNodes.push(node);
            callback(node);
        }
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("bstCanvas");
    const context = canvas.getContext("2d");
    const bst = new BST();
    let visualizationMode = false;

    // Function to draw the BST
    function drawTree(node, x, y, xOffset, parentX, parentY, searchedNode, visitedNodes) {
        if (node !== null) {
            // Draw left subtree
            if (node.left !== null) {
                context.beginPath();
                context.moveTo(x - 20, y);
                context.lineTo(x - xOffset + 20, y + 60);
                context.stroke();
            }

            // Draw right subtree
            if (node.right !== null) {
                context.beginPath();
                context.moveTo(x + 20, y);
                context.lineTo(x + xOffset - 20, y + 60);
                context.stroke();
            }

            // Set fill color based on node status
            let fillColor = "#3498db"; // Default color
            if (searchedNode === node) {
                fillColor = "#e74c3c"; // Color for searched node
            } else if (visitedNodes.includes(node)) {
                fillColor = "#27ae60"; // Color for visited nodes
            }

            // Draw node with fill color
            context.beginPath();
            context.arc(x, y, 20, 0, 2 * Math.PI);
            context.fillStyle = fillColor;
            context.fill();
            context.stroke();
            context.fillStyle = "#ffffff";
            context.fillText(node.value, x - 5, y + 5);


            // Draw left subtree
            drawTree(node.left, x - xOffset, y + 60, xOffset / 2, x, y, searchedNode, visitedNodes);

            // Draw right subtree
            drawTree(node.right, x + xOffset, y + 60, xOffset / 2, x, y, searchedNode, visitedNodes);
        }
    }


    // Function to clear the canvas
    function clearCanvas() {
        context.clearRect(0, 0, canvas.width, canvas.height);
    }

    // Button handlers
    window.insertNode = function () {
        const nodeValue = document.getElementById("nodeValue").value;
        if (!isNaN(nodeValue) && nodeValue !== "") {
            bst.insert(parseInt(nodeValue));
            clearCanvas();
            if (!visualizationMode) {
                drawTree(bst.root, canvas.width / 2, 50, 200, null, null, null, []);
            }
        }
    };

    window.deleteNode = function () {
        const nodeValue = document.getElementById("nodeValue").value;
        if (!isNaN(nodeValue) && nodeValue !== "") {
            bst.delete(parseInt(nodeValue));
            clearCanvas();
            if (!visualizationMode) {
                drawTree(bst.root, canvas.width / 2, 50, 200, null, null, null, []);
            }
        }
    };

    window.searchNode = function () {
        const nodeValue = document.getElementById("nodeValue").value;
        if (!isNaN(nodeValue) && nodeValue !== "") {
            const searchedNodeValue = parseInt(nodeValue);
            const searchedNode = bst.search(searchedNodeValue);

            clearCanvas();
            if (!visualizationMode) {
                drawTree(bst.root, canvas.width / 2, 50, 200, null, null, searchedNode, []);
            }

            if (searchedNode !== null) {
                console.log("Node found:", searchedNode.value);
            } else {
                console.log("Node not found");
            }
        }
    };

    window.visualizeTraversal = async function () {
        visualizationMode = true;
        const selectedTraversal = document.getElementById("traversal").value;
        const visitedNodes = [];
        let output = "";

        switch (selectedTraversal) {
            case "inOrder":
                console.log("Performing in-order traversal");
                bst.inOrderTraversal(async function (node) {
                    visitedNodes.push(node);
                    output += node.value + " ";

                    // Add a blinking effect
                    for (let i = 0; i < 1; i++) {
                        clearCanvas();
                        drawTree(bst.root, canvas.width / 2, 50, 200, null, null, null, visitedNodes);
                        await sleep(5000);
                    }
                });
                break;

            case "preOrder":
                console.log("Performing pre-order traversal");
                bst.preOrderTraversal(async function (node) {
                    visitedNodes.push(node);
                    output += node.value + " ";

                    // Add a blinking effect
                    for (let i = 0; i < 1; i++) {
                        clearCanvas();
                        drawTree(bst.root, canvas.width / 2, 50, 200, null, null, null, visitedNodes);
                        await sleep(5000);
                    }
                });
                break;

            case "postOrder":
                console.log("Performing post-order traversal");
                bst.postOrderTraversal(async function (node) {
                    visitedNodes.push(node);
                    output += node.value + " ";

                    // Add a blinking effect
                    for (let i = 0; i < 1; i++) {
                        clearCanvas();
                        drawTree(bst.root, canvas.width / 2, 50, 200, null, null, null, visitedNodes);
                        await sleep(5000);
                    }
                });
                break;

            default:
                console.log("Invalid traversal type");
                break;
        }

        document.getElementById("outputText").textContent = output;
        document.getElementById("outputDialog").style.display = "block";
    };

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    window.clearCanvas = function () {
        visualizationMode = false;
        bst.root = null;
        clearCanvas();
    };

    window.exitVisualization = function () {
        visualizationMode = false;
        clearCanvas();
        drawTree(bst.root, canvas.width / 2, 50, 200, null, null, null, []);
    };

    window.closeDialog = function () {
        document.getElementById("outputDialog").style.display = "none";
    };
});

// Function to animate the search process
async function animateSearch(node, searchedNode) {
    if (node !== null) {
        await sleep(500); // Delay between each step (adjust as needed)
        clearCanvas();
        drawTree(bst.root, canvas.width / 2, 50, 200, null, null, node);

        if (node === searchedNode) {
            console.log("Node found:", searchedNode.value);
        }

        await sleep(500); // Delay between each step (adjust as needed)
        await animateSearch(node.left, searchedNode);
        await animateSearch(node.right, searchedNode);
    }
}

// Function to animate the entire tree traversal process
async function animateTreeTraversal(node, traversalType) {
    if (node !== null) {
        await sleep(500); // Delay between each step (adjust as needed)

        switch (traversalType) {
            case "inOrder":
                console.log("In-order traversal:", node.value);
                break;

            case "preOrder":
                console.log("Pre-order traversal:", node.value);
                break;

            case "postOrder":
                console.log("Post-order traversal:", node.value);
                break;

            default:
                console.log("Invalid traversal type");
                break;
        }

        // Add a blinking effect
        for (let i = 0; i < 3; i++) {
            await sleep(100); // Delay between each blink (adjust as needed)
            clearCanvas();
            await sleep(100); // Delay between each blink (adjust as needed)
        }

        await animateTreeTraversal(node.left, traversalType);
        await animateTreeTraversal(node.right, traversalType);

        // Add a delay after the node and its subtrees have been processed
        // (This is optional, depending on the desired behavior)
        await sleep(500);
        clearCanvas();
    }
}

// Function to start the search animation
window.searchNode = function () {
    const nodeValue = document.getElementById("nodeValue").value;
    if (!isNaN(nodeValue) && nodeValue !== "") {
        const searchedNodeValue = parseInt(nodeValue);
        const searchedNode = BST.search(searchedNodeValue);

        clearCanvas();
        drawTree(BST.root, canvas.width / 2, 50, 200, null, null);

        if (searchedNode !== null) {
            animateSearch(BST.root, searchedNode);
        } else {
            console.log("Node not found");
        }
    }
};

// Function to start the tree traversal animation
window.visualizeTraversal = async function () {
    const selectedTraversal = document.getElementById("traversal").value;

    switch (selectedTraversal) {
        case "inOrder":
            console.log("Performing in-order traversal");
            await animateTreeTraversal(BST.root, "inOrder");
            break;

        case "preOrder":
            console.log("Performing pre-order traversal");
            await animateTreeTraversal(BST.root, "preOrder");
            break;

        case "postOrder":
            console.log("Performing post-order traversal");
            await animateTreeTraversal(BST.root, "postOrder");
            break;

        default:
            console.log("Invalid traversal type");
            break;
    }
};