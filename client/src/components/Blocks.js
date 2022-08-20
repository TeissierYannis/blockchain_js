import React, {useEffect} from "react";
import axios from "axios";
import Block from "./Block";

const Blocks = () => {

    const [blocks, setBlocks] = React.useState([]);


    const getBlocks = () => {
        axios.get("http://localhost:3000/api/blocks").then((response) => {
            setBlocks(response.data);
        });
    }

    useEffect(() => {
        if (blocks.length === 0) {
            getBlocks();
        }
    });

    return (
        <div>
            <h1>Blocks viewer</h1>
            {blocks.map((block, index) => (
                <Block key={index} block={block}/>
            ))}
        </div>
    );
}

export default Blocks;