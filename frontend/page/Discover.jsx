import React, { useEffect, useState } from 'react'
import { useCanister } from '@connect2ic/react';
import Card from "../components/Card"
const Discover = (props) => {
    const [market] = useCanister("market");
    const { principal } = props;

    const [items, setItems] = useState();
    async function fetchNFTs() {
        const listedNFTIds = await market.getNftList();
        if (listedNFTIds != undefined) {
            setItems(
                listedNFTIds.map((NFTId, id) => (
                    <Card id={NFTId} key={id} type="discover" principal={principal} />
                ))
            );
        }
    }
    useEffect(() => {
        fetchNFTs();
    }, []);
    return (
        <div>
            <h1>Discover</h1>
            <div>
                {items}
            </div>
        </div>
    )
}

export default Discover