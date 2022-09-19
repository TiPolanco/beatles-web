import { chain as wagmiChain } from "wagmi";

export const chain = {
    ...wagmiChain,
    ethwMainnet: {
        blockExplorers: {
            default: {
                name: 'ethwscan',
                url: 'https://mainnet.ethwscan.com/'
            }
        },
        id: 10001,
        name: 'EthereumPoW',
        nativeCurrency: {
            name: 'EtherPoW',
            symbol: 'ETHW',
        },
        network: 'ethereumpow',
        rpcUrls: {
            default: 'https://mainnet.ethereumpow.org',
        }
    },
};