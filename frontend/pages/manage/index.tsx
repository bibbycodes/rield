import React from "react";
import VaultActions from "../../components/LpDepositAndWithdrawModal/LpDepositAndWithdrawModal";

export default function Manage() {
  return (
    <div>
      <VaultActions isOpen={true} setIsOpen={() =>  console.log("UNUSED")}/>
    </div>
  );
}
