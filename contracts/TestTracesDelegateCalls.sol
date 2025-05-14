pragma solidity ^0.8.13;

contract TestTracesDelegateCallsCallee {
    uint256 public number;

    function setNumber(uint256 _number) public {
        number = _number;
    }
}

contract TestTracesDelegateCallsCaller {
    uint256 public number;
    address public calleeAddress;

    function setCalleeAddress(address _calleeAddress) public {
        calleeAddress = _calleeAddress;
    }

    function delegateSetNumber(uint256 _number) public {
        (bool success,) = calleeAddress.delegatecall(abi.encodeWithSignature("setNumber(uint256)", _number));

        require(success, "delegateCall failed");
    }
}
