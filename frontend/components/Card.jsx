import React, { useState, useEffect } from 'react'
import { useCanister } from '@connect2ic/react';
import { idlFactory } from '../../.dfx/local/canisters/nft';
import { Actor, HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { Button } from "react-bootstrap"
import Loading from "../components/Loading"
const Card = (props) => {
    console.log(props);
    const { id } = props;
    const { principal } = props;
    const { type } = props;
    const localHost = "http://localhost:8080/";
    const agent = new HttpAgent({ host: localHost });
    const [nft] = useCanister("nft");
    const [market] = useCanister("market");
    const [name, setName] = useState();
    const [owner, setOwner] = useState();
    const [image, setImage] = useState();
    const [saleStatus, setSaleStatus] = useState()
    const [blur, setBlur] = useState();
    const [transferStatus, setTransferStatus] = useState("")
    const [display, setDisplay] = useState(true)
    const [loading, setLoading] = useState(false);
    const [btn, setBtn] = useState()
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
        if (type == "collection") {
            const nftList = await market.isListed(props.id)
            if (nftList) {
                setOwner("5Market");
                setBlur({ filter: "blur(5px)" });
                setSaleStatus("Listed")
            } else {
                setBtn(<Button variant='success' onClick={handleSell}>Sell</Button>)
            }
        } else if (type == "discover") {
            const originOwner = await market.getOriginalOwner(id);
            if (originOwner.toText() != principal) {
                setBtn(<Button onClick={handleBuy}>
                    Buy
                </Button>);
            }
        }
    }
    async function sellItem() {
        setBlur({ filter: "blur(4px)" });
        setLoading(true)
        const listingResult = await market.itemList(props.id);
        console.log("listing: " + listingResult);
        if (listingResult == "Success") {
            const marketID = await market.get5MarketCanisterID();
            const transferResult = await NFTActor.transferTo(marketID);
            console.log("transfer: " + transferResult);
            if (transferResult == "Success") {
                setLoading(false);
                setBtn();
                setPriceInput();
                setOwner("5Market");
                setSaleStatus("Listed");
            }
        }
    }
    function handleSell() {
        alert("Sell clicked");
        setBtn(<Button onClick={sellItem}>Confirm</Button>);
    }
    async function handleBuy() {
        console.log("Buy was triggered");
        setLoading(true);

        const sellerId = await market.getOriginalOwner(id);
        console.log(sellerId);
        const transferResult = await market.transfer(
            id,
            sellerId,
            Principal.fromText(principal)
        );
        console.log("purchase: " + transferResult);
        setLoading(false)
        setDisplay(false);
    }

    useEffect(() => {
        loadNFT();
    }, []);
    return (
        <div style={{ display: display ? "inline" : "none" }}>
            <img src={image} style={blur} />
            {loading ? <Loading /> : null}
            <p>{name}</p>
            <p>{saleStatus}</p>
            <p>{owner}</p>
            <p>{btn}</p>
        </div>
    )
}

export default Card