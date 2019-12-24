import React from 'react'

import './TreeNodeStyle.css';

function TreeNode(props) {

    const {
        id,
        name,
        thumbnail,
        caret,
        marginLeft,
        visible
    } = props.node;

    if ( visible ) {
        return (
            <div 
                className="node-div" 
                style={{ marginLeft: marginLeft }} 
                onClick={ 
                    // Calls the onClick function only if the object has children
                    props.node.children.length === 0 
                        ? undefined 
                        : () => props.onClick(id) 
                }
            >
                <img 
                    src={ thumbnail.href } 
                    alt={ thumbnail.description } 
                    className="node-image"
                />
    
                { name } 
                
                <span className="caret-symbol">
                    { String.fromCharCode(caret) }
                </span>
            </div>
        )
    } else {
        return null;
    }
}

export default TreeNode;