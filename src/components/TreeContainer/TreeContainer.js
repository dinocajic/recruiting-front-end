import React, { Component } from 'react'

import TreeNode from '../TreeNode/TreeNode';
import './TreeContainerStyle.css';

class TreeContainer extends Component {

    state = {
        data: null,
        components: null,
    };

    /**
     * UTF-16 character codes
     */
    rightCaret = "0x25B8";
    downCaret  = "0x25BE";

    /**
     * Retrieves the data from the data structure located in ./data/testdata.json
     * Calls createTree() after it has been retrieved to create a new data structure
     */
    componentDidMount() {
        fetch('./data/testdata.json')
            .then( response => response.json() )
            .then( data => this.createTree(data) );
    }

    /**
     * Cycles through the current data structure and creates one that contains children.
     * Adds the visibility property and initializes it to true for each object.
     * Adds the caret UTF-16 symbol and initializes it to rightCaret.
     * Sets the data and calls the createComponents method to generate all the TreeNode components.
     */
    createTree = ( data ) => {
        // Nest Components
        // Nests a given flat array of objects linked to one another recursively
        // https://www.w3resource.com/javascript-exercises/fundamental/javascript-fundamental-exercise-90.php
        const nest = ( items, id = null, link = 'parent' ) => 
            items
                .filter( item => item[link] === id )
                .map( item => ({
                    ...item,
                    children: nest( items, item.id ),
                    visible: true,
                    caret: this.rightCaret
                }));

        let tree = nest( data );

        this.setState(
            {data: tree}, 
            this.createComponents
        );
    }

    /**
     * Creates the <TreeNode /> components
     * Cycles through each object located in this.state.data.
     *   - Each object is pushed onto the components array.
     *     Adds the caret symbol if the object has children.
     *     Adds a left margin.
     *   - The margin is created based on the level of recursion.
     *     This helps indent children underneath the parent.
     *     For example, if the object has a child, the level will be incremented.
     *     The level will be multiplied by 20: this goes up to 5 levels deep.
     *     Afte 10 levels, the margin will be consistent since we don't want to keep indenting indefinitely.
     * Updates the components state property.
     */
    createComponents = ( tree = this.state.data, components = [], level = 0 ) => {

        for ( let i = 0; i < tree.length; i++ ) {

            let marginLeft = ( level === 10 ) ? 200 : level * 20;

            components.push(
                <TreeNode 
                    key={ tree[i].id }
                    node={{
                        ...tree[i], 
                        caret: tree[i].children.length !== 0 ? tree[i].caret : "",
                        marginLeft: marginLeft,
                        cursor: tree[i].children.length !== 0 ? "pointer" : "default"
                    }}
                    onClick={ this.updateTree }
                />
            );

            if ( tree[i].children.length !== 0 ) {
                this.createComponents( tree[i].children, components, ++level );
                --level;
            }
        }

        this.setState({ components });
    }

    /**
     * Gets called when the user clicks on the component that has at least one child.
     * Loops through each tree object until it finds the matching id.
     * If it finds the matching id, it changes the visibilty for all children to !visibilty by 
     * calling the toggleChildrenVisibility() method and passing the children components.
     * It also changes the caret symbol to be the opposite symbol.
     * Since the function calls itself recursively until it finds the matching id, once it 
     * gets back to the first level (0), it will call the createComponents() method to update 
     * the components.
     */
    updateTree = ( id, tree = this.state.data, found = false, level = 0 ) => {

        for ( let i = 0; i < tree.length; i++ ) {

            if ( id === tree[i].id ) {
                if ( tree[i].children.length !== 0 ) {
                    tree[i].caret = (tree[i].caret === this.rightCaret ) ? this.downCaret : this.rightCaret;

                    tree[i].children = this.toggleChildrenVisibility( tree[i].children );
                }

                found = true;
            }
            
            if ( tree[i].children.length !== 0 && found === false ) {
                this.updateTree( id, tree[i].children, found, ++level );
                --level;
            }
        }

        if ( level === 0 ) {
            this.createComponents( tree );
        }
    }

    /**
     * Receives the children components and loops through them.
     * It sets the visibility to the opposite of its current state.
     * If the child has children, it calls itself recursively and passes its children.
     */
    toggleChildrenVisibility = ( children, visibility = null ) => {
        
        for ( let i = 0; i < children.length; i++ ) {
            
            if ( visibility === null ) {
                visibility = !children[i].visible;
            } 
            
            children[i].visible = visibility;

            if ( children[i].children.length !== 0 ) {
                this.toggleChildrenVisibility( children[i].children, visibility );
            }
        }

        return children;
    }

    render() {
        return (
            <div className="main">
                {
                    this.state.components === null
                        ? <div className="loader"></div>
                        : this.state.components
                }
            </div>
        )
    }
}

export default TreeContainer;
