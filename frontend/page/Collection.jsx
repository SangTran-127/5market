import React, { useState, useEffect } from 'react'
import Card from "../components/Card"
import Loading from "../components/Loading"
import { useCanister } from '@connect2ic/react'
import { Principal } from '@dfinity/principal'
const Collection = ({ principal }) => {
    const [userNFTData, setUserNFTData] = useState([])
    const [loading, setLoading] = useState(false)
    const [market] = useCanister("market");
    async function getNFTs() {
        setLoading(true)
        const userNFT = await market.getOwnerNFT(Principal.fromText(principal));
        console.log(userNFT);
        setUserNFTData(userNFT)
        setLoading(false)
    }

    useEffect(() => {
        getNFTs();
    }, [])

    return (
        <div>
            {
                loading ?
                    <Loading />
                    :
                    <div>
                        {
                            userNFTData == [] ?
                                "You dont have any NFT"
                                :
                                <div>
                                    {
                                        userNFTData.map((nftID, id) => (
                                            <Card type="collection" key={id} id={nftID} />
                                        ))
                                    }
                                </div>
                        }
                    </div>
            }
        </div>
    )
}

export default Collection