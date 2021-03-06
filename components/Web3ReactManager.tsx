import React, { useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'

import useEagerConnect from '../hooks/web3/useEagerConnect'
import useInactiveListener from '../hooks/web3/useInactiveListener'
import { NetworkContextName } from '../connectors'
import { network } from '../connectors'


const Web3ReactManager: React.FC = ({ children }) => {
    const { active } = useWeb3React()
    const { active: networkActive, error: networkError, activate: activateNetwork } = useWeb3React(NetworkContextName)
    // try to eagerly connect to an injected provider, if it exists and has granted access already
    const triedEager = useEagerConnect()
    
    // after eagerly trying injected, if the network connect ever isn't active or in an error state, activate itd
    useEffect(() => {
        if (triedEager && !networkActive && !networkError && !active) {
            activateNetwork(network)
        }
    }, [triedEager, networkActive, networkError, activateNetwork, active])
    
    // when there's no account connected, react to logins (broadly speaking) on the injected provider, if it exists
    useInactiveListener(!triedEager)
    
    return <>{children}</>
}

export default Web3ReactManager