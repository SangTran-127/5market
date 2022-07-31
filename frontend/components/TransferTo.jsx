import React from 'react'

const TransferTo = (props) => {
    const { principal } = props;
    return (
        <div>
            <h5>from {principal}</h5>
            <input type="text" placeholder='to' />
        </div>
    )
}

export default TransferTo