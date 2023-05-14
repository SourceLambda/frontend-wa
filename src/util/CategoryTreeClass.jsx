/** This will be the node for CategoryTree.
 * Has a Category field to store an category
 * object, and one array to store the category
 * children.
 */
class CategoryNode {

	constructor(category) {
		this.category = category;
		this.children = [];
	}

	addChild(category) {
		let newNode = new CategoryNode(category)
		this.children.push(newNode)
	}

}

/** Tree Data Structure for ordered storage
 * of categories.
 * Has one parent tree root of all general
 * categories, a method to insert one 
 * category and a method to get categories
 * given his parent ID.
 */
export class CategoryTree {
	
	#treeRoot = new CategoryNode({ID: 0})
	constructor() {}

	/**
	 * Insert category in the node given.
	 * @param {object} categoryToInsert
	 * @param {CategoryNode} node - to insert in
	 * @return {boolean} - insert result.
	 */
	#insert(categoryToInsert, node) {
		// is node's category the parent of category?
		if (node.category.ID === categoryToInsert.Parent_CategoryID) {
			node.addChild(categoryToInsert);
			return true
		}
		// search parent cat. in his children if there are
		if (node.children.length) {
			let i = 0
			let auxNode = node.children[i]
			let parentFound = false
			while (auxNode && !parentFound) {
				parentFound = this.#insert(categoryToInsert, auxNode)
				i++
				auxNode = node.children[i]
			}
			return parentFound
		}
		return false
	}
	insertCategory(category) {
		this.#insert(category, this.#treeRoot)
	}

    /**
	 * Return the children of the category with the ID given.
	 * @param {Integer} ID - category ID.
	 * @param {CategoryNode} node - node to searching
	 * @return {CategoryNode[]} - children to return.
	 */
	#getCategories(ID, node) {
		if (ID === node.category.ID) {
			return node.children
		}
		if (node.children.length) {
			let i = 0
			let auxNode = node.children[i]
			let categories;
			while (auxNode && !categories) {
				categories = this.#getCategories(ID, auxNode)
				i++
				auxNode = node.children[i]
			}
			return categories
		}
		return []
	}
	getChildrenCategories(ParentID) {
		return this.#getCategories(ParentID, this.#treeRoot).map(node => node.category)
	}
}


export const createCategoryTree = (categories) => {
	const categoryTree = new CategoryTree();
	categories.forEach(category => {
		categoryTree.insertCategory(category)
	});
	return categoryTree
}
