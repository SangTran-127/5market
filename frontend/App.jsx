import React, { useEffect, useState } from "react"
import { Routes, Route } from "react-router-dom"
/*
 * Connect2ic provides essential utilities for IC app development
 */
import { createClient } from "@connect2ic/core"
import { defaultProviders } from "@connect2ic/core/providers"
import { Connect2ICProvider, useConnect } from "@connect2ic/react"
import { useCanister } from "@connect2ic/react"
import "@connect2ic/core/style.css"
/*
 * Import canister definitions like this:
 */
import * as counter from "../.dfx/local/canisters/counter"
import * as market from "../.dfx/local/canisters/market"
/*
 * Some examples to get you started
 */
import { Counter } from "./components/Counter"
import { Transfer } from "./components/Transfer"
import { Profile } from "./components/Profile"

/// component 
import Header from "./components/Header"
import Home from "./page/Home"
import Mint from "./page/Mint"
import { useBalance, useWallet } from "@connect2ic/react"
import { Principal } from "@dfinity/principal";
import Collection from "./page/Collection"
function App() {

  const [markert] = useCanister("market");
  const [data, setData] = useState()
  // const [principalData, setPrincipalData] = useState("")
  const { isConnected, principal, activeProvider } = useConnect({
    onConnect: ({ principal }) => {
      console.log(principal);
      getData(principal)

    },
    onDisconnect: () => {
      console.log("disconnected");
    }
  })
  async function getData(principal) {
    const list = await markert.getOwnerNFT(Principal.fromText(principal))
    console.log(list);
  }

  return (
    <div className="App">
      <Header principal={principal} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mint" element={<Mint />} />
        <Route path="/collection" element={<Collection principal={principal} />} />
      </Routes>
    </div>

  )
}

const client = createClient({
  canisters: {
    counter,
    market
  },
  providers: defaultProviders,
  globalProviderConfig: {
    /*
     * Disables dev mode in production
     * Should be enabled when using local canisters
     */
    dev: import.meta.env.DEV,
  },
})

export default () => (
  <Connect2ICProvider client={client}>
    <App />
  </Connect2ICProvider>
)
