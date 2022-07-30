import React, { useState, useEffect } from 'react'
import { useCanister } from '@connect2ic/react';
import { idlFactory } from '../../.dfx/local/canisters/nft';
import { Actor, HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
const Card = (props) => {
    const { id } = props;
    const localHost = "http://localhost:8000/";
    const agent = new HttpAgent({ host: localHost });
    const [nft] = useCanister("nft");
    const [name, setName] = useState();
    const [owner, setOwner] = useState();
    const [image, setImage] = useState();
    let NFTActor;
    agent.fetchRootKey();
    async function loadNFT() {
        NFTActor = await Actor.createActor(idlFactory, {
            agent,
            canisterId: id,
        });
        const name = await NFTActor.getName();
        const owner = await NFTActor.getOwner();
        const imageData = await NFTActor.getAsset();
        const imageContent = new Uint8Array(imageData);
        const image = URL.createObjectURL(
            new Blob([imageContent.buffer], { type: "image/png" })
        );
        setName(name);
        setOwner(owner.toText());
        setImage(image);

    }
    useEffect(() => {
        loadNFT();
    }, []);
    return (
        <div>
            <img src={image} alt="" />
            <p>{name}</p>
            <p>{owner}</p>
        </div>
    )
}

export default Card