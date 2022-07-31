import React, { useState, useEffect } from 'react'
import { useCanister } from '@connect2ic/react'
import Loading from "./Loading";
import { Principal } from '@dfinity/principal';
import Card from "./Card"
const Transfer = (props) => {
    const { principal } = props
    const [loading, setLoading] = useState(false)
    const [userNFTData, setUserNFTData] = useState([])
    const [market] = useCanister("market");
    async function callNFT() {
        setLoading(true)
        const userNFT = await market.getOwnerNFT(Principal.fromText(principal));
        console.log(userNFT);
        setUserNFTData(userNFT)
        setLoading(false)
    }
    useEffect(() => {
        callNFT()
    }, [])
    return (
        <div>
            <h3>Available NFTs</h3>
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
                                                <Card type="transfer" key={id} id={nftID} />
                                            ))
                                        }
                                    </div>
                            }
                        </div>
                }
            </div>
        </div>
    )
}

export default Transfer