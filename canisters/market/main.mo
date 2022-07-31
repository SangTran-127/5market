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
    public query func getOriginalOwner(id: Principal) : async Principal {
        var item : Item = switch(itemMaps.get(id)) {
            case null return Principal.fromText("");
            case (?result) result;
        };
        return item.ownerItem;
    };
    public query func isListed(id: Principal) : async Bool {
      if (itemMaps.get(id) == null) {
        return false;
      } else{
        return true;
      }
    };

    public query func get5MarketCanisterID() : async Principal {
      return Principal.fromActor(Market);
    };

    public shared({caller}) func transfer(id: Principal, ownerID: Principal, newOwnerID: Principal) : async Text {
        var nftPurchase : NFTActor.NFT = switch (nftMaps.get(id)) {
            case null return "NFT does not exist";
            case (?result) result;
        };
        let transferResult = await nftPurchase.transferTo(newOwnerID);
        Debug.print(Principal.toText(newOwnerID));
        if (transferResult == "Success") {
            itemMaps.delete(id);
            var ownerNFT : List.List<Principal> = switch (ownerMaps.get(ownerID)) {
                case null List.nil<Principal>();
                case (?result) result;
            };
            ownerNFT := List.filter(ownerNFT, func (itemID : Principal) : Bool {
                return itemID != id;
            });
            addToOwner(newOwnerID, id);
            return "Success";
        } else {
            return transferResult;
        }
    };
    public shared({caller}) func new_transfer(to: Principal, tokenId: Principal) : async Text {
        var nftPurchase : NFTActor.NFT = switch (nftMaps.get(tokenId)) {
            case null return "NFT does not exist";
            case (?result) result;
        };
        let transferResult = await nftPurchase.transferTo(to);
        Debug.print(Principal.toText(to));
        if (transferResult == "Success") {
            itemMaps.delete(tokenId);
            var ownerNFT : List.List<Principal> = switch (ownerMaps.get(tokenId)) {
                case null List.nil<Principal>();
                case (?result) result;
            };
            ownerNFT := List.filter(ownerNFT, func (itemID : Principal) : Bool {
                return itemID != to;
            });
            addToOwner(tokenId, to);
            return "Success";
        } else {
            return transferResult;
        }
    };
}