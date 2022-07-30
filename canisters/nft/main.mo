
import Debug "mo:base/Debug";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
// class vi dung de tao smart contract
actor class NFT(name : Text, owner : Principal, content : [Nat8]) = this {
    private let nftName = name;
    // var vi se chuyen no di cho nguoi khac
    private var nftOwner = owner;
    private let nftContent = content;

    // method
    public query func getName() : async Text {
        return nftName;
    };
    public query func getOwner() : async Principal {
        return nftOwner;
    };
    public query func getAsset() : async [Nat8] {
        return nftContent;
    };
    public query func getCanisterID() : async Principal {
        return Principal.fromActor(this);
    };
    // method set owner moi
    public shared({caller}) func transferTo(newOwner : Principal) : async Text {
        if (caller == nftOwner) {
            nftOwner := newOwner;
            return "Success";
        } else {
            return "Error, not initiated by NFT Owner";
        }
    };
}