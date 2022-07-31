import HashMap "mo:base/HashMap";
import Customer "customer";
import Principal "mo:base/Principal";


actor CustomerTable {
    public type Customer = Customer.Customer;
    var customerList = HashMap.HashMap<Principal, Customer>(0, Principal.equal, Principal.hash);

    public shared({caller}) func readAccount() : async ?Customer {
        switch(Principal.toText(caller)) {
            case("2vxsx-fae") return null;
            case(_) return customerList.get(caller);
        }
    };

    public query func getLength() : async Int {
        return customerList.size();
    };

    public shared({caller}) func createAccount(customer : Customer) : async Text {  
        switch(Principal.toText(caller)) {
            case("2vxsx-fae") return "Not autheticated";
            case(_) {
                if (customerList.get(caller) == null) {
                    customerList.put(caller, customer);
                    return "Create successfully";
                }
                else {
                    return "Already exist";
                }
            };
        };
    };

    public shared({caller}) func updateAccount(customer : Customer) : async Text {
        switch(Principal.toText(caller)) {
            case("2vxsx-fae") return "Not autheticated";
            case(_) {
                if (customerList.get(caller) == null) {
                    return "Not registered";
                }
                else {
                    var preCustomer = customerList.replace(caller, customer);
                    return "Update successfully";
                };
            };
        };
        
    };

    public shared({caller}) func deleteAccount() : async Text {
        switch(Principal.toText(caller)) {
            case("2vxsx-fae") return "Not autheticated";
            case(_) {
                if (customerList.get(caller) == null) {
                return "Not registered";
                }
                else {
                    var delValue = customerList.remove(caller);
                    return "Delete successfully";
                };
            };
        };
    };
};
