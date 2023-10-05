import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { CalculatorExample } from "../target/types/calculator_example";
import { assert } from "chai";
const { SystemProgram } = anchor.web3

describe("calculator-example", () => {
  const provider = anchor.AnchorProvider.local("http://127.0.0.1:8899");
  anchor.setProvider(provider);

  const program = anchor.workspace.CalculatorExample as Program<CalculatorExample>;
  const calculatorPair = anchor.web3.Keypair.generate();
  const text = "Summer School Of Solana"

  //Creating a test block
  it("Creating Calculator Instance", async () => {
    //Calling create instance - Set our calculator keypair as a signer
    await program.methods.create(text).accounts(
      {
        calculator: calculatorPair.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId
      }
    ).signers([calculatorPair]).rpc()

    //We fecth the account and read if the string is actually in the account
    const account = await program.account.calculator.fetch(calculatorPair.publicKey)
    assert.strictEqual(account.greeting, text)
  });

  it('Addition', async () => {

    const operand_x = new anchor.BN(2)
    const operand_y = new anchor.BN(3)

    await program.methods.add(operand_x, operand_y)
      .accounts({
        calculator: calculatorPair.publicKey,
      })
      .rpc()
    const account = await program.account.calculator.fetch(calculatorPair.publicKey)
    assert.isTrue(account.result.eq(new anchor.BN(5)))

    assert.strictEqual(account.result.toString(), operand_x.add(operand_y).toString())

  })
});
