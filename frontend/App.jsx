import React, { useEffect, useState } from "react"
import { Routes, Route } from "react-router-dom"
/*
 * Connect2ic provides essential utilities for IC app development
 */
import { createClient } from "@connect2ic/core"

import { PlugWallet } from "@connect2ic/core/providers/plug-wallet"
import { Connect2ICProvider, useConnect } from "@connect2ic/react"
import { useCanister } from "@connect2ic/react"
import "@connect2ic/core/style.css"
/*
 * Import canister definitions like this:
 */
import * as counter from "../.dfx/local/canisters/counter"
import * as market from "../.dfx/local/canisters/market"
import * as customer from "../.dfx/local/canisters/customer"
/*
 * Some examples to get you started
 */
import { Counter } from "./components/Counter"
import { Profile } from "./components/Profile"

/// component 
import Header from "./components/Header"
import Home from "./page/Home"
import Mint from "./page/Mint"
import { useBalance, useWallet } from "@connect2ic/react"
import { Principal } from "@dfinity/principal";
import Collection from "./page/Collection"
import Discover from "./page/Discover"
import Register from "./page/Register"
import Transfer from "./components/Transfer"
import TransferTo from "./components/TransferTo"
import ReadProfile from "./components/ReadProfile"
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
      {principal ?
        <p className="text-center">hello, {principal}</p>
        : null

      }
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register principal={principal} />} />
        {/* <Route path="/transfer" element={<TransferTo principal={principal} />}></Route> */}
        <Route path="/profile" element={< ReadProfile principal={principal} />} />
        <Route path="/mint" element={<Mint />} />
        <Route path="/collection" element={<Collection principal={principal} />} />
        {/* <Route path="/discover" element={<Discover principal={principal} />} /> */}
      </Routes>
    </div>

  )
}

const client = createClient({
  canisters: {
    counter,
    market,
    customer
  },
  providers: [
    new PlugWallet(),
  ],
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
