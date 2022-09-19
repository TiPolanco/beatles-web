import { Fragment } from 'react';
import { utils } from 'ethers';
import { useAccount, useNetwork } from 'wagmi';

import useTokenContractReads from '../hooks/useTokenContractReads.js';
import useTokenContractCall from '../hooks/useTokenContractCall.js';

import contract from '../contract.js';

const CONTRACT_DATA_KEYS = ['TOTAL_MAX_QTY', 'totalSupply', 'SALES_PRICE', 'isPublicSalesActivated', 'isPreSalesActivated'];

const Main = () => {
    const { chain } = useNetwork();
    const { isConnected } = useAccount();
    const isWrongNetwork = isConnected && contract.chainId !== chain.id;
    
    const { contractData = {}, isLoading } = useTokenContractReads({
        variables: CONTRACT_DATA_KEYS,
        disabled: isWrongNetwork,
    });

    const {
        TOTAL_MAX_QTY: maxSupply = '--',
        totalSupply = '--',
        SALES_PRICE: salePrice,
        isPublicSalesActivated,
        isPreSalesActivated,
    } = contractData;

    const {
        contractCall: publicMint,
        isDisabled: isPublicMintDisabled,
        error: mintError,
        isCalling: isCallingMint,
        isWaitSuccess: isMintSuccess,
    } = useTokenContractCall({
        args: [2, { value: salePrice }],
        disabled: !isPublicSalesActivated || isWrongNetwork || !salePrice,
        functionName: 'mint',
    });

    const {
        contractCall: preMint,
        isDisabled: isPreMintDisabled,
        error: preMintError,
        isCalling: isCallingPreMint,
        isWaitSuccess: isPreMintSuccess,
    } = useTokenContractCall({
        args: [5, { value: salePrice }],
        disabled: !isPreSalesActivated || isWrongNetwork || !salePrice,
        functionName: 'preMint',
    });

    console.log('QA: data', { maxSupply, totalSupply, salePrice, isPublicSalesActivated, isPreSalesActivated, mintError, preMintError });

    const renderMessage = () => {
        if (!isPreSalesActivated && !isPublicSalesActivated) {
            return (<div>Coming Soon...</div>);
        }
        
        return (
            <Fragment>
                <div>
                    {`${isPreSalesActivated ? 'Pre' : 'Public'} Sale Price: `}
                    <span className='emphasize'>{`${salePrice ? utils.formatEther(salePrice) : '--'} ETHW`}</span>
                    {` for ${isPreSalesActivated ? '5' : '2' } Beatles!`}
                </div>
                <div><span className='emphasize'>{`${totalSupply} / ${maxSupply}`}</span> Minted</div>
            </Fragment>
        );
    }

    const renderMintButton = () => {
        const mintFunc = isPreSalesActivated ? preMint : (isPublicSalesActivated ? publicMint : null);        
        if (!mintFunc) return null;

        const isMinting = isPreSalesActivated ? isCallingPreMint : isCallingMint;
        const isSuccess = isPreSalesActivated ? isPreMintSuccess : isMintSuccess;
        const error = isPreSalesActivated ? preMintError : mintError;
        let errorMessage = '';
        if (error) {
            if (error.error) {
                errorMessage = error.error.data?.message || error.error.message;
            }
            if (!errorMessage && error.reason) errorMessage = error.reason;
            if (!errorMessage && error.data) errorMessage = error.data.message;

            if (errorMessage && errorMessage.indexOf(':') > 0) errorMessage = errorMessage.split(':')[1];
        }
        const isDisabled = isMinting || (isPreSalesActivated ? isPreMintDisabled : isPublicMintDisabled);

        return (
            <div>
                <div
                    className={`mint-btn${isDisabled ? ' disabled' : ''}`}
                    onClick={mintFunc}
                >
                    {isMinting ? 'Minting' : 'Mint'}
                </div>
                <div className='mint-error'>{ errorMessage }</div>
                <div className='mint-success'>{ isSuccess && 'Success!!' }</div>
            </div>
        );
    }

    const renderRules = () => (
        <div className='mint-rule'>
            <p>Pre Mint 2 hrs: <strong className='emphasize'>9/19/2022 21:00 EST</strong> & <strong className='emphasize'>9/20/2022 9:00 UTC+8</strong></p>
            <p>Whitelisted wallets can mint <strong className='emphasize'>5</strong> Beatles for 0.01 ETHW</p>
            <p>Public Mint 48 hrs: from <strong className='emphasize'>9/19/2022 23:00 EST</strong> & <strong className='emphasize'>9/20/2022 11:00 UTC+8</strong></p>
            <p>All users are welcomed to mint <strong className='emphasize'>2</strong> Beatles for 0.01 ETHW</p>
        </div>
    );

    if (isLoading) {
        return (
            <div>Loading...</div>
        );
    }

    return (
        <div className="main">
            <div className="mint-image">
                <img src="https://pbs.twimg.com/media/Fc4M617agAEthfO?format=jpg&name=medium" alt="Beatles POW"/>
            </div>
            <div className="mint-stats">
                {renderMessage()}
            </div>
            {renderMintButton(mintError || preMintError)}
            {renderRules()}
        </div>
    );
};

export default Main;