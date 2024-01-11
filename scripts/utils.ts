import { ContractTransactionResponse, toUtf8Bytes, keccak256 } from 'ethers'
/**
 * Handles a transaction promise with retry attempts and optional error handling.
 *
 * @param {Promise<any>} txPromise - The promise representing the transaction.
 * @param {string} label - The label or description of the transaction.
 * @param {object} options - Options for handling the transaction.
 * @param {boolean} [options.exitIfError=false] - Indicates whether to exit the process if an error occurs.
 * @param {number} [options.RETRY_ATTEMPTS=1] - The number of retry attempts for the transaction.
 * @returns {Promise<void>} - A Promise representing the completion of the handling process.
 */
export async function handleTx(txPromise: Promise<ContractTransactionResponse>, label: string | null = null, { exitIfError = false, RETRY_ATTEMPTS = 1 }: { exitIfError?: boolean; RETRY_ATTEMPTS?: number } = {}): Promise<void> {
    let promiseInfo = label ? label : "contract function"
    let totalGasUsed = 0
    for (let index = 0; index < RETRY_ATTEMPTS; index++) {
        try {
            await txPromise.then(
                async (pendingTx: ContractTransactionResponse) => {
                    console.log(`${promiseInfo} executing, waiting for confirm...`)
                    // pendingTx.wait()
                    const receipt = await pendingTx.wait()
                    if (receipt!.status === 1) {
                        console.log(
                            `${promiseInfo} executing success, txHash: %s, gasUsed: %s, total gasUsed: %s`,
                            receipt?.blockHash,
                            receipt?.gasUsed,
                            (totalGasUsed += Number(receipt?.gasUsed))
                        )
                        index = 100 // Exiting loop if successful
                    } else {
                        console.error(`${promiseInfo} executing failed, receipt: %s`, receipt)
                        process.exit(1)
                    }
                },
                (error: any) => {
                    console.error("failed to execute transaction: %s, error: %s", promiseInfo, error)
                }
            )
        } catch (error) {
            console.error("Error occurred:", error)
            if (exitIfError) {
                process.exit(1)
            }
        }
    }
}

export function getSolidityFunctionSignature(functionName: string) {
    const functionSignature = keccak256(
        toUtf8Bytes(functionName)
    );
    const functionSelector = functionSignature.slice(0, 10);
    return functionSelector;
}
