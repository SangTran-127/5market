import React, { useState } from 'react'
import { useForm } from "react-hook-form";
import { Principal } from "@dfinity/principal";
import { useCanister } from '@connect2ic/react';
import Card from "../components/Card"
import Loading from '../components/Loading';
const Mint = () => {
    const [market] = useCanister("market")
    const { register, handleSubmit } = useForm();
    const [nftPrincipal, setNFTPrincipal] = useState("");
    const [loaderHidden, setLoaderHidden] = useState(true);
    const [loading, setLoading] = useState(false);

    async function onSubmit(data) {
        setLoading(true);
        const name = data.name;
        const image = data.image[0];
        const imageArray = await image.arrayBuffer();
        const imageByteData = [...new Uint8Array(imageArray)];

        const newNFTID = await market.mint(imageByteData, name);
        console.log(newNFTID.toText());
        setNFTPrincipal(newNFTID);
        setLoading(false);
    }

    if (nftPrincipal == "") {
        return (
            <div>
                <h3 className="">
                    Create NFT
                </h3>
                <h6 className="">
                    Upload Image
                </h6>
                {
                    loading ? <Loading /> :
                        <form>
                            <div className="upload-container">
                                <input
                                    {...register("image", { required: true })}
                                    className="upload"
                                    type="file"
                                    accept="image/x-png,image/jpeg,image/gif,image/svg+xml,image/webp"
                                />
                            </div>
                            <h6 className="">
                                Collection Name
                            </h6>
                            <div className="">
                                <div className="">
                                    <input
                                        {...register("name", { required: true })}
                                        placeholder="e.g. CryptoDunks"
                                        type="text"
                                        className=""
                                    />
                                    <fieldset className=""></fieldset>
                                </div>
                            </div>
                            <div className="">
                                <span onClick={handleSubmit(onSubmit)} className="btn btn-success">
                                    Mint NFT
                                </span>
                            </div>
                        </form>
                }
            </div>

        )
    } else {
        return (
            <div className="">
                <h3 className="">
                    Minted!
                </h3>
                <div className="">
                    <Card id={nftPrincipal.toText()} />
                </div>
            </div>
        );
    }

}

export default Mint