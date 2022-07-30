import Cycles "mo:base/ExperimentalCycles";
import Debug "mo:base/Debug";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import List "mo:base/List";
import NFTActor "../nft/main";
import Principal "mo:base/Principal";
import Text "mo:base/Principal";
actor Market {

    private type Item = {
        ownerItem: Principal;
        // price: Nat;
    };

    // danh sach cac nft
    private var nftMaps = HashMap.HashMap<Principal, NFTActor.NFT>(1, Principal.equal, Principal.hash);
    // danh sach cac owner key la Prin, value la Prin list de map voi tung cai NFT
    private var ownerMaps = HashMap.HashMap<Principal, List.List<Principal>>(1, Principal.equal, Principal.hash);
    // list nhung cai nft
    private var itemMaps = HashMap.HashMap<Principal, Item>(1, Principal.equal, Principal.hash); 

    public shared({caller}) func mint(img: [Nat8], name: Text) : async Principal {
        let owner : Principal = caller;
        Cycles.add(100_500_000_000);
        let newNFT = await NFTActor.NFT(name, owner, img);
        let nftPrincipal = await newNFT.getCanisterID();
        nftMaps.put(nftPrincipal, newNFT);
        addToOwner(owner, nftPrincipal);
        return nftPrincipal;
       
    };

    private func addToOwner(owner : Principal, nftID : Principal) {
        var ownerNFTs : List.List<Principal> = switch(ownerMaps.get(owner)) {
            case null List.nil<Principal>();
            case (?result) result;
        };
        ownerNFTs := List.push(nftID, ownerNFTs);
        ownerMaps.put(owner, ownerNFTs);
    };

    public query func getOwnerNFT(user: Principal) : async [Principal] {
        var list : List.List<Principal> = switch (ownerMaps.get(user)) {
            case null List.nil<Principal>();
            case (?result) result;
        };
        return List.toArray(list);
    };

    public query func getNftList() : async [Principal] {
      return Iter.toArray(itemMaps.keys())
    };

    public shared({caller}) func itemList(id: Principal) : async Text {
        var item : NFTActor.NFT = switch (nftMaps.get(id)) {
            case null return "NFT does not exist";
            case (?result) result;
        };
        let owner : Principal = await item.getOwner();
        if (Principal.equal(owner, caller)) {
            let newItem : Item = {
                ownerItem = owner;
            };
            itemMaps.put(id, newItem);
            return "Success";
        } else {
            return "You are not the owner";
        }

    };

}