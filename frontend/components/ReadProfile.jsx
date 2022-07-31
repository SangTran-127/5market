import React, { useState, useEffect } from 'react'
import { useCanister } from '@connect2ic/react'
import Loading from './Loading';
const ReadProfile = () => {
    const [customer] = useCanister("customer");
    const [data, setData] = useState({})
    const [loading, setLoading] = useState(false)
    async function callAccount() {
        setLoading(true)
        const res = await customer.readAccount();
        console.log(res);
        setData(res[0])
        console.log(data);
        setLoading(false)
    }
    useEffect(() => {
        callAccount()
    }, [])
    return (
        <div>
            {
                loading ? <Loading />
                    :
                    <table border="1">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Birthday</th>
                                <th>Phone</th>
                                <th>Sex</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{data.ID}</td>
                                <td>{data.Name}</td>
                                <td>{data.Birthday}</td>
                                <td>{data.Phone}</td>
                                <td>{data.Sex}</td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>

            }
        </div>
    )
}

export default ReadProfile