import React from "react";
import { JSONTree } from "react-json-tree";

const Block = ({index, block}) => {

    const theme = {
        scheme: 'monokai',
        author: 'wimer hazenberg (http://www.monokai.nl)',
        base00: '#272822',
        base01: '#383830',
        base02: '#49483e',
        base03: '#75715e',
        base04: '#a59f85',
        base05: '#f8f8f2',
        base06: '#f5f4f1',
        base07: '#f9f8f5',
        base08: '#f92672',
        base09: '#fd971f',
        base0A: '#f4bf75',
        base0B: '#a6e22e',
        base0C: '#a1efe4',
        base0D: '#66d9ef',
        base0E: '#ae81ff',
        base0F: '#cc6633',
    };

    return (
        <div>
            <div className="blockContainer" key={index}>
                <h3 className="blockTitle">Block {index}</h3>
                <p className="blockHash">Hash: {block.hash}</p>
                <p className="blockPreviousHash">Previous Hash: {block.lastHash}</p>
                <p className="blockTimestamp">Timestamp: {block.timestamp}</p>
                <p className="blockDifficulty">Difficulty: {block.difficulty}</p>
                <p className="blockNonce">Nonce: {block.nonce}</p>
                <JSONTree data={block.data} theme={theme}/>
            </div>
        </div>
    );
}

export default Block;